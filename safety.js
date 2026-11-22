// ============================================
// CHAT. AND YOU. - local screening of free-text (Option D) answers (classic script)
// 'care'    -> self-harm / suicide: sincere reply, no jokes (all modes, never sent)
// 'offmenu' -> sexual / violent: cute "too hard, try another" (demo only; in
//              AI Studio mode Gemini and AI Studio's own filters handle it)
// Deliberately short lists: this is a safety net, not a content classifier.
// ============================================
(() => {
    'use strict';
    if (window.CAY_SAFETY) return;

    const CARE = new RegExp([
        '\\b(?:suicid\\w*|kill(?:ing)? myself|end(?:ing)? my life|self[- ]?harm|want to die)\\b',
        '自殺|自杀|想死|不想活|輕生|轻生|割腕',
        '死にたい|自殺したい|消えたい',
        '자살|죽고 싶',
        'quiero morir|me quiero matar|je veux mourir|me suicider|selbstmord|mich umbringen|will sterben'
    ].join('|'), 'i');

    const OFF = new RegExp([
        '\\b(?:porn\\w*|nsfw|nudes?|hentai|rape|gore|murder\\w*|behead\\w*|bomb[- ]?making)\\b',
        '色色|色情|做愛|做爱|裸體|裸体|A片|黃片|黄片|血腥|殺人|杀人|強姦|强奸|強暴|强暴|分屍|分尸',
        'エロ|セックス|殺害|レイプ',
        '야동|섹스|살인|강간',
        '\\b(?:sexo|violación|asesinar|meurtre|viol|vergewaltig\\w*|mord)\\b'
    ].join('|'), 'i');

    function classify(text) {
        const t = String(text || '');
        if (CARE.test(t)) return 'care';
        if (OFF.test(t)) return 'offmenu';
        return 'ok';
    }

    window.CAY_SAFETY = { classify };
})();
