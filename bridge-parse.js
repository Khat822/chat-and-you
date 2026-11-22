// ============================================
// CHAT. AND YOU. - tag parsing for the AI Studio bridge (classic script).
// Loaded before content.js; pure functions, no DOM access.
// ============================================
(() => {
    'use strict';
    if (window.CAY_PARSE) return;

    // One or more "<english words>" joined by | or ; (e.g. "<world name> | <premise>")
    const PH = `<[a-z][a-z0-9 ,'"()/.-]*>`;
    const PLACEHOLDER = new RegExp(`^${PH}(?:\\s*[|;]\\s*${PH})*$`, 'i');
    // Last value of a tag; template placeholders like "<one or two sentences>" don't count
    const lastMatch = (chunk, re) => {
        let v = null;
        for (const m of chunk.matchAll(re)) v = m[1].trim();
        // Only our English template placeholders ("<concrete option>") are skipped:
        // "<3 love it" or "<貓>" is real text (found by tests/properties.test.js)
        return v && !PLACEHOLDER.test(v) ? v : null;
    };
    const tag = (chunk, name) => lastMatch(chunk, new RegExp(`\\[${name}:\\s*([^\\]]+?)\\s*\\]`, 'g'));

    function parseChunk(chunk) {
        const order = lastMatch(chunk, /\[KIRO_ORDER\]([\s\S]*?)\[\/KIRO_ORDER\]/g);
        // Worldbook forge (lore-forge.js): kept raw; only counts with a real WORLD line
        const lore = lastMatch(chunk, /\[LORE\]([\s\S]*?)\[\/LORE\]/g);
        return {
            lore: lore && tag(lore, 'WORLD') ? lore : null,
            status: tag(chunk, 'STATUS'), message: tag(chunk, 'MSG'),
            optionA: tag(chunk, 'A'), optionB: tag(chunk, 'B'), optionC: tag(chunk, 'C'),
            kiroOrder: order && {
                summary: tag(order, 'SUMMARY'), input: tag(order, 'INPUT'), output: tag(order, 'OUTPUT'),
                constraints: tag(order, 'CONSTRAINTS'), antipatterns: tag(order, 'AVOID'), done: tag(order, 'DONE')
            }
        };
    }

    const isComplete = (t) => !!t.lore || !!t.kiroOrder || !!(t.message && t.optionA && t.optionB && t.optionC);
    const signature = (t) => JSON.stringify(t.lore || t.kiroOrder || [t.message, t.optionA, t.optionB, t.optionC]);

    // Every reply starts with [STATUS: ...]; cut the page text into reply-sized blocks
    function replyBlocks(text) {
        const starts = [...text.matchAll(/\[STATUS:/g)].map(m => m.index);
        return starts.map((s, i) => text.slice(s, starts[i + 1] ?? text.length));
    }

    // Complete replies already on the page (taken right before sending)
    function snapshot(text) {
        return new Set(replyBlocks(text).map(parseChunk).filter(isComplete).map(signature));
    }

    // Newest complete reply that was NOT on the page when we sent.
    // Works even if AI Studio unloaded our own message (and its [TURN] marker)
    // from the DOM, which it does to long chats.
    function newestNewReply(text, seen) {
        const blocks = replyBlocks(text);
        for (let i = blocks.length - 1; i >= 0; i--) {
            const t = parseChunk(blocks[i]);
            if (isComplete(t) && !seen.has(signature(t))) return t;
        }
        return null;
    }

    // AI Studio's own safety block banners. Counted over the whole page and compared
    // with the count taken before sending, so static UI text never triggers it.
    const BLOCK_RE = /content (?:was |has been )?blocked|response (?:was )?blocked|blocked (?:due to|for) safety|prohibited content|内容已被屏蔽|內容已遭封鎖|已遭到封鎖|コンテンツがブロック|콘텐츠가 차단/gi;
    const countBlocks = (text) => (String(text).match(BLOCK_RE) || []).length;

    // Plain-text refusal (model ignored the tag format)
    const REFUSAL_RE = /\bI (?:can(?:not|['’]t)|won['’]t|am (?:not able|unable)|'m (?:not able|unable))\b[^.\n]{0,40}\b(?:help|assist|provide|create|write|generate|comply)|無法(?:協助|提供|回答|處理)|无法(?:协助|提供|回答|处理)|不能(?:協助|协助|提供)|お手伝いできません|お応えできません|도와드릴 수 없|no puedo (?:ayudar|proporcionar)|je ne peux pas (?:aider|fournir)|ich kann (?:dabei )?nicht helfen/i;
    const looksLikeRefusal = (text) => REFUSAL_RE.test(String(text));

    window.CAY_PARSE = { parseChunk, isComplete, signature, replyBlocks, snapshot, newestNewReply, countBlocks, looksLikeRefusal };
})();
