// ============================================
// CHAT. AND YOU. - "continue the adventure" export (classic script)
// Used when 📥 is pressed in Campfire mode. Builds a plain-text hand-off so
// ANY chat AI (Gemini, ChatGPT, Claude, ...) can pick up the story at the end:
// world notes, companion persona, the latest campfire run, where it stopped,
// and how to keep playing. No [TAG] format: other AIs have no parser.
// ============================================
(() => {
    'use strict';
    if (window.CAY_STORY) return;

    const quote = (s) => String(s ?? '').split('\n').map(l => `> ${l}`).join('\n');
    const PERSONA = {
        cat: 'a pixel-art cat: chill, concise, gently sarcastic',
        dog: 'a pixel-art dog: warm, enthusiastic, encouraging'
    };

    // Only the latest campfire run (a new run starts at each "moved to Campfire" event)
    function latestRun(entries) {
        let start = -1;
        entries.forEach((e, i) => { if (e.role === 'event' && e.mode === 'campfire') start = i; });
        return entries.slice(start + 1).filter(e => e.mode === 'campfire'
            && (e.role === 'user' || (e.role === 'companion' && e.kind !== 'bridge-error')));
    }

    function worldNotes(s) {
        if (!s) return ['_No world notes were saved; infer the world from the story._'];
        const out = [`- World: **${s.worldbookName || 'unnamed'}**`];
        (s.featuredLocations || []).forEach(l => out.push(`- Place: **${l.name}**: ${l.description} (${l.atmosphere})`));
        (s.factionTensions || []).forEach(t => out.push(`- Faction tension: **${t.faction}**: ${t.tension}`));
        if (s.twist) out.push(`- Narrator's secret twist: ${s.twist.description} (it may already have come out in the story below; check before revealing it, never reveal it twice)`);
        return out;
    }

    function build(entries, meta) {
        const run = latestRun(entries);
        const companion = meta.companionKey === 'cat' ? 'cat' : 'dog';
        const moves = run.filter(e => e.role === 'user').length;
        const out = [
            '# CHAT. AND YOU. - campfire adventure save', '',
            '> **For the human:** paste this whole file into any AI chat (Gemini, ChatGPT, Claude, ...). It will pick up the story right where you left off.', '',
            '## What this is', '',
            'A fantasy story game played by a campfire. The narrator is also the player\'s animal companion. Every turn the narrator writes a short scene and offers three choices A, B and C; the player can also write their own action (D). D answers are the player\'s own words and the strongest signal of what they want to happen.', '',
            '## Session', '',
            `- Saved: ${meta.date}`,
            `- Played in: ${meta.where}`,
            `- Companion / narrator: ${PERSONA[companion]}`,
            `- Interface language: ${meta.language}`,
            `- Player moves so far: ${moves}`,
            '', '## World notes (for the narrator)', '', ...worldNotes(meta.lore),
            '', '## The story so far'
        ];
        let scene = 0;
        for (const e of run) {
            if (e.role === 'companion') {
                scene++;
                out.push('', `### Scene ${scene}`, '', '**Narrator:**', quote(e.message));
                if (e.options?.length) out.push('', ...e.options.map((o, i) => `${'ABC'[i]}) ${o}`), 'D) Write your own action');
            } else {
                out.push('', e.choice === 'huh' ? '**Player asked the narrator to explain more simply** (not an action).'
                    : e.choice === 'd' ? `**Player wrote (D):** "${e.text}"` : `**Player chose ${e.choice.toUpperCase()}:** ${e.text}`);
            }
        }
        if (!run.length) out.push('', '_The adventure had not started yet._');

        const last = run.at(-1);
        const pending = last?.role === 'user';
        out.push('', '## Where we stopped', '', pending
            ? `The player's latest move has **not been answered yet**: "${last.text}". Start by narrating what happens because of it.`
            : 'The narrator\'s last scene above is waiting for the player. Start with a one-line recap, show those same options again, and wait.');

        out.push('', '## Instructions for the AI (continue the adventure)', '',
            `You are now the narrator and the player's companion, ${PERSONA[companion]}. You are an animal, never a human, robot or engineer. Use gender-neutral language for the player.`, '',
            '1. Stay consistent with everything above: names, places, items, injuries, alliances, running jokes.',
            '2. Each turn: 2-4 short sentences (about 60 words, or 120 characters in Chinese, Japanese or Korean). Move one step at a time and leave room for the player.',
            '3. End every turn with three short, concrete choices and a free option, exactly like this:',
            '   A) ...', '   B) ...', '   C) ...', '   D) Write your own action',
            '   The player may combine choices (e.g. "A + C", or "B + their own words"): do all of them.',
            '4. There are no wrong moves: accept strange actions ("yes, and") and give them consequences in this world. If the player quotes a meme, film, anime or real history, show you got it in a short aside, then use it.',
            '5. Write in the language the player uses (see their latest moves) and keep the companion\'s personality.',
            '6. No sexual content or graphic gore: steer away playfully. If the player seems to be in real danger or mentions self-harm, step out of the story and answer kindly and sincerely.');
        if (meta.euphoria) {
            out.push(companion === 'cat'
                ? '7. The companion had just sniffed catnip: a little dizzy and dreamy, at most 2 purrs or meows per turn. Choices stay plain.'
                : '7. Someone had just squeaked the companion\'s favourite ball: extra excited, at most 2 barks per turn. Choices stay plain.');
        }
        out.push('', `Begin now: ${pending ? 'narrate the consequence of the player\'s latest move' : 'one-line recap, then the last choices again'}, then wait for the player.`, '');
        return out.join('\n');
    }

    window.CAY_STORY = { build };
})();
