# Design: CHAT. AND YOU. MVP

## Runtime tracks

| | Standalone demo | Chrome extension |
|---|---|---|
| Host | GitHub Pages / localhost | `aistudio.google.com` |
| Loaded by | `index.html` (`<script type="module" src="app.js">`) | `manifest.json` content scripts: `app.js`, `content.js`, `overlay.js` |
| Boot | `app.js` boots itself on DOM ready | `overlay.js` mounts the overlay, then calls `chatAndYou.boot()` |

On AI Studio, a pill button (bottom-right, always visible) switches between the overlay and the original AI Studio UI. The choice is saved in `chrome.storage.local`.
| Replies | `demo-scripts.js` (scripted, lore-driven) | Google AI Studio, via `window.cayBridge` |

`state.isDemo` is `true` whenever the hostname is not `aistudio.google.com`.

## Modules
- `app.js`: state, storage (`cay_v1_*` keys, version check, auto-reset), screens, root event delegation on `document`, campfire and dragon canvases, ticket rendering. Exposes `window.chatAndYou`.
- `lore-shuffler.js`: loads a worldbook relative to `import.meta.url`, shuffles a session and builds the AI session brief.
- `demo-scripts.js`: canteen flows (3 topics x 2 companions) and campfire beats that take every anchor from the shuffled session.
- `content.js`: overlay mount on `<html>` with a self-healing observer, prompt primer, sender, and streaming-safe parser.

## Extension bridge
1. `app.js` and `content.js` share one isolated world, so they call each other directly. No `postMessage` and no inline `<script>`, which AI Studio's CSP would block.
2. Send: the text plus a `[TURN cay-N]` marker goes into the prompt box (native value setter + `input` event), then the Run button is clicked (Ctrl+Enter as fallback). The first send in each mode is prefixed with the primer.
3. Receive: a `MutationObserver` (childList + characterData) is debounced by 900 ms. On settle (`bridge-parse.js`):
   - If our `[TURN cay-N]` marker is on the page, only the text after it is parsed.
   - AI Studio unloads old turns from long chats, so the marker can disappear. Then the newest complete reply that was not on the page before sending (snapshot of reply signatures) is used.
   - The result is forwarded once, only when complete (MSG + A + B + C, or a closed KIRO_ORDER block), and not while the Run button shows "Stop" (thinking models may draft tags in their thoughts; capped at 30 s).
4. Failure: no prompt box -> immediate message. Nothing happened after 4 s, or no reply after 45 s -> message with a resend option, but the bridge keeps listening and still shows a late reply.

Primer text lives in `bridge-prompts.js`.

## Lore pack schema
`worldbook_name`, `version`, `description`, `factions[] {id, name, description, goals[], tensions[]}`, `locations[] {id, name, description, atmosphere}`, `twists[] {id, trigger, description}`, `starter_hooks[] {id, opening, initial_options[3]}`.

Each session samples 1 hook, 2 factions with 1 tension each, 1 twist and 2 featured locations (Fisher-Yates).

## Known risks
- AI Studio's DOM is private. The selectors in `content.js` (`SEL`) are best-effort and must be checked in DevTools after AI Studio updates.
- `styles.css` is injected page-wide on AI Studio. It is hidden under the overlay, but its selectors should be scoped under `#cay-root`.
