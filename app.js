// ============================================
// CHAT. AND YOU. - Main Application Logic
// ============================================

// Storage key prefix for isolation
const STORAGE_PREFIX = 'cay_v1_';
const STORAGE_VERSION = '1.0.0';

// i18n (loaded before app.js by index.html / manifest.json). Declared at the
// top because boot() can run during this file's top-level evaluation.
const I18N = window.CAY_I18N;
const tr = (key, vars) => I18N.t(key, vars);

// State management
const state = {
    companion: null, // 'cat' or 'dog'
    mode: 'canteen', // 'canteen' or 'campfire'
    conversationHistory: [],
    currentRound: 0,
    loreSession: null,
    customWorldbook: null, // imported/forged worldbook (lore-import.js), page session only
    forging: false,        // a worldbook forge is waiting for AI Studio
    campfireIntensity: 1, // scales from 1 to 5
    ticketData: null,
    isDemo: false
};

// Safe storage wrapper with auto-recovery
function safeGetStorage(key) {
    try {
        const fullKey = STORAGE_PREFIX + key;
        const value = localStorage.getItem(fullKey);
        return value;
    } catch (error) {
        console.warn('Storage read failed:', error);
        return null;
    }
}

function safeSetStorage(key, value) {
    try {
        const fullKey = STORAGE_PREFIX + key;
        localStorage.setItem(fullKey, value);
        return true;
    } catch (error) {
        console.warn('Storage write failed:', error);
        return false;
    }
}

function resetStorage() {
    console.log('Resetting storage...');
    try {
        // Clear all cay_v1_* keys
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        
        // Reset state
        state.companion = null;
        state.mode = 'canteen';
        state.conversationHistory = [];
        state.currentRound = 0;
        state.loreSession = null;
        state.ticketData = null;
        
        console.log('Storage reset complete');
        return true;
    } catch (error) {
        console.error('Storage reset failed:', error);
        return false;
    }
}

// Validate stored data
function validateStoredData() {
    try {
        const version = safeGetStorage('version');
        if (version !== STORAGE_VERSION) {
            console.log('Version mismatch, resetting storage');
            resetStorage();
            safeSetStorage('version', STORAGE_VERSION);
            return false;
        }
        
        const companion = safeGetStorage('companion');
        if (companion && companion !== 'cat' && companion !== 'dog') {
            console.log('Invalid companion data, resetting');
            resetStorage();
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Validation failed:', error);
        resetStorage();
        return false;
    }
}

// Check if running in standalone demo mode
const isStandalone = !window.location.hostname.includes('aistudio.google.com');
state.isDemo = isStandalone;

// Resolve sibling files on a normal page AND inside the extension, where
// app.js runs as a content script and './x.js' would hit aistudio.google.com.
const inExtension = typeof chrome !== 'undefined' && !!chrome.runtime?.id;
const assetUrl = (p) => inExtension ? chrome.runtime.getURL(p) : new URL(p, document.baseURI).href;
const loadModule = (p) => import(assetUrl(p));

let booted = false;
function boot() {
    if (booted) return;
    booted = true;
    initializeApp();
}

// Standalone (GitHub Pages / localhost): boot ourselves.
// Extension: content.js mounts the overlay first, then calls chatAndYou.boot().
if (isStandalone) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
}

// ============================================
// Language: decided locally and instantly (navigator.languages or the saved
// choice), so the companion's very first message never waits for Gemini.
// ============================================
function initLanguage() {
    const saved = safeGetStorage('lang');
    I18N.set(saved && I18N.isSupported(saved) ? saved : I18N.detect());
    I18N.apply(document);
}

// ============================================
// Humor level ("spice") for AI replies in the canteen: 'normal' | 'light'
// ============================================
function initSpice() {
    state.spice = safeGetStorage('spice') === 'light' ? 'light' : 'normal';
    const btn = document.getElementById('spice-btn');
    if (btn) btn.hidden = state.isDemo;   // scripted demo: the setting would do nothing
    refreshSpiceButton();
}

function refreshSpiceButton() {
    const btn = document.getElementById('spice-btn');
    if (!btn) return;
    const label = tr(state.spice === 'light' ? 'ui.spiceLight' : 'ui.spiceNormal');
    btn.textContent = label;
    btn.title = tr('ui.spiceHint');
    btn.setAttribute('aria-label', `${label}: ${btn.title}`);
    btn.setAttribute('aria-pressed', String(state.spice === 'light'));
}

function toggleSpice() {
    state.spice = state.spice === 'light' ? 'normal' : 'light';
    safeSetStorage('spice', state.spice);
    refreshSpiceButton();
    // Re-send the canteen primer with the new style on the next message
    window.cayBridge?.resetMode('canteen');
}

// ============================================
// 🌿 Catnip / 🎾 Squeaky Ball (euphoria.js). Session-only on purpose: it's a gag.
// ============================================
function syncEuphoria() {
    window.CAY_EUPHORIA.sync({ on: state.euphoria, companion: state.companion });
}

function toggleEuphoria() {
    state.euphoria = !state.euphoria;
    syncEuphoria();
    window.cayBridge?.resetMode('canteen');
    window.cayBridge?.resetMode('campfire');
    // Nothing answered yet: show the opener again, with or without the sounds
    const suffix = state.mode === 'canteen' ? '' : '-night';
    const options = ['a', 'b', 'c'].map(k => document.getElementById(`option-${k}${suffix}`)?.textContent || '');
    if (state.currentRound === 0 && !state.afterTicket && state.opener && options[0]) {
        displayMessage(state.opener, options, { local: true, replace: true });
    }
}

