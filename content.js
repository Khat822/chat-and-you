// ============================================
// CHAT. AND YOU. - AI Studio bridge (content script)
// Load order (manifest): i18n -> app.js -> bridge-parse.js -> bridge-prompts.js
// -> content.js -> overlay.js. All share one isolated world:
// window.chatAndYou / CAY_PARSE / CAY_PROMPTS / cayBridge.
// ============================================
(() => {
    'use strict';
    if (window.__cayBridgeLoaded) return;
    window.__cayBridgeLoaded = true;

    const SETTLE_MS = 900;          // no DOM changes for this long = stream finished
    const SENT_CHECK_MS = 8000;     // our message must show up by then (long chats render slowly)
    const TIMEOUT_MS = 45000;
    const GRACE_MS = 15000;         // after coming back to the tab, before calling it a failure

    // Selectors as of late 2025 (ms-prompt-box). Older ones kept as fallbacks.
    // No bare `textarea`: that could hit the System Instructions box.
    const SEL = {
        input: ['ms-prompt-box textarea[aria-label="Enter a prompt"]', 'ms-prompt-box ms-autosize-textarea textarea',
            'ms-prompt-box textarea', 'ms-prompt-input-wrapper textarea', 'textarea[aria-label="Type something"]'],
        send: ['ms-prompt-box ms-run-button button[aria-label="Run"]', 'ms-prompt-box button[aria-label="Run"][type="submit"]',
            'ms-run-button button[type="submit"]', 'button[aria-label="Run"].run-button', 'button[aria-label="Run"]']
    };

    const log = (...a) => console.info('%c[CAY]', 'color:#ff6b9d;font-weight:bold', ...a);
    const describe = (el) => el ? `<${el.tagName.toLowerCase()} aria-label="${el.getAttribute('aria-label') || ''}" disabled=${!!el.disabled}>` : 'null';
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const ourRoot = () => document.getElementById('cay-root');
    const find = (list) => list.map(s => document.querySelector(s)).find(el => el && !ourRoot()?.contains(el)) || null;
    const chatText = () => document.body?.textContent || '';

    let turn = 0;
    let awaiting = null;            // { id, text, timer, settle, sentCheck }
    // Every reply ever seen or delivered this page session. AI Studio unloads
    // old turns from long chats and may render them again later (it did after a
    // safety block), so "not on the page right before sending" isn't enough to
    // call a reply new: an old canteen reply once leaked into the campfire.
    const everSeen = new Set();
    const primedModes = new Set();

    // Primer text lives in bridge-prompts.js
    const primer = (...args) => window.CAY_PROMPTS.primer(...args);

    // ---------- Finding our reply (parsing lives in bridge-parse.js) ----------
    const P = window.CAY_PARSE;
    const markerAt = () => awaiting ? chatText().lastIndexOf(`[TURN ${awaiting.id}]`) : -1;

    // 1) Our [TURN] marker is on the page: parse only the text after it (exact).
    // 2) AI Studio unloaded our message from a long chat: take the newest complete
    //    reply that wasn't on the page before we sent.
    function findReply() {
        const text = chatText();
        const at = markerAt();
        if (at >= 0) {
            const tags = P.parseChunk(text.slice(at));
            if (P.isComplete(tags)) return { tags, via: 'marker' };
            return { tags: null, via: `marker found, ${text.length - at} chars, tags incomplete` };
        }
        const tags = P.newestNewReply(text, awaiting.seen);
        return tags ? { tags, via: 'new reply (marker not in DOM)' } : { tags: null, via: 'no marker, no new reply yet' };
    }

    // While AI Studio is still generating, its Run button turns into "Stop".
    // Thinking models may draft full tags in their thoughts first, so complete
    // tags don't count until generation has ended. If no Stop button is found we
    // accept right away (old behaviour); a stuck "Stop" is capped at 30s.
    const STOP_RE = /stop|停止|中止|정지|detener|arrêter|stopp/i;
    const isGenerating = () => [...document.querySelectorAll('ms-run-button button, ms-prompt-box button')]
        .some(b => STOP_RE.test(`${b.getAttribute('aria-label') || ''} ${b.textContent}`));

    function checkResponse() {
        if (!awaiting) return;
        if (markerAt() >= 0) primedModes.add(awaiting.mode);   // the primer really reached the chat
        const { tags, via } = findReply();
        if (!tags) { if (!checkBlocked()) log('waiting:', via); return; }
        // Without our marker we can't be sure the reply is ours: a block wins
        if (via !== 'marker' && checkBlocked()) return;
        if (isGenerating()) {
            awaiting.completeSince ??= Date.now();
            if (Date.now() - awaiting.completeSince < 30000) {
                log('tags complete but still generating (maybe a draft in thoughts), waiting');
                clearTimeout(awaiting.settle);
                awaiting.settle = setTimeout(checkResponse, 1500);
                return;
            }
        }
        log(`reply parsed via ${via}${awaiting.failed ? ' (late, after a timeout)' : ''}:`, tags);
        primedModes.add(awaiting.mode);
        finish();
        deliver(tags);
    }

    // bridge-tab.js listens for 'cay:reply' (🐾 in the tab title if you're away)
    function deliver(tags) {
        if (!tags.blocked) everSeen.add(P.signature(tags));
        document.dispatchEvent(new CustomEvent('cay:reply'));
        window.chatAndYou?.handleAIResponse(tags);
    }

    // A hidden tab (user went to watch YouTube) proves nothing: Chrome throttles
    // timers and AI Studio may not render until the tab is back. Decide later.
    function onTimeout(text) {
        if (!awaiting) return;
        if (document.hidden) {
            awaiting.deferred = true;
            log('timeout while the tab is hidden: deciding when you come back');
            return;
        }
        checkBlocked() || fail(text, timeoutReason(), { keepListening: true });
    }

    // AI Studio hard block (a new safety banner, no tags) or a plain-text refusal
    // that stays put for 4s. Either way the app shows a cute "try another one".
    function blockedReason() {
        if (isGenerating()) return null;
        const text = chatText();
        if (P.countBlocks(text) > awaiting.blockBase) return 'safety block';
        const at = markerAt();
        const after = at >= 0 ? text.slice(at) : '';
        if (!after || after.includes('[STATUS') || !P.looksLikeRefusal(after)) return null;
        awaiting.refusalSince ??= Date.now();
        if (Date.now() - awaiting.refusalSince >= 4000) return 'plain-text refusal';
        clearTimeout(awaiting.settle);
        awaiting.settle = setTimeout(checkResponse, 1500);
        return null;
    }

    function checkBlocked() {
        if (!awaiting) return false;
        const reason = blockedReason();
        if (!reason) return false;
        log('blocked:', reason);
        finish();
        deliver({ blocked: true });
        return true;
    }

    function finish() {
        if (!awaiting) return;
        ['timer', 'settle', 'sentCheck'].forEach(k => clearTimeout(awaiting[k]));
        awaiting = null;
    }

    // reasonKey: failNoBox | failNotSent | failNoReply | failFormat (i18n/<lang>.js)
    const tr = (key) => window.CAY_I18N?.t(key) ?? key;

    // keepListening: show the problem, but still accept a late reply if one arrives
    function fail(text, reasonKey, { keepListening = false } = {}) {
        log('FAILED:', reasonKey, keepListening ? '(still listening for a late reply)' : '');
        if (keepListening && awaiting) {
            awaiting.failed = true;
            ['timer', 'sentCheck'].forEach(k => clearTimeout(awaiting[k]));
        } else {
            finish();
        }
        // Worldbook forge: the import window shows the problem, not the chat
        if (window.chatAndYou?.state.forging) return window.chatAndYou.forgeFailed(reasonKey);
        const companion = window.chatAndYou?.state.companion || 'dog';
        if (window.chatAndYou) window.chatAndYou.state.nextKind = 'bridge-error';   // label it in the transcript
        window.chatAndYou?.displayMessage(
            `${tr(`${companion}.oops`)} ${tr(`ui.${reasonKey}`)} ${tr('ui.failHint')}`,
            [text, '', '']);
    }

    // Debounced: streaming fires many mutations; parse once they settle
    new MutationObserver(() => {
        if (!awaiting) return;
        clearTimeout(awaiting.settle);
        awaiting.settle = setTimeout(checkResponse, SETTLE_MS);
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

    // ---------- Sending ----------
    function typeInto(el, value) {
        el.focus();
        el.select?.();
        // insertText fires real beforeinput/input events, so Angular updates its model
        let ok = false;
        try { ok = document.execCommand('insertText', false, value); } catch { ok = false; }
        if (!ok || el.value !== value) {
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
        el.closest('ms-autosize-textarea, .text-wrapper')?.setAttribute('data-value', value);
        log(`typed via ${ok ? 'insertText' : 'value setter'}; value ok: ${el.value === value}`);
    }

    async function submit(el) {
        for (let i = 0; i < 20; i++) {                // Run enables a moment after input
            const btn = find(SEL.send);
            if (btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                btn.click();
                log('clicked Run', describe(btn));
                return;
            }
            await sleep(150);
        }
        log('Run never enabled:', describe(find(SEL.send)), '-> trying Ctrl+Enter');
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', ctrlKey: true, bubbles: true }));
    }

    window.cayBridge = {
        resetMode(mode) { primedModes.delete(mode); },
        // Called by bridge-tab.js when the tab is visible again
        recheck() {
            if (!awaiting) return;
            log('tab visible again: re-checking now');
            checkResponse();
            if (!awaiting?.deferred) return;
            awaiting.deferred = false;
            clearTimeout(awaiting.timer);
            const text = awaiting.text;
            awaiting.timer = setTimeout(() => onTimeout(text), GRACE_MS);
        },
        // raw: a self-contained one-shot prompt (worldbook forge): no mode primer
        async send(text, { mode, companion, loreBrief, language, opener, spice, euphoria, raw = false, round = 0, scene = '' }) {
            const input = find(SEL.input);
            log('prompt box:', describe(input));
            if (!input) return fail(text, 'failNoBox');
            finish();
            const id = `cay-${++turn}`;
            // Canteen round budget (bridge-prompts.js): the AI can't count turns reliably itself
            // Campfire: time of day follows the ☀️/🌙 artwork (bridge-prompts.js)
            const budget = mode === 'canteen' && round ? `\n\n(Round ${round} of 4)`
                : mode === 'campfire' && scene ? `\n\n(Scene: ${scene})` : '';
            let msg = `${text}${budget}\n\n[TURN ${id}]`;
            if (!raw && !primedModes.has(mode)) msg = `${primer(mode, companion, loreBrief, language, opener, spice, euphoria)}\n\n---\nMy answer: ${msg}`;
            const before = chatText();
            P.snapshot(before).forEach(s => everSeen.add(s));
            awaiting = {
                id, text, mode,
                seen: everSeen,                    // replies already seen (filled just above)
                baseLen: before.length,
                blockBase: P.countBlocks(before),  // safety banners already on the page
                timer: setTimeout(() => onTimeout(text), TIMEOUT_MS)
            };
            chrome.storage?.local?.set({ companion, currentMode: mode });

            typeInto(input, msg);
            await submit(input);
            if (awaiting?.id !== id) return;
            // "Not sent" only if nothing at all happened: no marker, no new text, not generating
            awaiting.sentCheck = setTimeout(() => {
                if (awaiting?.id !== id || markerAt() >= 0 || isGenerating()) return;
                if (chatText().length > awaiting.baseLen + 50) return;
                if (document.hidden) { awaiting.deferred = true; return; }
                fail(text, 'failNotSent', { keepListening: true });
            }, SENT_CHECK_MS);
        }
    };

    function timeoutReason() {
        const text = chatText();
        const at = markerAt();
        const grew = text.length - awaiting.baseLen;
        log('timeout:', { markerFound: at >= 0, grewBy: grew }, (at >= 0 ? text.slice(at) : text.slice(-800)).slice(0, 800));
        if (at < 0) return grew > 50 ? 'failFormat' : 'failNotSent';
        return text.length - at < 60 ? 'failNoReply' : 'failFormat';
    }
})();
