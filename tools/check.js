// ============================================
// CHAT. AND YOU. - project check, run by the Kiro hooks in .kiro/hooks/
// (and by hand: node tools/check.js). No dependencies.
//   1. every .js file parses (node --check)
//   2. files over the steering limit (200 lines) are reported
//   3. all 8 language packs define the same keys as English
// Exit 1 only for real errors (syntax, missing keys); size is a warning.
// ============================================
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['.git', '.kiro', '4K', '_archive', 'node_modules', 'assets', 'lore-packs']);
const LIMIT = 200;
// Older files written before the split rule; new code must not join this list
const LEGACY = new Set(['app.js', 'styles.css', 'demo-scripts.js', 'content.js', 'lore-shuffler.js', 'artwork.css']);

function walk(dir, out = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP.has(e.name)) continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (/\.(js|css|html)$/.test(e.name)) out.push(p);
    }
    return out;
}

let errors = 0;
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

for (const file of walk(ROOT)) {
    const lines = fs.readFileSync(file, 'utf8').split('\n').length;
    if (file.endsWith('.js')) {
        try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); }
        catch (e) { errors++; console.log(`SYNTAX ${rel(file)}\n${String(e.stderr).split('\n').slice(0, 4).join('\n')}`); }
    }
    if (lines > LIMIT) {
        const tag = LEGACY.has(path.basename(file)) ? 'legacy, to split' : 'NEW FILE OVER LIMIT';
        console.log(`SIZE   ${rel(file)}: ${lines} lines (${tag})`);
    }
}

// i18n parity: flatten every pack and compare with English
global.window = global;
Object.defineProperty(global, 'navigator', { value: { languages: ['en'] }, configurable: true });
global.document = { documentElement: {}, dispatchEvent() {}, addEventListener() {} };
global.CustomEvent = class {};
require(path.join(ROOT, 'i18n/i18n.js'));
// Capture the raw packs (lookups fall back to English, which would hide gaps)
const raw = {};
const merge = (code, part) => {
    raw[code] ||= {};
    for (const [k, v] of Object.entries(part)) raw[code][k] = v && typeof v === 'object' && !Array.isArray(v) ? { ...(raw[code][k] || {}), ...v } : v;
};
window.CAY_I18N.register = merge;
window.CAY_I18N.extend = merge;
const codes = ['en', 'zh-TW', 'zh-CN', 'ja', 'ko', 'es', 'fr', 'de'];
codes.forEach(c => require(path.join(ROOT, `i18n/${c}.js`)));
['lore-latin.js', 'lore-cjk.js'].forEach(f => require(path.join(ROOT, `i18n/${f}`)));
global.window.POPUP_TEXT = undefined;
require(path.join(ROOT, 'popup-i18n.js'));
const flat = (o, pre = '') => Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${pre}${k}.`) : [`${pre}${k}`]);
const report = (where, ref, got) => {
    const have = new Set(flat(got || {}));
    const missing = flat(ref).filter(k => !have.has(k));
    if (missing.length) { errors++; console.log(`I18N   ${where} is missing: ${missing.join(', ')}`); }
};
for (const c of codes.slice(1)) {
    report(c, raw.en, raw[c]);
    report(`popup ${c}`, window.POPUP_TEXT.en, window.POPUP_TEXT[c]);
}

console.log(errors ? `\n${errors} problem(s) found` : '\nCheck OK: syntax fine, every language pack complete');
process.exit(errors ? 1 : 0);