function changeLanguage(code) {
    safeSetStorage('lang', code);
    I18N.set(code);
    I18N.apply(document);
    refreshSpiceButton();
    syncEuphoria();
    // Nothing answered yet in this mode: greet again in the new language.
    // (Demo dialogue is an English script, so it stays as is.)
    if (!state.companion || state.isDemo || state.currentRound !== 0 || state.afterTicket) return;
    const g = state.mode === 'canteen' ? getCanteenOpener() : getCompanionGreeting('campfire');
    state.opener = g.message;
    displayMessage(g.message, g.options, { local: true, replace: true });
}

function initializeApp() {
    // Validate and recover storage
    validateStoredData();
    initLanguage();
    initSpice();
    window.CAY_MULTI.init({ sendLabel: () => tr('ui.send'), hint: () => tr('ui.pickHint') });
    window.CAY_HUH?.init({
        huh: { label: () => tr('ui.huh'), hint: () => tr('ui.huhHint'), onClick: askPlainer },
        serve: { label: () => tr('ui.serve'), hint: () => tr('ui.serveHint'), onClick: serveNow }
    });
    initLoreImport();
    state.theme = window.CAY_THEME.apply(safeGetStorage('theme'));
    
    // Show demo indicator if in standalone mode
    if (state.isDemo) {
        const indicator = document.getElementById('demo-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
        }
        console.log('Running in DEMO MODE');
    }

    // Check if companion already selected
    const savedCompanion = safeGetStorage('companion');
    
    if (savedCompanion) {
        console.log('Restoring companion:', savedCompanion);
        state.companion = savedCompanion;
        startApp();
    } else {
        console.log('No companion found, showing selector');
        showCompanionSelector();
    }

    // Set up root-level event delegation
    setupRootEventDelegation();
}

// Clicks on .companion-choice are handled by the root event delegation,
// so this only toggles visibility (no per-call listeners that pile up).
function showCompanionSelector() {
    // First visit: a choice is required, so no ✕. Switching later: closable.
    const x = document.getElementById('close-selector-x');
    if (x) x.hidden = !state.companion;
    document.getElementById('companion-selector')?.classList.remove('hidden');
}

function closeCompanionSelector() {
    if (!state.companion) return;
    document.getElementById('companion-selector')?.classList.add('hidden');
}

function selectCompanion(companion) {
    if (companion !== 'cat' && companion !== 'dog') return;
    // Same companion again: just close, keep the conversation
    if (companion === state.companion && !document.getElementById('app')?.classList.contains('hidden')) {
        return closeCompanionSelector();
    }
    state.companion = companion;
    safeSetStorage('companion', companion);
    try { window.chrome?.storage?.local?.set({ companion }); } catch { /* demo page */ }   // for popup.js
    document.getElementById('companion-selector')?.classList.add('hidden');
    startApp();
}

function startApp() {
    const app = document.getElementById('app');
    if (!app) {
        console.error('CHAT. AND YOU.: #app element not found');
        return;
    }
    // The selector is visible by default in index.html; a companion restored
    // from storage must close it too, not only a fresh click.
    document.getElementById('companion-selector')?.classList.add('hidden');
    app.classList.remove('hidden');
    
    // Set companion sprite (+ catnip/ball button label for this companion)
    updateCompanionSprite();
    syncEuphoria();
    
    // Initialize mode (canteen by default)
    if (state.mode === 'canteen') {
        console.log('Initializing canteen mode');
        initializeCanteen();
    }
}

function updateCompanionSprite() {
    const canteenSprite = document.getElementById('companion-sprite');
    const nightSprite = document.getElementById('companion-sprite-night');
    
    canteenSprite.classList.remove('cat', 'dog');
    nightSprite.classList.remove('cat', 'dog');
    
    canteenSprite.classList.add(state.companion);
    nightSprite.classList.add(state.companion);
}

// ============================================
// Canteen Mode - Prompt Builder
// ============================================

function initializeCanteen({ special = false } = {}) {
    state.mode = 'canteen';
    state.afterTicket = false;
    state.offMenu = false;
    state.afterCare = false;
    record({ role: 'event', text: special ? "New canteen order (Today's Special: surprise first question)" : 'New canteen order' });
    state.currentRound = 0;
    state.conversationHistory = [];
    state.specialIndex = special ? pickSpecialIndex() : null;
    const opener = getCanteenOpener();
    state.opener = opener.message;
    
    // Show canteen, hide campfire
    document.getElementById('canteen-mode').classList.remove('hidden');
    document.getElementById('campfire-mode').classList.add('hidden');
    document.getElementById('background').className = 'canteen-bg';
    
    // Extension: the next send must re-prime AI Studio with canteen rules
    window.cayBridge?.resetMode('canteen');

    if (state.isDemo) {
        loadModule('demo-scripts.js')
            .then(module => module.startCanteenDemo(state.specialIndex === null ? null : opener))
            .catch(error => {
                console.error('Failed to load demo-scripts.js:', error);
                sendCanteenGreeting();
            });
    } else {
        sendCanteenGreeting();
    }
}

function sendCanteenGreeting() {
    const opener = getCanteenOpener();
    displayMessage(opener.message, opener.options, { local: true });
}

