// ============================================
// CHAT. AND YOU. - multi-pick for A/B/C (classic script, before app.js)
// One tap on an option still sends it right away (most people). A ＋ next to
// each option adds it to a selection instead; then D's Send button sends
// everything together ("Send (2)"), optionally with D text.
// Pre-written local menus (after the ticket, "try another one", care) are locked.
// ============================================
(() => {
    'use strict';
    if (window.CAY_MULTI) return;

    const picks = new Set();
    let cfg = null;   // { sendLabel(), hint() }

    // Wrap every .option-btn in a row with its own ＋ toggle (buttons get their
    // text via textContent, so the toggle can't live inside them).
    function enhance() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.parentElement.classList.contains('option-row')) return;
            const row = document.createElement('div');
            row.className = 'option-row';
            btn.before(row);
            row.append(btn);
            const t = document.createElement('button');
            t.type = 'button';
            t.className = 'pick-toggle';
            t.dataset.pick = btn.dataset.option;
            t.dataset.for = btn.id;
            t.textContent = '＋';
            t.setAttribute('aria-pressed', 'false');
            row.append(t);
        });
    }

    function refreshSend() {
        document.querySelectorAll('#submit-d, #submit-d-night').forEach(b => {
            const base = cfg ? cfg.sendLabel() : b.textContent;
            b.textContent = picks.size ? `${base} (${picks.size})` : base;
        });
    }

    function toggle(letter, btnId) {
        if (picks.has(letter)) picks.delete(letter);
        else picks.add(letter);
        const on = picks.has(letter);
        document.getElementById(btnId)?.classList.toggle('picked', on);
        const t = document.querySelector(`.pick-toggle[data-for="${btnId}"]`);
        if (t) { t.setAttribute('aria-pressed', String(on)); t.textContent = on ? '✓' : '＋'; }
        refreshSend();
    }

    // New turn: clear the selection, hide rows of empty options, lock local menus
    function reset({ locked = false } = {}) {
        picks.clear();
        document.querySelectorAll('.option-row').forEach(row => {
            const btn = row.querySelector('.option-btn');
            const t = row.querySelector('.pick-toggle');
            btn.classList.remove('picked');
            t.setAttribute('aria-pressed', 'false');
            t.textContent = '＋';
            row.style.display = btn.style.display;
            t.hidden = locked;
            if (cfg) { t.title = cfg.hint(); t.setAttribute('aria-label', t.title); }
        });
        refreshSend();
    }

    window.CAY_MULTI = {
        init(c) { cfg = c; enhance(); reset(); },
        toggle,
        reset,
        active: () => picks.size > 0,
        picks: () => [...picks].sort()
    };
})();
