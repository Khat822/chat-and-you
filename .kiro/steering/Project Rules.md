---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 

# Project Rules: CHAT. AND YOU.

## 1. Core Philosophy

- **Manifesto:** "CHAT. AND YOU." (homage to *Attention Is All You Need*). AI provides conversational sparks (A, B, C), while the human user must step in via Option D to provide real intent.

- **Anti-Blank-Input-Box UX:** Never start with an empty prompt box. Every turn presents 1 short conversational message + 3 concrete, distinct options (A, B, C) to provoke a reaction (one tap sends one; a ＋ next to each lets the user combine several, optionally with D) + Option D ("Write it myself" free-text input).

## 2. Companion Persona & Visual Rules (STRICT)

- **Selectable Animal Companion:** Users choose between two completely de-gendered pixel-art companions: **Cat (貓貓)** or **Dog (狗狗)** (switchable anytime).

- **Zero Human / Corporate Tropes:** NEVER depict the AI as a human, robot, or engineer. Strictly NO collared shirts, ties, glasses, or employee ID badges.

- **Tone & Props:** Use gender-neutral language.

  - *Cat:* Chill, concise, gently sarcastic (wears a simple plain apron in Canteen mode; a small traveler's cloak in Campfire mode).

  - *Dog:* Warm, enthusiastic, encouraging (wears a simple bandana in Canteen mode; holds a small lantern in Campfire mode).

## 3. Dual-Mode Experience ("Two Worlds, One Engine")

- **Mode 1 — Day Mode (Pixel Canteen / 食堂模式):**

  - Warm pixel-art canteen background featuring a glowing wall neon sign reading `CHAT. AND YOU.`.

  - Acts as a "Wish Translator" for everyday users who don't know how to prompt AI.

  - Through 3–4 rounds of casual ABCD chat (pain point -> input/output -> anti-goals/constraints), it distills the user's idea into a structured **"Kiro Order Ticket"** (a clean, theme-locked prompt ready to copy-paste into Kiro, Gemini, or GPT).

- **Mode Transition:**

  - Triggered by a button labeled `"Off the clock: Let's talk Dragons & Magic"`.

  - Plays a Canvas/CSS animation of a pixel dragon flying across the screen, transitioning the canteen into a dusk forest where a campfire ignites.

- **Mode 2 — Night Mode (Dusk Forest Campfire / 傍晚樹林營火 TRPG):**

  - Opens with `"Hey, you. You're finally awake."`

  - Loads modular open-source worldbooks from `/lore-packs/*.json` and runs a **Stage-Based Lore Shuffler** (randomly sampling 2 faction tensions and 1 twist per session so the same worldbook plays differently every time).

  - Uses the exact same ABCD loop; campfire flame size grows as the story develops.

## 4. Technical & Deployment Constraints

- **Zero-Key Architecture (Dual Track):**

  1. **Chrome Extension (Manifest V3):** Injects the full-screen pixel-art overlay UI directly onto `https://aistudio.google.com/*`, hiding the complex developer UI and talking to Gemini through the user's own signed-in AI Studio session (every message is sent only when the user taps an option or Send; no background or bulk requests) via DOM bridge and structured `[TAG]` parsing `[STATUS]`, `[MSG]`, `[A]`, `[B]`, `[C]`, `[KIRO_ORDER]`).

  2. **Standalone Web Demo (Live URL):** When opened outside `aistudio.google.com` (e.g., on GitHub Pages), automatically runs a built-in interactive demo script so hackathon judges can test the full Canteen -> ABCD -> Order Ticket -> Dragon Flyover -> Campfire TRPG loop with zero setup.

- **Tech Stack:** Pure Vanilla HTML, CSS, and ES6+ JavaScript only. Zero build steps (no React, Vite, or Webpack).

## 5. File Size & Anti-Truncation Rules (STRICT)

- **Keep every file small and modular** (strictly under 150-200 lines per file).

- **NEVER put large CSS or JS logic inline inside HTML files.** Split the project into small separate files:

  - `index.html` / `start-demo.html` (clean HTML structure only, ~100-150 lines)

  - `styles/` directory:
    - `base.css` (reset, variables, ~50 lines)
    - `canteen.css` (canteen scene styles, ~80 lines)
    - `campfire.css` (campfire scene styles, ~80 lines)
    - `companions.css` (sprite animations, ~60 lines)
    - `modal.css` (ticket modal styles, ~60 lines)

  - `scripts/` directory:
    - `app.js` (main initialization, ~100 lines)
    - `state.js` (state management, ~80 lines)
    - `companions.js` (companion logic, ~80 lines)
    - `canteen.js` (canteen mode, ~100 lines)
    - `campfire.js` (campfire mode, ~100 lines)
    - `animations.js` (dragon flyover, campfire canvas, ~100 lines)
    - `ui.js` (UI helpers, ~80 lines)

  - `lore-shuffler.js` (worldbook system, ~150 lines)

  - `demo-scripts.js` (built-in ABCD conversation & lore data, can be ~200 lines since it's data-heavy)

- **Create or update only ONE small file per step** so output never gets truncated.

- **When refactoring:** Break into small PRs, one file at a time.