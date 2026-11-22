# Requirements: CHAT. AND YOU. MVP

Source of truth for rules: `.kiro/steering/Project Rules.md`.

## R1. ABCD loop (both modes)
- R1.1 WHEN any turn is shown THEN the UI SHALL show one short message, three distinct options (A, B, C) and an Option D free-text input.
- R1.4 One tap on an option sends it. A ＋ next to each option adds it to a multi-pick; Send then sends the picks (and D text, if any) as one answer joined with " + ". Pre-written local menus cannot be combined.
- R1.2 The UI SHALL never open on an empty prompt box.
- R1.3 Empty options SHALL be hidden and not clickable.

## R2. Companions
- R2.1 The user SHALL choose Cat or Dog before chatting, and SHALL be able to switch at any time.
- R2.2 Companions SHALL be pixel-art animals only. No human, robot or engineer imagery; no collared shirts, ties, glasses or ID badges.
- R2.3 Cat tone: chill, concise, gently sarcastic. Dog tone: warm, enthusiastic, encouraging. Language SHALL be gender-neutral.
- R2.4 Costumes: Cat wears an apron (Canteen) and a cloak (Campfire); Dog wears a bandana (Canteen) and holds a lantern (Campfire).

## R3. Canteen mode
- R3.1 The scene SHALL show a glowing `CHAT. AND YOU.` sign that never overlaps the dialogue.
- R3.2 WHEN 3-4 rounds are done (pain point -> input/output -> constraints) THEN a Kiro Order Ticket SHALL appear with Summary, Input, Output, Constraints, Anti-patterns.
- R3.3 Option D answers SHALL appear in the ticket in the user's own words.
- R3.4 The ticket SHALL be copyable in one click; "Start Over" SHALL restart the canteen.

## R4. Transition
- R4.1 The button `Off the clock: Let's talk Dragons & Magic` SHALL play a pixel dragon flyover, then switch to the Dusk Forest Campfire.
- R4.2 Repeated clicks during the flyover SHALL NOT start extra transitions.

## R5. Campfire mode
- R5.1 The first message SHALL start with `Hey, you. You're finally awake.`
- R5.2 Each session SHALL load a worldbook from `/lore-packs/*.json` and sample 1 hook, 2 faction tensions (from 2 different factions) and 1 twist.
- R5.3 Tensions SHALL surface around rounds 2-3 and the twist around round 4.
- R5.4 The flame SHALL grow as rounds progress, using a single animation loop.

## R6. AI Studio bridge (Chrome extension, MV3)
- R6.1 On `https://aistudio.google.com/*` the overlay SHALL cover the page and be mounted outside `<body>`, re-attaching itself if removed.
- R6.2 The first message of each mode SHALL carry the system instructions (tone, tag format, lore brief).
- R6.3 Responses SHALL be parsed only after streaming settles and only when the tag set is complete, so the UI never flickers on partial tags.
- R6.4 Tags: `[STATUS]`, `[MSG]`, `[A]`, `[B]`, `[C]`, and a `[KIRO_ORDER]...[/KIRO_ORDER]` block.
- R6.5 No inline script injection (page CSP) and no API keys.

## R7. Standalone demo
- R7.1 WHEN opened outside `aistudio.google.com` THEN the full Canteen -> Ticket -> Dragon -> Campfire loop SHALL run from built-in scripts with no account or key.
- R7.2 A `DEMO MODE` badge SHALL be visible.
- R7.3 Stale or corrupt local storage SHALL reset itself to defaults on startup.

## R9. Languages
- R9.1 The UI language SHALL be picked locally and instantly (saved choice, else `navigator.languages`, else English), with a picker in the header and the companion selector.
- R9.2 The companion's FIRST message and options SHALL come from bundled packs (`i18n/<code>.js`), never from a Gemini round trip.
- R9.3 The AI primer SHALL ask for replies in the UI language and to mirror the user's language if it changes.
- R9.4 The brand sign and `Hey, you. You're finally awake.` stay in English. The transition button uses the steering text in English and is translated in other languages (owner decision). The demo script dialogue stays English.

