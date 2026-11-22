// ============================================
// CHAT. AND YOU. - 🌿 Catnip (cat) / 🎾 Squeaky Ball (dog) mode (classic script)
// "Drunken master": the companion gets silly, the Kiro Order Ticket stays sober.
// Gemini writes its own sounds (bridge-prompts.js). This file handles our
// pre-written lines, the buttons/visual state, and a safety-net ticket scrub.
// ============================================
(() => {
    'use strict';
    if (window.CAY_EUPHORIA) return;

    const i18n = () => window.CAY_I18N;
    const CJK_END = /[。！？]/;

    // Seasoning, not soup: at most 2 sounds, after the first sentence and at the end
    const END_RE = /[.!?](?=\s|$)|[。！？]/g;
    function loopify(text, companion) {
        const sounds = i18n().t(`${companion}.sounds`);
        if (!text || !Array.isArray(sounds) || !sounds.length) return text;
        const total = (text.match(END_RE) || []).length;
        if (!total) return `${text} ${sounds[0]}`;
        let k = 0, used = 0;
        return text.replace(END_RE, (p) => {
            const add = k === 0 || k === total - 1;
            k++;
            if (!add) return p;
            const s = sounds[used++ % sounds.length];
            return CJK_END.test(p) ? `${p}${s}` : `${p} ${s}`;
        });
    }

    // ---------- Safety net: strip animal sounds from ticket fields ----------
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let soundRe = null;

    function soundsRegex() {
        if (soundRe) return soundRe;
        const t = i18n();
        const known = t.codes().flatMap(code => ['cat', 'dog'].flatMap(k => {
            const v = t.tLang(code, `${k}.sounds`);
            return Array.isArray(v) ? v : [];
        }));
        const generic = [
            '\\b(?:me+o+w+|pu+r{2,}|mrr+p|wo+f+|arf)\\b[~～!！.…]*',   // meow~ purrr woof! arf
            '(?:喵+[嗚呜]*|汪+)[～~！!…]+',                             // 喵嗚～ 汪汪！
            'にゃ+[ーん]*[～~]+', 'ワン+[！!]+'
        ];
        const parts = [...new Set(known)].sort((a, b) => b.length - a.length).map(esc).concat(generic);
        soundRe = new RegExp(parts.join('|'), 'gi');
        return soundRe;
    }

    function scrubText(v) {
        if (typeof v !== 'string') return v;
        return v.replace(soundsRegex(), '')
            .replace(/[ \t]{2,}/g, ' ')
            .replace(/\s+([,，、。.!！;；])/g, '$1')
            .trim();
    }

    const scrubTicket = (fields) =>
        Object.fromEntries(Object.entries(fields || {}).map(([k, v]) => [k, scrubText(v)]));

    // ---------- Buttons + visual state (#app.cay-loopy, styled in euphoria.css) ----------
    function sync({ on, companion }) {
        const app = document.getElementById('app');
        if (app) {
            app.classList.toggle('cay-loopy', !!on);
            if (companion) app.dataset.companion = companion;
        }
        const t = i18n();
        document.querySelectorAll('.euphoria-btn').forEach(btn => {
            btn.textContent = t.t(companion === 'dog' ? 'ui.ball' : 'ui.catnip');
            btn.title = t.t('ui.euphoriaHint');
            btn.setAttribute('aria-pressed', String(!!on));
        });
    }

    window.CAY_EUPHORIA = { loopify, scrubTicket, sync };
})();