// "Today's Special": curated pool, never the same question twice in a row
function pickSpecialIndex() {
    const n = I18N.tLang('en', 'specials.list').length;
    let i;
    do { i = Math.floor(Math.random() * n); } while (n > 1 && i === state.lastSpecial);
    state.lastSpecial = i;
    return i;
}

// The normal greeting, or the drawn special question (both pre-translated)
function getCanteenOpener() {
    if (state.specialIndex == null) return getCompanionGreeting('canteen');
    const lang = state.isDemo ? 'en' : I18N.lang;
    const s = I18N.tLang(lang, 'specials.list')[state.specialIndex];
    return {
        message: `${I18N.tLang(lang, `specials.${state.companion}`)} ${s.q}`,
        options: s.options,
        specialIndex: state.specialIndex
    };
}

// Bundled, pre-translated openers (i18n/<lang>.js).
// The campfire line keeps the steering-mandated English opener.
function getCompanionGreeting(mode) {
    const lang = state.isDemo ? 'en' : I18N.lang;   // demo script is English
    // The campfire opener matches the ☀️/🌙 artwork: no stars in the afternoon
    const key = mode === 'campfire' && state.theme !== 'night' ? 'campfireDay' : mode;
    const g = I18N.tLang(lang, `${state.companion}.${key}`);
    const prefix = mode === 'campfire' ? "Hey, you. You're finally awake. " : '';
    return { message: prefix + g.message, options: g.options };
}

// ============================================
// Transcript (exported by transcript.js). Kept for the whole page session,
// across new orders and both modes.
// ============================================
function record(entry) {
    (state.transcript ||= []).push({ ...entry, mode: state.mode, at: new Date().toISOString() });
}

// replace: the same opener shown again (language switch, catnip toggle)
function recordCompanion(message, options, local, replace) {
    const kind = state.nextKind || (local ? 'scripted' : 'reply');
    state.nextKind = null;
    const t = (state.transcript ||= []);
    const entry = { role: 'companion', kind, message, options: (options || []).filter(Boolean), mode: state.mode,
        euphoria: !!state.euphoria, at: new Date().toISOString() };
    if (replace && t.at(-1)?.role === 'companion') t[t.length - 1] = entry;
    else t.push(entry);
}

// One primer per mode that was actually used (each mode gets different rules)
function transcriptPrimers() {
    const P = window.CAY_PROMPTS;
    if (state.isDemo || !P) return [];
    const used = new Set((state.transcript || []).map(e => e.mode));
    const openerFor = (mode) => state.mode === mode ? (state.opener || '') : '';
    return ['canteen', 'campfire'].filter(m => used.has(m)).map(m => ({
        mode: m === 'canteen' ? 'Canteen' : 'Campfire',
        text: P.primer(m, state.companion, m === 'campfire' ? (state.loreBrief || '') : '', I18N.languageName,
            openerFor(m), state.spice, !!state.euphoria)
    }));
}

function exportTranscript() {
    const pad = (n) => String(n).padStart(2, '0');
    const d = new Date();
    const meta = {
        date: d.toISOString(),
        where: state.isDemo ? 'standalone demo (scripted replies, no AI)' : 'Chrome extension on Google AI Studio (replies by Gemini)',
        companion: state.companion === 'cat' ? 'cat (chill, gently sarcastic)' : 'dog (warm, enthusiastic)',
        language: I18N.languageName,
        spice: state.spice === 'light' ? 'mild' : 'normal',
        euphoria: !!state.euphoria,
        primers: transcriptPrimers()
    };
    // In the campfire, export a "continue the adventure" file; in the canteen, a review file
    const story = state.mode === 'campfire' && window.CAY_STORY;
    const text = story
        ? window.CAY_STORY.build(state.transcript || [], { ...meta, companionKey: state.companion, lore: state.loreSession })
        : window.CAY_TRANSCRIPT.build(state.transcript || [], meta);
    const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
    window.CAY_TRANSCRIPT.download(text, `chat-and-you-${story ? 'story' : 'review'}-${stamp}.md`);
}

// local: pre-written text (demo script, bundled openers). AI replies bring their own sounds.
function displayMessage(message, options, { local = state.isDemo, replace = false, huh = true } = {}) {
    if (state.euphoria && local) message = window.CAY_EUPHORIA.loopify(message, state.companion);
    const kind = state.nextKind;   // recordCompanion() clears it
    recordCompanion(message, options, local, replace);
    const messageElement = state.mode === 'canteen' 
        ? document.getElementById('message-text')
        : document.getElementById('message-text-night');
    
    const suffix = state.mode === 'canteen' ? '' : '-night';
    
    messageElement.textContent = message;
    setThinking(false);
    
    // Empty options are hidden so nobody can click a blank button
    ['a', 'b', 'c'].forEach((key, i) => {
        const btn = document.getElementById(`option-${key}${suffix}`);
        const text = (options && options[i]) || '';
        btn.textContent = text;
        // inline style, because .option-btn { display:flex } beats [hidden]
        btn.style.display = text ? '' : 'none';
        btn.disabled = false;
    });
    // New turn: clear multi-picks; pre-written local menus can't be combined
    const localMenu = !!(state.afterTicket || state.offMenu || state.afterCare);
    window.CAY_MULTI?.reset({ locked: localMenu });
    // "Wait, what?" only makes sense for a real question, not a local menu or a care message
    const realQuestion = !localMenu && !['care', 'bridge-error'].includes(kind) && !!message;
    window.CAY_HUH?.show('huh', huh && realQuestion);
    // From the 4th canteen question on, the user may skip the rest
    window.CAY_HUH?.show('serve', realQuestion && state.mode === 'canteen' && state.currentRound >= 3);
}