## R11. Today's Special (surprise opener)
- R11.1 A canteen button SHALL restart the conversation with a question drawn from a curated pool (6 per language: half practical, half silly).
- R11.2 The same question SHALL NOT be drawn twice in a row.
- R11.3 Questions and options are pre-translated and appear instantly; each option leads into a canteen flow (demo maps by position).
- R11.4 In AI mode the opener is sent in the primer, and silly answers are treated as hints about the real task.
- R11.5 The name SHALL NOT use Google's "I'm Feeling Lucky".

## R10. Unclear answers
- R10.1 Canteen: an unclear, contradictory or off-topic answer SHALL NOT count as a round; the companion asks a follow-up with 3 concrete interpretations.
- R10.2 At most 2 follow-ups in a row; then continue with a best guess (AI mode records it as "Assumption: ..." in the ticket).
- R10.3 Campfire: odd actions are accepted ("yes, and"); only empty or gibberish input gets a follow-up.
- R10.4 Gibberish SHALL NOT be written into the ticket.

## R12. Humor level (canteen, AI mode)
- R12.1 A header toggle SHALL switch between 🧂 mild and 🌶️ normal (default normal); the choice is saved. Hidden in the scripted demo.
- R12.2 Always: MSG ≤ 2 sentences; options and ticket fields stay plain; never mock, lecture or pressure the user.
- R12.3 Mild: calm, no jokes or teasing. Normal: at most one joke per turn, plays along with the user's own cues (e.g. words in quotes) and steers back; may wink at private hints without guessing.
- R12.4 Changing it re-sends the canteen primer on the next message. Campfire stays full roleplay (the companion is always an animal).

## R13. 🌿 Catnip (cat) / 🎾 Squeaky Ball (dog) mode
- R13.1 A pill under the sprite (both modes) toggles it; the label follows the companion. Session-only (not saved).
- R13.2 "Drunken master": MSG gets silly with animal sounds; A/B/C keep a clear meaning (at most one sound); tags and every KIRO_ORDER field stay sober.
- R13.3 Safety net: when on, animal sounds are stripped from ticket fields before display/copy.
- R13.4 Pre-written lines (demo script, bundled openers, thinking line) get sounds locally via `euphoria.js`; AI replies are shown as-is.
- R13.5 Visuals: sway (cat) / bounce (dog), rosy cheeks, floating sparkles, glowing bubble; off under reduced motion.
- R13.6 Overrides the 🧂/🌶️ humor level while on; toggling re-sends the primer on the next message.
- R13.7 Seasoning, not soup (after the first real session): at most 2 sounds per message, varied openings, the companion keeps its personality, and A/B/C never get sounds (they are sent back as the user's answer).

## R16. Playing along (after the first real session)
- R16.1 Jokes, puns and wordplay are not confusion: the companion shows it got the joke, then steers back.
- R16.2 Quotes and references (memes, anime, film, history) get a short recognizing aside before being used.
- R16.3 "I just want to chat" is a valid canteen wish.
- R16.4 Campfire replies: 2-4 short sentences, about 60 words / 120 CJK characters, one step at a time.
- R16.5 The export includes the primer of every mode used, and marks turns where catnip/ball mode was on.

## R14. Off-limits topics and care
- R14.1 Sexual, graphic-violent, hateful or illegal requests get a cute, pre-written "too hard, try another one" line (8 languages, 3 per companion), never a lecture. The round does not count.
- R14.2 Sources: Gemini's `[STATUS: offmenu]` (its A/B/C alternatives are kept); an AI Studio safety banner with no tags; a plain-text refusal that stays unchanged for 4 s. The last two get a local menu (canteen: today's special / new order / off the clock; campfire: plain story actions).
- R14.3 Demo: free text is screened locally (`safety.js`) because the script cannot refuse and would echo it.
- R14.4 Self-harm / suicide is NOT made cute: a sincere line pointing to trusted people or a local crisis line (zh-TW includes 1925), no sounds, catnip/ball mode switched off. Detected locally in every mode and never sent; Gemini's `[STATUS: care]` is shown as-is.

