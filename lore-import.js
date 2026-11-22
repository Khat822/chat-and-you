// ============================================
// CHAT. AND YOU. - "📜 Import a worldbook" window (classic script, before app.js)
// Two ways in: open a community .json (checked locally, no AI), or paste a
// chat / notes that the AI anonymizes and forges (lore-forge.js). Either way
// the user sees a preview first; forged worlds can be downloaded to share.
// All text goes in via data-i18n / textContent, never as HTML.
// ============================================
(() => {
    'use strict';
    if (window.CAY_LORE_IMPORT) return;

    let cfg = null;      // { isDemo(), language(), send(prompt), play(wb|null), current(), setForging(on) }
    let modal = null;
    let pending = null;  // worldbook shown in the preview
    const t = (k, v) => window.CAY_I18N.t(k, v);
    const $ = (sel) => modal.querySelector(sel);
    const el = (tag, text) => Object.assign(document.createElement(tag), { textContent: text });

    const MARKUP = `
<div class="modal-content lore" role="dialog" aria-modal="true" aria-labelledby="lore-title">
  <button class="modal-close" type="button" data-lore="close" data-i18n-title="ui.close">✕</button>
  <h2 id="lore-title" data-i18n="lore.title"></h2>
  <p class="lore-active" hidden></p>
  <section class="lore-step">
    <p class="lore-label" data-i18n="lore.fileLabel"></p>
    <button type="button" class="lore-btn" data-lore="file" data-i18n="lore.fileBtn"></button>
    <input type="file" accept=".json,application/json" hidden>
  </section>
  <section class="lore-step">
    <label for="lore-text" class="lore-label" data-i18n="lore.pasteLabel"></label>
    <textarea id="lore-text" rows="6" data-i18n-placeholder="lore.placeholder"></textarea>
    <p class="lore-note" data-i18n="lore.privacy"></p>
    <p class="lore-note lore-demo" data-i18n="lore.demoNote" hidden></p>
    <button type="button" class="lore-btn lore-primary" data-lore="forge"></button>
  </section>
  <p class="lore-status" role="status" aria-live="polite"></p>
  <section class="lore-preview" hidden>
    <ul class="lore-summary"></ul>
    <div class="modal-actions">
      <button type="button" class="lore-primary" data-lore="play" data-i18n="lore.play"></button>
      <button type="button" data-lore="download" data-i18n="lore.download"></button>
    </div>
  </section>
  <button type="button" class="lore-link" data-lore="default" data-i18n="lore.useDefault" hidden></button>
</div>`;

    function build() {
        modal = document.createElement('div');
        modal.id = 'lore-modal';
        modal.className = 'modal hidden';
        modal.innerHTML = MARKUP;   // static markup, no user data
        const host = document.getElementById('ticket-modal')?.parentElement || document.body;
        host.append(modal);
        modal.addEventListener('click', onClick);
        $('input[type=file]').addEventListener('change', onFile);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
        });
    }

    const status = (text) => { $('.lore-status').textContent = text; };
    function busy(on) {
        modal.querySelectorAll('[data-lore="forge"], [data-lore="file"], [data-lore="play"]').forEach(b => { b.disabled = on; });
        modal.querySelector('.modal-content').setAttribute('aria-busy', String(on));
    }

    function open() {
        window.CAY_I18N.apply(modal);
        const demo = cfg.isDemo();
        $('[data-lore="forge"]').textContent = t(demo ? 'lore.demoForge' : 'lore.forge');
        $('.lore-demo').hidden = !demo;
        const name = cfg.current();
        $('.lore-active').hidden = !name;
        $('.lore-active').textContent = name ? t('lore.active', { name }) : '';
        $('[data-lore="default"]').hidden = !name;
        modal.classList.remove('hidden');
        $('[data-lore="close"]').focus();
    }
    function close() {
        modal.classList.add('hidden');
        document.getElementById('lore-import-btn')?.focus();
    }

    function preview(worldbook, forged) {
        pending = worldbook;
        const ul = $('.lore-summary');
        const head = el('li', '');
        head.append(el('strong', worldbook.worldbook_name));
        if (worldbook.description) head.append(document.createTextNode(` · ${worldbook.description}`));
        ul.replaceChildren(head,
            el('li', `${t('lore.factions')}: ${worldbook.factions.map(f => f.name).join(', ')}`),
            el('li', `${t('lore.places')}: ${worldbook.locations.map(l => l.name).join(', ')}`),
            el('li', `${t('lore.hooks')}: ${worldbook.starter_hooks.length}`),
            el('li', t('lore.twists', { n: worldbook.twists.length })));
        $('[data-lore="download"]').hidden = !forged;
        $('.lore-preview').hidden = false;
        status(t(forged ? 'lore.ready' : 'lore.loaded'));
        // The preview sits below the paste box: bring it into view
        $('.lore-status').scrollIntoView({ block: 'start', behavior: 'smooth' });
    }

    async function onFile(e) {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        const out = window.CAY_FORGE.fromJSON(await file.text());
        if (out.error) { $('.lore-preview').hidden = true; return status(t('lore.badFile', { why: out.error })); }
        preview(out.worldbook, false);
    }

    function forge() {
        const box = $('#lore-text');
        if (cfg.isDemo()) {
            box.value = window.CAY_LORE_SAMPLE.chat;
            const { count } = window.CAY_FORGE.prepare(box.value);
            status(`${t('lore.scrubbed', { n: count })} ${t('lore.forging')}`);
            busy(true);
            return setTimeout(() => onReply({ lore: window.CAY_LORE_SAMPLE.reply }), 1200);
        }
        const raw = box.value.trim();
        if (raw.length < 30) return status(t('lore.tooShort'));
        const { text, count } = window.CAY_FORGE.prepare(raw);
        status(`${count ? `${t('lore.scrubbed', { n: count })} ` : ''}${t('lore.forging')}`);
        $('.lore-preview').hidden = true;
        busy(true);
        cfg.setForging(true);
        cfg.send(window.CAY_FORGE.prompt(text, cfg.language()));
    }

    // Called by app.js with the parsed tags while a forge is pending
    function onReply(tags) {
        cfg.setForging(false);
        busy(false);
        if (tags.blocked || String(tags.status || '').toLowerCase() === 'offmenu') return status(t('lore.offMenu'));
        if (!tags.lore) return status(t('lore.badForge', { why: 'no worldbook' }));
        const out = window.CAY_FORGE.fromReply(tags.lore);
        if (out.error) return status(t('lore.badForge', { why: out.error }));
        preview(out.worldbook, true);
    }
    // Still "forging": the bridge keeps listening, so a late reply lands here
    function onFail() {
        busy(false);
        status(t('lore.failed'));
    }
    // The user went back to the story: that send replaces the forge
    function cancel() {
        cfg.setForging(false);
        busy(false);
        status('');
    }

    function onClick(e) {
        if (e.target === modal) return close();   // backdrop
        const act = e.target.closest('[data-lore]')?.dataset.lore;
        if (act === 'close') close();
        else if (act === 'file') $('input[type=file]').click();
        else if (act === 'forge') forge();
        else if (act === 'download' && pending) window.CAY_FORGE.download(pending);
        else if (act === 'play' && pending) { close(); cfg.play(pending); }
        else if (act === 'default') { close(); cfg.play(null); }
    }

    window.CAY_LORE_IMPORT = {
        init(c) { cfg = c; if (!modal) build(); },
        open, close, onReply, onFail, cancel
    };
})();