// "That's enough, serve it": the round budget is spent, so the AI must serve
// the ticket (bridge-prompts.js). The demo jumps to its scripted ticket.
function serveNow() {
    const text = tr('ui.serveAsk');
    record({ role: 'user', choice: 'serve', text });
    state.conversationHistory.push({ role: 'user', choice: 'serve', text });
    state.currentRound = Math.max(state.currentRound + 1, 4);
    if (state.isDemo) {
        showThinking();
        return loadModule('demo-scripts.js').then(m => m.serveCanteenNow());
    }
    sendToAIStudio(text);
}

// "Wait, what?": the user didn't get the last message. Not an answer, so the
// round doesn't advance. The demo can't re-explain, so it reassures instead.
function askPlainer() {
    const text = tr('ui.huhAsk');
    record({ role: 'user', choice: 'huh', text });
    if (state.isDemo) {
        const suffix = state.mode === 'canteen' ? '' : '-night';
        const options = ['a', 'b', 'c'].map(k => document.getElementById(`option-${k}${suffix}`)?.textContent || '');
        state.nextKind = 'plainer';
        return displayMessage(tr(`${state.companion}.huh`), options, { local: true, huh: false });
    }
    state.conversationHistory.push({ role: 'user', choice: 'huh', text });
    sendToAIStudio(text);
}

// Several options (＋), optionally with D text, sent as one answer: "A + C + own words"
function sendPicks(letters, dText) {
    const suffix = state.mode === 'canteen' ? '' : '-night';
    const texts = letters.map(k => document.getElementById(`option-${k}${suffix}`)?.textContent || '').filter(Boolean);
    if (dText) texts.push(dText);
    const code = letters.join('+') + (dText ? '+d' : '');
    handleOptionClick(code, texts.join(' + '));
}

// Waiting animation: paw prints in the bubble + faster tail wag on the sprite.
// Applied to both modes' elements so a mode switch can never leave it stuck.
function setThinking(on) {
    ['', '-night'].forEach(suffix => {
        const bubble = document.getElementById(`speech-bubble${suffix}`);
        const sprite = document.getElementById(suffix ? 'companion-sprite-night' : 'companion-sprite');
        if (!bubble || !sprite) return;
        if (on && !bubble.querySelector('.paw-loader')) {
            const paws = document.createElement('div');
            paws.className = 'paw-loader';
            paws.setAttribute('aria-hidden', 'true');
            paws.append(...[0, 1, 2].map(() => document.createElement('span')));
            bubble.appendChild(paws);
        }
        bubble.classList.toggle('is-thinking', on);
        bubble.setAttribute('aria-busy', String(on));
        sprite.classList.toggle('thinking', on);
    });
}

// Shown while waiting for a reply; blocks double-sends
function showThinking() {
    const suffix = state.mode === 'canteen' ? '' : '-night';
    const el = document.getElementById(`message-text${suffix}`);
    const line = tr(`${state.companion}.thinking`);
    if (el) el.textContent = state.euphoria ? window.CAY_EUPHORIA.loopify(line, state.companion) : line;
    window.CAY_HUH?.show(false);
    ['a', 'b', 'c'].forEach(k => {
        const btn = document.getElementById(`option-${k}${suffix}`);
        if (btn) btn.disabled = true;
    });
    setThinking(true);
}

// ============================================
// Campfire Mode - TRPG
// ============================================

function initializeCampfire() {
    state.mode = 'campfire';
    state.afterCare = false;
    record({ role: 'event', text: 'Off the clock: moved to Campfire mode (story game)' });
    state.currentRound = 0;
    state.conversationHistory = [];
    state.campfireIntensity = 1;
    document.getElementById('app')?.setAttribute('data-fire', '1');   // glow size (artwork.css)
    
    // Show campfire, hide canteen
    document.getElementById('canteen-mode').classList.add('hidden');
    document.getElementById('campfire-mode').classList.remove('hidden');
    document.getElementById('background').className = 'campfire-bg';
    
    // Extension: the next send must re-prime AI Studio with campfire rules
    window.cayBridge?.resetMode('campfire');
    
    initializeCampfireCanvas();
    
    // Demo and extension both open from a freshly shuffled lore session
    loadLoreAndStart();
}

async function loadLoreAndStart() {
    try {
        const lore = await loadModule('lore-shuffler.js');
        // An imported worldbook is reshuffled every session, just like the bundled one
        const worldbook = state.customWorldbook || await lore.loadLorePack('starter-fantasy.json');
        state.loreSession = lore.shuffleSession(worldbook);
        state.loreBrief = lore.buildSessionBrief(state.loreSession, { hookShown: state.isDemo });
        // Demo: show the shuffled (English) hook. Extension: show the localized
        // opener instantly; Gemini weaves the shuffled hook into its first reply.
        const opening = state.isDemo
            ? lore.getOpeningFromSession(state.loreSession)
            : getCompanionGreeting('campfire');
        state.opener = opening.message;
        displayMessage(opening.message, opening.options, { local: true });
    } catch (error) {
        console.error('Failed to load lore pack, using fallback opening:', error);
        state.loreSession = null;
        state.loreBrief = '';
        const greeting = getCompanionGreeting('campfire');
        state.opener = greeting.message;
        displayMessage(greeting.message, greeting.options, { local: true });
    }
}