## R15. Conversation export ("second opinion")
- R15.1 A 📥 button (header + ticket modal) SHALL download the whole page session as a Markdown file, across new orders and both modes.
- R15.2 The file SHALL explain itself first (what the app is, the A/B/C/D loop, that D is the user's own words, that animal noises mean nothing), then the session settings.
- R15.3 Every turn lists the companion message, its kind (AI reply, asked again, refused, care, pre-written, local menu, technical error), the options shown, and what the user picked or wrote; tickets appear where they were produced.
- R15.4 AI Studio mode appends the primer given to Gemini. The file ends with a reviewer task: real intent, ambiguous turns, ticket check, ≤3 questions, improved ticket.
- R15.5 Re-shown openers (language switch, catnip toggle) replace the previous entry instead of duplicating it.

## R17. Leaving the tab while waiting
- R17.1 A timeout or "not sent" check that fires while the tab is hidden SHALL NOT show a failure; it is decided after the user comes back.
- R17.2 Coming back (visibilitychange / focus / pageshow) re-checks for the reply at once, then allows a 15 s grace period before showing a failure.
- R17.3 A reply delivered while the tab is hidden puts 🐾 in front of the tab title; it is removed when the tab is visible again.

## R18. Artwork and day/night
- R18.1 Scenes, portraits and the dragon use artwork compressed from `4K/` into `assets/img/*.webp` (~1.1 MB total). `4K/` is git-ignored.
- R18.2 A ☀️/🌙 header button switches every scene and the dragon between day and night art; saved, default day.
- R18.3 Portraits: canteen (apron/bandana), campfire (cloak/backpack), silvervine cat / ball dog in catnip/ball mode.
- R18.4 The dragon flyover sweeps the dragon art across the screen and swaps the scene while it covers it.
- R18.5 Campfire growth: a warm glow over the art grows every 2 rounds; day art has an unlit pit, so day also shows the pixel flames.
- R18.6 Image URLs are set from JS as CSS variables (relative URLs in content-script CSS would resolve against aistudio.google.com).

## R19. Campfire save ("continue the adventure")
- R19.1 Pressing 📥 in Campfire mode SHALL download a story save instead of the review file (`chat-and-you-story-*.md`; canteen gives `chat-and-you-review-*.md`).
- R19.2 It contains only the latest campfire run, the world notes (places, the 2 tensions, the twist marked as a secret that may already be out), the companion persona, and every scene with its options and the player's moves.
- R19.3 It says where the story stopped: an unanswered player move is narrated first; otherwise a one-line recap and the same options.
- R19.4 Instructions use plain A) B) C) D) text (no [TAG] format) so any chat AI can continue, with the same length, "yes, and", reference-spotting, safety rules, and the catnip/ball mood if it was on.

## R20. Long answers and sharper canteen questions (after an external AI test)
- R20.1 Option D is a multi-line box that grows with the text (capped at 40% of the screen, then scrolls). Enter sends, Shift+Enter adds a line, and Enter never sends while an IME is composing.
- R20.2 Options must not overlap and never include "all of the above" (users can multi-pick); every picked option is required.
- R20.3 Steps the user already answered are not asked again.
- R20.4 Before the ticket, the companion checks for high-risk gaps (where two developers would build different things) and asks one targeted question; it never announces "the last question" before that check.
- R20.5 The ticket keeps the user's wording for who may do what and when, keeps every rule, and marks undecided points as "Open question: ...".

## R21. "Done When" on the ticket (no extra questions)
- R21.1 The ticket SHALL have a sixth section, "✅ Done When", written by the companion from the conversation. The user is never asked extra questions to fill it; the number of rounds does not change.
- R21.2 Plain words a non-expert understands. Simple tasks: 1-2 checks. Complex or coding tasks: 3-6 pass/fail checks covering the tricky cases the user mentioned.
- R21.3 AI mode uses a `[DONE: ...]` tag inside `[KIRO_ORDER]`; demo tickets carry pre-written examples.
- R21.4 If the reply has no DONE, the section and its heading are hidden (no "-"), on screen and in the copied text.
- R21.5 The review export lists it and asks the reviewer to improve it too.

## R8. Constraints
- Pure vanilla HTML/CSS/ES6+, zero build step.
- Files SHALL stay under ~200 lines (see steering section 5).
