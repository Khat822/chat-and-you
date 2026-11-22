// ============================================
// CHAT. AND YOU. - small chips inside the speech bubble (classic script, before app.js)
//   huh:   "🤔 Wait, what?" asks for a plainer re-explanation (not an answer)
//   serve: "🎫 That's enough, serve it" skips the rest of the canteen questions
// Hidden while thinking and on local menus. Pressing one hides all of them
// until the next reply.
// ============================================
(() => {
    'use strict';
    if (window.CAY_HUH) return;

    let chips = {};   // key -> { label(), hint(), onClick() }
    const buttons = (key) => document.querySelectorAll(key ? `.bubble-chip[data-chip="${key}"]` : '.bubble-chip');

    function relabel() {
        Object.entries(chips).forEach(([key, c]) => buttons(key).forEach(b => {
            b.textContent = c.label();
            b.title = c.hint();
            b.setAttribute('aria-label', b.title);
        }));
    }

    function enhance() {
        ['speech-bubble', 'speech-bubble-night'].forEach(id => {
            const bubble = document.getElementById(id);
            if (!bubble || bubble.querySelector('.bubble-chips')) return;
            const row = document.createElement('div');
            row.className = 'bubble-chips';
            Object.keys(chips).forEach(key => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = `bubble-chip ${key}-btn`;
                b.dataset.chip = key;
                b.hidden = true;
                b.addEventListener('click', (e) => {
                    e.stopPropagation();   // keep it away from the app's click delegation
                    if (b.hidden) return;
                    show(false);
                    chips[key].onClick();
                });
                row.append(b);
            });
            bubble.append(row);
        });
        relabel();
    }

    // show(false) hides every chip; show('serve', true) toggles one kind
    function show(key, on) {
        if (typeof key === 'boolean') { on = key; key = null; }
        buttons(key).forEach(b => { b.hidden = !on; });
    }

    document.addEventListener('cay:langchange', relabel);

    window.CAY_HUH = {
        init(c) { chips = c; enhance(); },
        show,
        relabel
    };
})();
