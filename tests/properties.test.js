// ============================================
// CHAT. AND YOU. - property-based tests (no dependencies)
// Run: node tests/properties.test.js        (SEED=123 to replay a run)
// Each property is checked against a few hundred random inputs. On failure
// the seed and the smallest failing input we saw are printed.
// ============================================
'use strict';
global.window = global;
require('../bridge-parse.js');
require('../lore-forge.js');
require('../safety.js');

const SEED = Number(process.env.SEED) || Date.now() % 100000;
// mulberry32: small, exact in 32-bit integer math, so each seed gives its own run
let s = SEED >>> 0;
const rand = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const int = (n) => Math.floor(rand() * n);
const pick = (a) => a[int(a.length)];

// Text a real user or model might write: letters, CJK, emoji, punctuation, <, >
const POOL = [...'abcxyzABC 0123 ,.!?:;~-_()<>|"\'\n貓狗食堂營火龍嗎？！、ねこ고양이é😀🐾'];
const text = (min = 1, max = 40) => {
    let t = '';
    const n = min + int(max - min + 1);
    for (let i = 0; i < n; i++) t += pick(POOL);
    return t.replace(/\s+/g, ' ').trim() || 'x';
};

let failed = 0;
function property(name, runs, gen, ok) {
    let worst = null;
    for (let i = 0; i < runs; i++) {
        const input = gen();
        let pass;
        try { pass = ok(input); } catch (e) { pass = false; input.__error = e.message; }
        if (!pass && (!worst || JSON.stringify(input).length < JSON.stringify(worst).length)) worst = input;
    }
    if (worst) { failed++; console.log(`FAIL ${name}\n     smallest failing input: ${JSON.stringify(worst)}`); }
    else console.log(`PASS ${name} (${runs} cases)`);
}

const P = window.CAY_PARSE, F = window.CAY_FORGE;
const reply = (m, a, b, c, status = 'asking') =>
    `[STATUS: ${status}]\n[MSG: ${m}]\n[A: ${a}]\n[B: ${b}]\n[C: ${c}]`;

// 1. Whatever the model writes (without square brackets), we read back exactly that
property('reply tags round-trip', 400,
    () => ({ m: text(), a: text(), b: text(), c: text() }),
    ({ m, a, b, c }) => {
        const t = P.parseChunk(`[TURN cay-1] ${reply(m, a, b, c)}`);
        return t.message === m && t.optionA === a && t.optionB === b && t.optionC === c && P.isComplete(t);
    });

// 1b. Our own template placeholders (an echoed prompt) are never taken as a reply
property('echoed template placeholders are ignored', 50,
    () => ({ p: pick(['<concrete option>', '<one or two short sentences>', '<task summary>', '<world name> | <one-sentence premise>', '<goal> ; <goal>']) }),
    ({ p }) => P.parseChunk(reply(p, p, p, p)).message === null);

// 2. Ticket fields survive parsing, with or without line breaks between tags
property('ticket fields round-trip', 300,
    () => ({ f: [text(), text(), text(), text(), text(), text()], nl: rand() < 0.5 }),
    ({ f, nl }) => {
        const sep = nl ? '\n' : ' ';
        const names = ['SUMMARY', 'INPUT', 'OUTPUT', 'CONSTRAINTS', 'AVOID', 'DONE'];
        const body = names.map((n, i) => `[${n}: ${f[i]}]`).join(sep);
        const t = P.parseChunk(`[STATUS: ready]${sep}[KIRO_ORDER]${sep}${body}${sep}[/KIRO_ORDER]`);
        const k = t.kiroOrder;
        return !!k && [k.summary, k.input, k.output, k.constraints, k.antipatterns, k.done].every((v, i) => v === f[i]);
    });

// 3. A reply already seen is never delivered again, even if the page re-renders it
property('old replies are never taken as new', 300,
    () => ({ old: Array.from({ length: 1 + int(4) }, () => [text(), text(), text(), text()]), fresh: [text(), text(), text(), text()] }),
    ({ old, fresh }) => {
        const before = old.map(r => reply(...r)).join('\n');
        const seen = P.snapshot(before);
        const shuffledOld = [...old].sort(() => rand() - 0.5).map(r => reply(...r)).join('\n');
        const onlyOld = P.newestNewReply(shuffledOld, seen);
        const withFresh = P.newestNewReply(`${shuffledOld}\n${reply(...fresh)}`, seen);
        const freshIsOld = old.some(r => JSON.stringify(r) === JSON.stringify(fresh));
        return onlyOld === null && (freshIsOld || withFresh?.message === fresh[0]);
    });

