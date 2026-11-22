// ============================================
// CHAT. AND YOU. - i18n core (classic script, loads before the language packs)
// Every pack is bundled locally, so the companion's FIRST message appears
// in the user's language instantly, with no round trip to Gemini.
// Add a language: create i18n/<code>.js calling CAY_I18N.register(), then
// list it in index.html and manifest.json.
// ============================================
(() => {
    'use strict';
    if (window.CAY_I18N) return;

    const packs = {};
    let current = 'en';

    // Map a BCP-47 tag (navigator.languages) to one of our pack codes
    function match(tag) {
        const t = String(tag || '').toLowerCase();
        if (packs[tag]) return tag;
        if (t.startsWith('zh')) {
            return /hant|tw|hk|mo/.test(t) ? 'zh-TW' : 'zh-CN';
        }
        const base = t.split('-')[0];
        return Object.keys(packs).find(code => code.toLowerCase() === base) || null;
    }

    const lookup = (code, key) => key.split('.').reduce((o, k) => (o == null ? o : o[k]), packs[code]);

    const api = {
        register(code, pack) { packs[code] = pack; },
        // Add one feature's strings to an existing pack (e.g. i18n/lore-*.js)
        extend(code, part) {
            const p = packs[code];
            if (!p) return;
            Object.entries(part).forEach(([k, v]) => { p[k] = { ...(p[k] || {}), ...v }; });
        },
        codes: () => Object.keys(packs),
        label: (code) => packs[code]?.label || code,
        get lang() { return current; },
        // English name for the AI primer, e.g. "Traditional Chinese (Taiwan)"
        get languageName() { return packs[current]?.languageName || 'English'; },

        detect() {
            const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
            for (const tag of prefs) {
                const code = match(tag);
                if (code) return code;
            }
            return 'en';
        },

        isSupported: (code) => !!packs[code],

        set(code) {
            current = packs[code] ? code : 'en';
            document.documentElement.lang = current;
            document.dispatchEvent(new CustomEvent('cay:langchange', { detail: current }));
        },

        // t('ui.send'), t('cat.canteen') -> string or object; falls back to English
        t(key, vars) {
            let v = lookup(current, key);
            if (v == null) v = lookup('en', key);
            if (v == null) return key;
            return typeof v === 'string' && vars ? v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : v;
        },

        // Lookup in a specific language (e.g. the English demo script)
        tLang: (code, key) => lookup(code, key) ?? lookup('en', key) ?? key,

        // Fill [data-i18n], [data-i18n-placeholder], [data-i18n-title] inside root
        apply(root = document) {
            root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = api.t(el.dataset.i18n); });
            root.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = api.t(el.dataset.i18nPlaceholder); });
            root.querySelectorAll('[data-i18n-title]').forEach(el => {
                el.title = api.t(el.dataset.i18nTitle);
                // Icon-only controls need an accessible name; labelled ones keep theirs
                if (!el.dataset.i18n) el.setAttribute('aria-label', el.title);
            });
            root.querySelectorAll('select.lang-select').forEach(sel => {
                if (sel.options.length !== api.codes().length) {
                    sel.replaceChildren(...api.codes().map(code => new Option(api.label(code), code)));
                }
                sel.value = current;
            });
        }
    };

    window.CAY_I18N = api;
})();
