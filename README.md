# CHAT. AND YOU.

> *"Attention Is All You Need"* → **CHAT. AND YOU.**
> The AI offers sparks (A, B, C). You bring the intent (D).

A pixel-art cat or dog that turns fuzzy wishes into good prompts, then clocks out and runs a campfire fantasy story with you. Vanilla HTML/CSS/JS, zero build, zero API keys.

**▶ Live demo (no account needed):** https://YOUR-GITHUB-NAME.github.io/chat-and-you/
**Kiroween 2026 category:** Frankenstein: a prompt coach and a TRPG game master stitched into one app, living inside a developer console.

---

## The problem

Many people don't struggle with AI because it's hard to use. They struggle because they **don't know how to start**. An empty prompt box is scary, and a long form is scarier. CHAT. AND YOU. never shows an empty box: every turn has one short message, three concrete answers to tap, and a "write it myself" box.

## What it does

### ☀️ Canteen: the wish translator
- About 3 short rounds: *what do you want to make*, *what should the result look like*, *the one rule that matters most*.
- Then a **Kiro Order Ticket**: Summary, Input, Output, Constraints, Avoid, and **Done When** (pass/fail checks the companion writes itself, so nobody is asked for "acceptance criteria").
- Tap several answers at once (＋), ask **🤔 "Wait, what?"** for a plainer explanation, or tap **🎫 "That's enough, serve it"** from the 4th question on.
- Playing around is allowed: a silly wish ("compute pi forever, never clock out") gets built for real, not corrected.
- 🌿 Catnip / 🎾 Squeaky Ball mode makes the companion silly while the ticket stays sober.

### 🌙 Campfire: a TRPG that doesn't run out of steam
AI story games are exciting while you design the world and fun for one chapter, then energy drops. Here the world comes from **community worldbooks**, and a **stage-based lore shuffler** samples 2 faction tensions and 1 hidden twist per run, so the same worldbook plays differently every time.
- Opens with *"Hey, you. You're finally awake."* and a dragon flyover (and flies you home again).
- **📜 Import a worldbook**: open a community `.json` (validated locally, no AI), or paste a chat log or story notes. Emails, links, @handles and long numbers are removed **locally** first; the AI then turns real people into fantasy roles and returns the world line by line; you preview it and can download a shareable `.json`.
- Day and night artwork with matching openers and story time of day.
- **📥 Download chat**: a review file (paste into any AI for a second opinion) or a "continue the story" file for any AI.

### Care built in
Sexual or violent requests get a cute "not on the menu". Mentions of self-harm get a sincere, joke-free care message (detected locally, never sent). If AI Studio's own filter blocks a harmless reply, the user is told it's often a false alarm and the story simply continues.

8 interface languages: English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch.

---

## Try it

### 1. Standalone demo (judges: start here)
Open the live demo link above, or run locally:
```bash
python -m http.server 8000   # then open http://localhost:8000
```
Outside AI Studio the app runs scripted replies, so the whole loop works with no account: Canteen → ticket → dragon → Campfire → worldbook forge (with a built-in sample chat).

### 2. Chrome extension on Google AI Studio (real AI)
1. Download this repo (Code → Download ZIP) and unzip it.
2. Open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, pick the folder.
3. Sign in at https://aistudio.google.com and open a new chat. Pick any model on the right; the System Instructions box should be empty.
4. The overlay appears. **🛠 Show AI Studio** (bottom right) switches back to the original page any time.

**How the extension talks to AI Studio:** it types into the user's own signed-in AI Studio chat and presses Run, exactly what the user would do by hand. A message is sent only when the user taps an option or Send; there are no background, scheduled or bulk requests, and no API keys. Replies are read from the page using small `[TAG]` lines. The standalone demo does not depend on AI Studio at all.

---

## How we used Kiro

Everything was built in **Kiro IDE** during the submission period, in Traditional Chinese conversation with code and files in English.

