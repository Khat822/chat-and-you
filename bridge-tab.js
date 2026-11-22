// ============================================
// CHAT. AND YOU. - background-tab handling (content script, after content.js)
// People don't stare at "thinking...": they go watch YouTube and come back.
// - Coming back: re-check for a reply right away (AI Studio may only render
//   it once the tab is visible, and Chrome throttles timers in hidden tabs).
// - A reply that arrives while you're away puts 🐾 in front of the tab title.
// ============================================
(() => {
    'use strict';
    if (window.__cayTabLoaded) return;
    window.__cayTabLoaded = true;

    const BADGE = '🐾 ';
    let badged = false;

    function clearBadge() {
        if (badged && document.title.startsWith(BADGE)) document.title = document.title.slice(BADGE.length);
        badged = false;
    }

    document.addEventListener('cay:reply', () => {
        if (!document.hidden || badged) return;
        document.title = BADGE + document.title;
        badged = true;
    });

    function back() {
        if (document.hidden) return;
        clearBadge();
        window.cayBridge?.recheck?.();
    }

    document.addEventListener('visibilitychange', back);
    window.addEventListener('focus', back);
    window.addEventListener('pageshow', back);
})();