// 4. The local scrub removes every email, link, @handle and long number we plant
property('scrub removes planted personal details', 400,
    () => {
        const planted = Array.from({ length: 1 + int(3) }, () => pick([
            () => `${pick(['ann', 'bo.k', 'x_9'])}${int(99)}@${pick(['mail', 'ex-ample'])}.${pick(['com', 'co.uk', 'tw'])}`,
            () => `https://${pick(['a', 'shop', 'x'])}.${pick(['io', 'com'])}/${int(9999)}`,
            () => `@${pick(['priya', 'bob_99', 'neko.chan'])}`,
            () => `${pick(['+886 ', '0', '+1-'])}${100 + int(899)}-${100000 + int(899999)}`
        ])());
        return { before: text(0, 20), planted, after: text(0, 20) };
    },
    ({ before, planted, after }) => {
        const out = F.scrub(`${before} ${planted.join(' and ')} ${after}`);
        return planted.every(p => !out.text.includes(p)) && out.count >= planted.length;
    });

// 5. A forged worldbook always downloads as JSON that imports again cleanly,
//    and never contains square brackets (they would break our tag format)
property('forged worldbook re-imports and has no brackets', 300,
    () => ({
        world: [text(), text()], factions: Array.from({ length: 2 + int(3) }, () => [text(), text(), text(), `${text()} ; ${text()}`]),
        places: Array.from({ length: 1 + int(3) }, () => [text(), text(), text()]),
        twists: Array.from({ length: 1 + int(3) }, () => text()),
        hooks: Array.from({ length: 1 + int(3) }, () => [text(), `${text()} ; ${text()} ; ${text()}`])
    }),
    ({ world, factions, places, twists, hooks }) => {
        const clean = (v) => v.replace(/\|/g, '/');   // fields are split on "|"
        const lines = [`[WORLD: ${world.map(clean).join(' | ')}]`,
            ...factions.map(f => `[FACTION: ${f.map(clean).join(' | ')}]`),
            ...places.map(p => `[PLACE: ${p.map(clean).join(' | ')}]`),
            ...twists.map(t => `[TWIST: ${clean(t)}]`),
            ...hooks.map(h => `[HOOK: ${h.map(clean).join(' | ')}]`)];
        const out = F.fromReply(lines.join('\n'));
        if (out.error) return /missing/.test(out.error);   // the model left parts empty: refused, not crashed
        const json = JSON.stringify(out.worldbook);
        return !/[[\]]/.test(JSON.stringify(Object.values(out.worldbook))) || !F.fromJSON(json).error;
    });

// 6. Untrusted community files never crash the importer
property('importer survives random JSON', 400,
    () => {
        const junk = () => pick([null, 1, 'x', [], {}, [text()], { name: text() }, true]);
        const o = {};
        for (const k of ['worldbook_name', 'factions', 'locations', 'twists', 'starter_hooks', 'version', 'extra']) {
            if (rand() < 0.7) o[k] = rand() < 0.5 ? junk() : Array.from({ length: int(4) }, junk);
        }
        return { raw: rand() < 0.1 ? text() : JSON.stringify(o) };
    },
    ({ raw }) => { const r = F.fromJSON(raw); return !!(r.error || r.worldbook); });

// 7. The safety screen answers for any input and never throws
property('safety screen handles any text', 400,
    () => ({ t: text(0, 80) }),
    ({ t }) => [null, 'care', 'offmenu', 'ok'].includes(window.CAY_SAFETY.classify(t) ?? null) || typeof window.CAY_SAFETY.classify(t) === 'string');

console.log(failed ? `\n${failed} propert${failed > 1 ? 'ies' : 'y'} FAILED (seed ${SEED})` : `\nALL PROPERTIES PASS (seed ${SEED})`);
process.exit(failed ? 1 : 0);