- **Steering** (`.kiro/steering/Project Rules.md`): the product's constitution: anti-blank-box UX, animal-only companions (never a human, robot or engineer), the two modes, vanilla-only stack, and a *file size & anti-truncation* rule (small files, one file per step). The strategy that mattered most: putting **non-negotiable character and UX rules** there instead of in chat, so every session kept the same cat, dog and tone.
- **Spec-driven development** (`.kiro/specs/chat-and-you-mvp/`): requirements R1–R21 in EARS style, a design doc, and a task list. New features (Done When, multi-pick, worldbook import) were added to the spec first, then implemented, which kept the AI's prompt format and our parser in sync.
- **Agent hooks** (`.kiro/hooks/`):
  - `check-on-save`: on every `.js/.css/.html` save, runs `tools/check.js`: syntax check, the steering's 200-line limit, and **i18n parity** (all 8 language packs and the popup must have the same keys).
  - `properties-on-stop`: when the agent finishes a task, runs the property-based tests.
- **Property-based testing** (`tests/properties.test.js`, no dependencies): random replies, tickets, chats and worldbooks against 8 properties. It caught a real bug that unit tests missed: any reply starting with `<` (like `<3`) was silently dropped as a "template placeholder". It also guards the bug we hit live on AI Studio: an old reply re-rendered after a safety block must never be taken as new.
- **A review loop with exported transcripts:** we played real sessions on AI Studio, exported them with 📥 (the file explains the app and includes the exact instructions the AI got), had other AIs critique them, and brought the findings back to Kiro. Round limits, "ask what the result looks like", the playful-user rules and the safety-block fix all came from this loop.
- Not used: MCP, custom agents, powers.

Run the checks yourself:
```bash
node tools/check.js
node tests/properties.test.js      # SEED=42 to replay a run
```

---

## Project structure

| Area | Files |
|---|---|
| Page + styles | `index.html`, `styles.css`, `artwork.css`, `ui-polish.css`, `ui-chrome.css`, `euphoria.css`, `huh.css`, `lore-import.css` |
| App | `app.js` (core loop), `multipick.js`, `huh.js`, `euphoria.js`, `safety.js`, `theme.js`, `transcript.js`, `story-export.js` |
| Campfire | `lore-shuffler.js`, `lore-packs/*.json`, `lore-forge.js`, `lore-import.js`, `lore-sample.js` |
| AI Studio bridge | `content.js`, `bridge-parse.js`, `bridge-prompts.js`, `bridge-tab.js`, `overlay.js`, `manifest.json` |
| Demo script | `demo-scripts.js` |
| Languages | `i18n/*.js`, `popup-i18n.js` |
| Extension popup | `popup.html`, `popup.css`, `popup.js` |
| Kiro | `.kiro/steering`, `.kiro/specs`, `.kiro/hooks`, `tools/check.js`, `tests/` |

Some older files (`app.js`, `styles.css`, `demo-scripts.js`) were written before the file-size rule and are still larger than 200 lines; everything added later follows the rule, and `tools/check.js` lists the remaining ones.

### Worldbook format
`worldbook_name`, `version`, `factions[]` (`name`, `description`, `goals[]`, `tensions[]`), `locations[]` (`name`, `description`, `atmosphere`), `twists[]` (`description`), `starter_hooks[]` (`opening`, `initial_options[3]`). See `lore-packs/starter-fantasy.json`.

---

## Credits and disclosures

- Artwork: generated by the author with Google Gemini, then compressed for the web (prompts in `docs/ICON_PROMPTS.md`); no third-party game art is used.
- Fonts: [Silkscreen](https://fonts.google.com/specimen/Silkscreen) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), SIL Open Font License, via Google Fonts.
- *"Hey, you. You're finally awake."* is a short homage to the opening line of *The Elder Scrolls V: Skyrim* (Bethesda). Only that line is quoted.
- The name is a nod to *Attention Is All You Need* (Vaswani et al., 2017).
- AI Studio prompt-box selectors were found with help from a public discussion in the AIstudioProxyAPI project (issue #278); no code was copied.
- Google AI Studio and Gemini are trademarks of Google. This project is not affiliated with or endorsed by Google.

## License

MIT, see [LICENSE](LICENSE).
