// ============================================
// CHAT. AND YOU. - artwork + ☀️ day / 🌙 night theme (classic script)
// Images live in assets/img (compressed from the 4K originals). URLs are set
// as CSS variables from JS because a content-script CSS file can't use
// relative URLs (they would resolve against aistudio.google.com).
// ============================================
(() => {
    'use strict';
    if (window.CAY_THEME) return;

    const FIXED = {
        '--cay-cat': 'cat.webp',
        '--cay-dog': 'dog.webp',
        '--cay-cat-euph': 'cat-silvervine.webp',
        '--cay-dog-euph': 'dog-ball.webp',
        '--cay-cat-camp': 'cat-campfire.webp',
        '--cay-dog-camp': 'dog-campfire.webp'
    };
    const BY_THEME = {
        '--cay-canteen': (t) => `canteen-${t}.webp`,
        '--cay-forest': (t) => `forest-${t}.webp`,
        '--cay-dragon': (t) => `dragon-${t}.webp`
    };

    function url(file) {
        const path = `assets/img/${file}`;
        try {
            if (window.chrome?.runtime?.id) return chrome.runtime.getURL(path);
        } catch { /* not an extension page */ }
        return new URL(path, document.baseURI).href;
    }

    function apply(theme) {
        const t = theme === 'night' ? 'night' : 'day';
        const style = document.documentElement.style;
        for (const [k, f] of Object.entries(FIXED)) style.setProperty(k, `url("${url(f)}")`);
        for (const [k, f] of Object.entries(BY_THEME)) style.setProperty(k, `url("${url(f(t))}")`);

        const app = document.getElementById('app');
        if (app) app.dataset.theme = t;
        const btn = document.getElementById('theme-btn');
        if (btn) {
            btn.textContent = t === 'night' ? '🌙' : '☀️';
            btn.setAttribute('aria-pressed', String(t === 'night'));
        }
        // Warm the cache so the dragon shows up instantly during the transition
        new Image().src = url(BY_THEME['--cay-dragon'](t));
        return t;
    }

    window.CAY_THEME = { apply, url };
})();
