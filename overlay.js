// ============================================
// CHAT. AND YOU. - Overlay mount + "original UI" toggle (content script)
// Mounted on <html>, outside <body>, so AI Studio's SPA can't strip it.
// The pill button (bottom-right) is always visible and switches between
// our UI and the original AI Studio UI. The choice is remembered.
// ============================================
(() => {
    'use strict';
    if (window.__cayOverlayLoaded) return;
    window.__cayOverlayLoaded = true;

    const HIDDEN_KEY = 'cayOverlayHidden';
    let root = null;
    let pill = null;

    const tr = (key) => window.CAY_I18N?.t(key) ?? key;
    const isHidden = () => root.style.display === 'none';

    function label() {
        pill.textContent = tr(isHidden() ? 'ui.backToApp' : 'ui.showAIStudio');
    }

    function setHidden(hidden) {
        root.style.display = hidden ? 'none' : '';
        label();
        document.documentElement.style.overflow = hidden ? '' : 'hidden';
        chrome.storage?.local?.set({ [HIDDEN_KEY]: hidden });
    }

    // Popup "Change companion": show our UI and open the companion selector
    chrome.runtime?.onMessage?.addListener((msg) => {
        if (msg?.type !== 'cay-choose-companion' || !root) return;
        if (isHidden()) setHidden(false);
        document.getElementById('settings-btn')?.click();
    });

    // Re-label when the user switches language in our UI
    // The popup (popup.js) follows the language picked in our UI
    const saveLang = () => { try { chrome.storage.local.set({ lang: window.CAY_I18N?.lang || 'en' }); } catch { /* reloaded */ } };
    document.addEventListener('cay:langchange', () => { if (pill) label(); saveLang(); });

    function makePill() {
        const b = document.createElement('button');
        b.id = 'cay-toggle';
        b.type = 'button';
        b.style.cssText = [
            'position:fixed', 'right:16px', 'bottom:16px', 'z-index:2147483647',
            'padding:10px 14px', 'border:2px solid #120a06', 'border-radius:2px',
            'background:rgba(28,18,12,.85)', 'color:#f6ecd9', 'font:bold 13px/1 "Courier New",monospace',
            'box-shadow:0 0 0 2px rgba(218,165,90,.75),3px 4px 0 2px rgba(0,0,0,.4)', 'cursor:pointer'
        ].join(';');
        b.addEventListener('click', () => setHidden(!isHidden()));
        return b;
    }

    async function mount() {
        const html = await (await fetch(chrome.runtime.getURL('index.html'))).text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('script').forEach(s => s.remove());

        root = document.createElement('div');
        root.id = 'cay-root';
        root.style.cssText = 'position:fixed;inset:0;z-index:2147483646;overflow:auto;background:#f4e4c1;';
        root.append(...[...doc.body.childNodes].map(n => document.importNode(n, true)));
        pill = makePill();
        document.documentElement.append(root, pill);

        const fonts = doc.querySelector('link[href*="fonts.googleapis.com/css2"]');
        if (fonts) document.head.appendChild(document.importNode(fonts, true));

        // Self-heal: if AI Studio rewrites <html> children, re-attach the SAME nodes
        new MutationObserver(() => {
            if (!root.isConnected) document.documentElement.appendChild(root);
            if (!pill.isConnected) document.documentElement.appendChild(pill);
        }).observe(document.documentElement, { childList: true });

        const saved = await new Promise(r => {
            try { chrome.storage.local.get(HIDDEN_KEY, v => r(v || {})); } catch { r({}); }
        });
        setHidden(saved[HIDDEN_KEY] === true);

        window.chatAndYou?.boot();
        saveLang();
        console.info('[CAY] overlay mounted');
    }

    mount().catch(err => console.error('[CAY] overlay mount failed', err));
})();