// ============================================
// Campfire Canvas Animation
// One rAF loop for the whole session; it reads state.campfireIntensity
// every frame, so growing the fire never stacks extra loops.
// ============================================

let campfireLoopRunning = false;

function initializeCampfireCanvas() {
    if (campfireLoopRunning) return;
    const canvas = document.getElementById('campfire-canvas');
    if (!canvas) return;
    canvas.width = 200;
    canvas.height = 250;
    campfireLoopRunning = true;
    animateCampfire(canvas.getContext('2d'), canvas);
}

function animateCampfire(ctx, canvas) {
    const flames = [];
    const spawn = () => ({
        x: canvas.width / 2 + (Math.random() - 0.5) * (40 + 10 * state.campfireIntensity),
        y: canvas.height - 20,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * (2 + state.campfireIntensity * 0.5) - 1,
        life: Math.random() * 50 + 50,
        maxLife: 50,
        size: Math.random() * 6 + 3 + state.campfireIntensity
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Grow or shrink the particle pool to match the story intensity
        const target = 8 * state.campfireIntensity;
        while (flames.length < target) flames.push(spawn());
        if (flames.length > target) flames.length = target;
        
        // Draw logs
        ctx.fillStyle = '#4a2511';
        ctx.fillRect(canvas.width / 2 - 40, canvas.height - 30, 80, 20);
        ctx.fillRect(canvas.width / 2 - 50, canvas.height - 20, 100, 15);
        
        flames.forEach((flame, index) => {
            flame.x += flame.vx;
            flame.y += flame.vy;
            flame.life--;
            
            if (flame.life <= 0) {
                flames[index] = spawn();
            }
            
            const opacity = Math.max(0, flame.life / flame.maxLife);
            const gradient = ctx.createRadialGradient(
                flame.x, flame.y, 0,
                flame.x, flame.y, flame.size
            );
            
            gradient.addColorStop(0, `rgba(255, 255, 100, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 107, 53, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(flame.x, flame.y, flame.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// Dragon Transition Animation
// ============================================

// The dragon artwork (day or night) sweeps across the screen; the scene
// switches to the forest while the dragon covers it (artwork.css).
// home: the return trip to the canteen (mirrored, the other direction)
function playDragonTransition(onCovered, { home = false } = {}) {
    return new Promise((resolve) => {
        const el = document.getElementById('dragon-flyover');
        if (!el) { onCovered?.(); return resolve(); }
        let done = false;
        el.classList.toggle('home', home);
        const finish = () => {
            if (done) return;
            done = true;
            el.classList.remove('flying', 'home');
            el.classList.add('hidden');
            resolve();
        };
        el.classList.remove('hidden');
        void el.offsetWidth;                        // restart the CSS animation
        el.classList.add('flying');
        setTimeout(() => onCovered?.(), 1000);      // dragon fills the screen here
        el.addEventListener('animationend', finish, { once: true });
        setTimeout(finish, 3200);                   // safety net (hidden tab, no animation)
    });
}

// ============================================
// Event Listeners
// ============================================

// ============================================
// Root-Level Event Delegation (replaces setupEventListeners)
// ============================================

function setupRootEventDelegation() {
    console.log('Setting up root-level event delegation');
    
    // Delegate on `document`, not body: in the extension the overlay is
    // mounted on <html> (outside <body>) so AI Studio can't strip it.
    document.addEventListener('click', (e) => {
        const target = e.target instanceof Element ? e.target : null;
        if (!target) return;
        // Only react inside our own UI
        if (!target.closest('#app, #companion-selector, #ticket-modal')) return;
        
        // Companion selector: ✕ or a click on the dark backdrop closes it
        if (target.closest('#close-selector-x') || target.id === 'companion-selector') {
            closeCompanionSelector();
            return;
        }
        
        if (target.closest('.companion-choice')) {
            const choice = target.closest('.companion-choice');
            const companion = choice.dataset.companion;
            if (companion) {
                selectCompanion(companion);
            }
            return;
        }
        
        // Option buttons (A, B, C)
        if (target.closest('.option-btn')) {
            const btn = target.closest('.option-btn');
            const option = btn.dataset.option;
            if (option && !btn.disabled && btn.textContent.trim()) {
                // Already picking several? Then a tap adds/removes instead of sending
                if (window.CAY_MULTI.active()) window.CAY_MULTI.toggle(option, btn.id);
                else handleOptionClick(option);
            }
            return;
        }
        
        // ＋ next to an option: add it to a multi-pick
        if (target.closest('.pick-toggle')) {
            const t = target.closest('.pick-toggle');
            if (!document.getElementById(t.dataset.for)?.disabled) window.CAY_MULTI.toggle(t.dataset.pick, t.dataset.for);
            return;
        }
        
        // Option D submit buttons
        if (target.id === 'submit-d' || target.id === 'submit-d-night') {
            const inputId = target.id === 'submit-d' ? 'option-d' : 'option-d-night';
            const input = document.getElementById(inputId);
            const picks = window.CAY_MULTI.picks();
            if (input && picks.length) {
                sendPicks(picks, input.value.trim());
                input.value = '';
                input.style.height = '';
            } else if (input && input.value.trim()) {
                handleOptionClick('d', input.value.trim());
                input.value = '';
                input.style.height = '';   // shrink back after sending
            }
            return;
        }
        
        // Transition to campfire
        if (target.closest('.euphoria-btn')) {
            toggleEuphoria();
            return;
        }
        
        if (target.closest('.export-btn')) {
            exportTranscript();
            return;
        }
        
        // ☀️ / 🌙 artwork (theme.js); saved, default daytime
        if (target.id === 'theme-btn') {
            state.theme = state.theme === 'night' ? 'day' : 'night';
            safeSetStorage('theme', state.theme);
            window.CAY_THEME.apply(state.theme);
            // Story not started yet: swap to the matching opener. Mid-story, the
            // AI hears "(Scene: ...)" with the next message and lets time pass.
            if (state.mode === 'campfire' && state.currentRound === 0 && !state.isDemo) {
                const g = getCompanionGreeting('campfire');
                state.opener = g.message;
                displayMessage(g.message, g.options, { local: true, replace: true });
            }
            return;
        }
        
        if (target.id === 'spice-btn') {
            toggleSpice();
            return;
        }
        
        // "Today's Special": restart the canteen with a surprise opener
        if (target.id === 'special-btn') {
            initializeCanteen({ special: true });
            return;
        }
        
        if (target.id === 'transition-btn') {
            if (state.transitioning) return;
            state.transitioning = true;
            playDragonTransition(() => initializeCampfire()).then(() => {
                state.transitioning = false;
            });
            return;
        }
        
        if (target.id === 'lore-import-btn') {
            window.CAY_LORE_IMPORT?.open();
            return;
        }

        // Return to canteen
        if (target.id === 'return-canteen') {
            if (state.transitioning) return;
            state.transitioning = true;
            playDragonTransition(() => initializeCanteen(), { home: true }).then(() => {
                state.transitioning = false;
            });
            return;
        }
        
        // Settings button
        if (target.id === 'settings-btn') {
            showCompanionSelector();
            return;
        }
        
        // Reset button
        if (target.id === 'reset-btn') {
            if (confirm(tr('ui.confirmReset'))) {
                resetStorage();
                location.reload();
            }
            return;
        }
        
        // Ticket modal buttons
        if (target.id === 'copy-ticket') {
            const textarea = document.getElementById('ticket-copyable');
            if (textarea) {
                const done = () => {
                    target.textContent = tr('ui.copied');
                    setTimeout(() => { target.textContent = tr('ui.copy'); }, 2000);
                };
                const legacyCopy = () => { textarea.select(); document.execCommand('copy'); done(); };
                if (navigator.clipboard?.writeText) {
                    navigator.clipboard.writeText(textarea.value).then(done, legacyCopy);
                } else {
                    legacyCopy();
                }
            }
            return;
        }
        
        // ✕ button, or a click on the dark backdrop outside the ticket
        if (target.closest('#close-ticket-x') || target.id === 'ticket-modal') {
            closeTicket();
            return;
        }
        
        if (target.id === 'close-ticket') {
            const modal = document.getElementById('ticket-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
            initializeCanteen();
            return;
        }
    });
    
    // Language picker (header and companion selector)
    document.addEventListener('change', (e) => {
        if (e.target instanceof HTMLSelectElement && e.target.classList.contains('lang-select')) {
            changeLanguage(e.target.value);
        }
    });
    
    // Esc closes the ticket or the companion selector
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!document.getElementById('ticket-modal')?.classList.contains('hidden')) {
            closeTicket();
        } else if (!document.getElementById('companion-selector')?.classList.contains('hidden')) {
            closeCompanionSelector();
        }
    });
    
    // Option D: Enter sends, Shift+Enter adds a line. Never send while an IME
    // (Chinese/Japanese/Korean input) is still composing: that Enter picks a word.
    const isD = (el) => el?.id === 'option-d' || el?.id === 'option-d-night';
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' || e.shiftKey || e.isComposing || e.keyCode === 229 || !isD(e.target)) return;
        e.preventDefault();
        document.getElementById(e.target.id === 'option-d' ? 'submit-d' : 'submit-d-night')?.click();
    });
    
    // Grow the D box with its text (CSS caps it at 40% of the screen, then it scrolls)
    document.addEventListener('input', (e) => {
        if (!isD(e.target)) return;
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight + 4}px`;
    });
    
    console.log('Event delegation setup complete');
}

function handleOptionClick(option, customText = null) {
    const shownSuffix = state.mode === 'canteen' ? '' : '-night';
    // option: 'a' | 'b' | 'c' | 'd' | a multi-pick like 'a+c' or 'a+c+d' (text given)
    record({ role: 'user', choice: option,
        text: customText ?? document.getElementById(`option-${option}${shownSuffix}`)?.textContent ?? '' });

    // After a care reply, A leaves the conversation gently
    if (state.afterCare && option === 'a') {
        state.afterCare = false;
        return initializeCanteen();
    }
    // After "too hard, try another" in the canteen, A/B/C are a local menu
    if (state.mode === 'canteen' && state.offMenu && option !== 'd') {
        state.offMenu = false;
        if (option === 'a') return initializeCanteen({ special: true });
        if (option === 'b') return initializeCanteen();
        return document.getElementById('transition-btn')?.click();
    }
    state.offMenu = false;
    state.afterCare = false;

    // After the ticket was closed with ✕, A/B/C are local menu actions
    if (state.mode === 'canteen' && state.afterTicket) {
        if (option === 'a') return reopenTicket();
        if (option === 'b') return initializeCanteen();
        if (option === 'c') return document.getElementById('transition-btn')?.click();
        if (state.isDemo) {
            return displayMessage(tr('ui.demoCantRewrite'), afterTicketOptions());
        }
        state.afterTicket = false;   // extension: D text goes to the AI as a refinement
    }
    
    const suffix = state.mode === 'canteen' ? '' : '-night';
    let choiceText;
    
    if (customText !== null) {
        choiceText = customText;
    } else {
        const btnId = `option-${option}${suffix}`;
        choiceText = document.getElementById(btnId).textContent;
    }

    // Local screening of free text (safety.js). Self-harm: always, never sent.
    // Sexual/violent: demo only, since the script can't refuse and would echo it.
    if (option.includes('d')) {
        const verdict = window.CAY_SAFETY.classify(choiceText);
        if (verdict === 'care') return showCare();
        if (verdict === 'offmenu' && state.isDemo) return showOffMenu();
    }
    
    // Add to history
    state.conversationHistory.push({
        role: 'user',
        choice: option,
        text: choiceText
    });
    
    state.currentRound++;
    
    // Process based on mode
    if (state.mode === 'canteen') {
        processCanteenChoice(option, choiceText);
    } else {
        processCampfireChoice(option, choiceText);
    }
}

function processCanteenChoice(option, text) {
    if (state.isDemo) {
        showThinking();   // the demo "thinks" too, so judges see the animation
        loadModule('demo-scripts.js').then(module => {
            // The demo script branches on one letter: a multi-pick follows its first one
            module.handleCanteenChoice(option.length > 1 ? option[0] : option, text, state.currentRound);
        });
    } else {
        sendToAIStudio(text);
    }
}

function processCampfireChoice(option, text) {
    if (state.isDemo) {
        showThinking();
        loadModule('demo-scripts.js').then(module => {
            module.handleCampfireChoice(option.length > 1 ? option[0] : option, text, state.currentRound);
        });
    } else {
        sendToAIStudio(text);
    }
    
    // Grow campfire every 2 rounds (the single rAF loop picks it up)
    if (state.currentRound % 2 === 0 && state.campfireIntensity < 5) {
        state.campfireIntensity++;
        document.getElementById('app')?.setAttribute('data-fire', String(state.campfireIntensity));
    }
}

// ============================================
// AI Studio Integration (extension mode)
// window.cayBridge is defined by content.js in the same content-script world.
// ============================================

function sendToAIStudio(userMessage) {
    if (!window.cayBridge) {
        console.warn('AI Studio bridge not available.');
        return;
    }
    if (state.forging) window.CAY_LORE_IMPORT?.cancel();   // a story turn replaces a pending forge
    showThinking();
    window.cayBridge.send(userMessage, {
        mode: state.mode,
        companion: state.companion,
        language: I18N.languageName,
        opener: state.opener || '',
        spice: state.spice,
        euphoria: !!state.euphoria,
        round: state.currentRound,
        scene: state.theme === 'night' ? 'night' : 'daytime',
        loreBrief: state.mode === 'campfire' ? state.loreBrief : ''
    });
}

// Called by content.js with a COMPLETE, de-duplicated tag set
// ============================================
// Off-limits and care replies
// ============================================

// "Too hard, try another": Gemini's [STATUS: offmenu], an AI Studio safety
// block, or the demo's local screen. The line is ours (pre-written, cute).
function showOffMenu({ options = null, undoRound = false } = {}) {
    if (undoRound) state.currentRound = Math.max(0, state.currentRound - 1);
    state.nextKind = 'offmenu';
    const lines = tr(`${state.companion}.offMenu`);
    const line = Array.isArray(lines) ? lines[Math.floor(Math.random() * lines.length)] : '';
    if (!options) {
        if (state.mode === 'canteen') {
            state.offMenu = true;   // A: today's special, B: new order, C: off the clock
            options = [tr('ui.special'), tr('ui.newOrder'), tr('ui.offTheClock')];
        } else {
            options = getCompanionGreeting('campfire').options;   // plain story actions
        }
    }
    displayMessage(line, options, { local: true });
}

// AI Studio's own filter blocked the reply. Often a false alarm (a real test:
// "just woke up, need to pee"), so nobody is told off: the round is undone and
// the same options stay, so the story or order simply continues.
function showBlocked() {
    state.currentRound = Math.max(0, state.currentRound - 1);
    state.nextKind = 'blocked';
    const suffix = state.mode === 'canteen' ? '' : '-night';
    const options = ['a', 'b', 'c'].map(k => document.getElementById(`option-${k}${suffix}`)?.textContent || '');
    displayMessage(`${tr(`${state.companion}.oops`)} ${tr('ui.blocked')}`, options, { local: true });
}

// Self-harm / suicide: no jokes, no sounds, no wobble. Sincere and short.
function showCare(aiMessage = null, aiOptions = null) {
    if (state.euphoria) {
        state.euphoria = false;
        syncEuphoria();
        window.cayBridge?.resetMode('canteen');
        window.cayBridge?.resetMode('campfire');
    }
    state.nextKind = 'care';
    if (aiMessage && aiOptions) return displayMessage(aiMessage, aiOptions, { local: false });
    state.afterCare = true;
    const leave = tr(state.mode === 'canteen' ? 'ui.newOrder' : 'ui.returnCanteen');
    displayMessage(tr('ui.care'), [leave, '', ''], { local: false });
}

function handleAIResponse(tags) {
    // A pending worldbook forge owns the next reply; the chat stays as it was
    if (state.forging) return window.CAY_LORE_IMPORT?.onReply(tags);
    state.offMenu = false;
    state.afterCare = false;
    const status = String(tags.status || '').toLowerCase();
    const aiOptions = tags.optionA && tags.optionB && tags.optionC ? [tags.optionA, tags.optionB, tags.optionC] : null;
    state.nextKind = status || 'reply';
    if (tags.blocked) return showBlocked();
    if (status === 'offmenu') return showOffMenu({ options: aiOptions, undoRound: true });
    if (status === 'care') {
        state.currentRound = Math.max(0, state.currentRound - 1);
        return showCare(tags.message, aiOptions);
    }
    if (tags.kiroOrder) {
        showKiroOrderTicket(tags.kiroOrder);
        return;
    }
    if (tags.message && tags.optionA && tags.optionB && tags.optionC) {
        displayMessage(tags.message, [tags.optionA, tags.optionB, tags.optionC]);
    }
}

// ============================================
// Kiro Order Ticket
// Accepts a fields object (demo) or the raw [KIRO_ORDER] markdown (AI).
// ============================================

const TICKET_FIELDS = [
    ['summary', 'Task Summary'],
    ['input', 'Input Format'],
    ['output', 'Output Format'],
    ['constraints', 'Constraints'],
    ['antipatterns', 'Anti-Patterns'],
    // Written by the companion from the conversation; the user is never asked for it
    ['done', 'Done When']
];
const OPTIONAL_FIELDS = new Set(['done']);

function parseOrderText(text) {
    const fields = {};
    TICKET_FIELDS.forEach(([key, title], i) => {
        const next = TICKET_FIELDS[i + 1]?.[1];
        const re = new RegExp(`#+\\s*${title}[^\\n]*\\n([\\s\\S]*?)${next ? `(?=#+\\s*${next})` : '$'}`, 'i');
        fields[key] = (text.match(re)?.[1] || '').trim();
    });
    return fields;
}

function formatTicket(f) {
    const title = tr('ui.ticketTitle').replace('🎫', '').trim();
    return [`# ${title}`, ...TICKET_FIELDS
        .filter(([k]) => f[k] || !OPTIONAL_FIELDS.has(k))
        .map(([k]) => `## ${tr(`ui.${k}`)}\n${f[k] || '-'}`)].join('\n\n');
}

function afterTicketOptions() {
    return [tr('ui.showTicket'), tr('ui.newOrder'), tr('ui.offTheClock')];
}

// Close without losing the ticket; the canteen offers next steps
function closeTicket() {
    document.getElementById('ticket-modal')?.classList.add('hidden');
    if (state.mode !== 'canteen') return;
    state.afterTicket = true;
    state.nextKind = 'menu';
    displayMessage(tr(`${state.companion}.afterTicket`), afterTicketOptions(), { local: true });
}

function reopenTicket() {
    if (state.ticketData) document.getElementById('ticket-modal')?.classList.remove('hidden');
}

function showKiroOrderTicket(orderData) {
    state.afterTicket = false;
    setThinking(false);
    let fields = typeof orderData === 'string' ? parseOrderText(orderData) : orderData;
    // Drunken master: whatever the companion says, the ticket stays sober
    if (state.euphoria) fields = window.CAY_EUPHORIA.scrubTicket(fields);
    state.nextKind = null;
    record({ role: 'ticket', fields });
    const parsedOk = TICKET_FIELDS.some(([k]) => fields[k]);
    state.ticketData = fields;
    
    TICKET_FIELDS.forEach(([key]) => {
        const el = document.getElementById(`ticket-${key}`);
        if (!el) return;
        el.textContent = fields[key] || '-';
        // Optional sections (Done When) disappear when empty
        el.closest('.ticket-section').hidden = OPTIONAL_FIELDS.has(key) && !fields[key];
    });
    document.getElementById('ticket-copyable').value =
        parsedOk ? formatTicket(fields) : `# Kiro Order Ticket\n\n${String(orderData).trim()}`;
    
    document.getElementById('ticket-modal').classList.remove('hidden');
}

// Shared API for demo-scripts.js and content.js
window.chatAndYou = {
    boot,
    displayMessage,
    showKiroOrderTicket,
    handleAIResponse,
    startCampfire: () => initializeCampfire(),
    goCanteen: () => initializeCanteen(),
    forgeFailed: (reason) => window.CAY_LORE_IMPORT?.onFail(reason),
    state
};

// ============================================
// Worldbook import (lore-import.js): a new world starts a fresh campfire run
// ============================================
function initLoreImport() {
    window.CAY_LORE_IMPORT?.init({
        isDemo: () => state.isDemo,
        language: () => I18N.languageName,
        current: () => state.customWorldbook?.worldbook_name || null,
        setForging: (on) => { state.forging = on; },
        send: (prompt) => {
            window.cayBridge?.send(prompt, { mode: 'forge', raw: true });
            // The forge reply isn't a campfire turn: re-prime the story next time
            window.cayBridge?.resetMode('campfire');
        },
        play: (worldbook) => {
            state.customWorldbook = worldbook;
            record({ role: 'event', text: worldbook
                ? `Imported worldbook: ${worldbook.worldbook_name}` : 'Back to the default worldbook' });
            initializeCampfire();
        }
    });
}
