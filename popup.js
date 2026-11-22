// ============================================
// CHAT. AND YOU. - extension popup
// Shows the companion and mode last used on AI Studio (content.js saves them
// to chrome.storage on every send) and offers three actions.
// "Change companion" asks the open AI Studio tab to show the selector
// (overlay.js listens): the app's own data lives in AI Studio's localStorage,
// which the popup can't reach.
// ============================================
// Strings: popup-i18n.js. Language: the one picked in the app (overlay.js
// saves it as "lang"); before that, the browser language.
const TEXT = window.POPUP_TEXT;
function browserLang() {
    const t = (navigator.language || 'en').toLowerCase();
    if (t.startsWith('zh')) return /hant|tw|hk|mo/.test(t) ? 'zh-TW' : 'zh-CN';
    return Object.keys(TEXT).find(c => c === t.split('-')[0]) || 'en';
}
let L = TEXT.en;
const $ = (id) => document.getElementById(id);
let studioTab = null;

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('lang', ({ lang }) => {
        const code = TEXT[lang] ? lang : browserLang();
        L = TEXT[code];
        document.documentElement.lang = code;
        document.querySelectorAll('[data-t]').forEach(el => { el.textContent = L[el.dataset.t]; });
        loadStatus();
    });
    $('open-aistudio').addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://aistudio.google.com/' });
        window.close();
    });
    $('open-demo').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
        window.close();
    });
    $('reset').addEventListener('click', () => {
        if (!studioTab) return;
        chrome.tabs.sendMessage(studioTab.id, { type: 'cay-choose-companion' }, () => void chrome.runtime.lastError);
        window.close();
    });
});

function loadStatus() {
    chrome.storage.local.get(['companion', 'currentMode'], ({ companion, currentMode }) => {
        $('companion').textContent = L[companion] || L.notChosen;
        $('mode').textContent = L[currentMode] || L.none;
        const p = $('portrait');
        const art = companion === 'cat' || companion === 'dog'
            ? `assets/img/${companion}${currentMode === 'campfire' ? '-campfire' : ''}.webp` : '';
        p.classList.toggle('empty', !art);
        p.style.backgroundImage = art ? `url("${art}")` : '';
    });
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        const on = !!tab?.url?.startsWith('https://aistudio.google.com/');
        studioTab = on ? tab : null;
        $('status').textContent = on ? L.active : L.inactive;
        $('status').className = on ? 'ok' : 'warn';
        $('reset').disabled = !on;
        $('info').textContent = on ? L.infoActive : L.infoInactive;
    });
}
