// CHAT. AND YOU. - popup strings, one per app language (i18n/*.js codes).
// popup.js picks the language chosen in the app (chrome.storage "lang").
window.POPUP_TEXT = {
    en: {
        status: 'Status', mode: 'Mode', companion: 'Companion',
        active: '✅ Running on AI Studio', inactive: '⏸ Not on AI Studio',
        canteen: '☀️ Canteen', campfire: '🔥 Campfire', none: 'Not used yet',
        cat: 'Cat', dog: 'Dog', notChosen: 'Not chosen yet',
        openStudio: 'Open AI Studio', openDemo: 'Try the demo (no account)', reset: 'Change companion',
        infoActive: 'Tap "Change companion" to pick the cat or the dog again.',
        infoInactive: 'Open AI Studio to chat with your companion, or try the demo first.'
    },
    'zh-TW': {
        status: '狀態', mode: '模式', companion: '夥伴',
        active: '✅ 正在 AI Studio 上執行', inactive: '⏸ 目前不在 AI Studio',
        canteen: '☀️ 食堂', campfire: '🔥 營火', none: '尚未使用',
        cat: '貓貓', dog: '狗狗', notChosen: '還沒選',
        openStudio: '開啟 AI Studio', openDemo: '試玩展示版（免帳號）', reset: '更換夥伴',
        infoActive: '點「更換夥伴」可以重新選貓貓或狗狗。',
        infoInactive: '打開 AI Studio 就能和夥伴聊天，也可以先試玩展示版。'
    },
    'zh-CN': {
        status: '状态', mode: '模式', companion: '伙伴',
        active: '✅ 正在 AI Studio 上运行', inactive: '⏸ 当前不在 AI Studio',
        canteen: '☀️ 食堂', campfire: '🔥 营火', none: '尚未使用',
        cat: '猫猫', dog: '狗狗', notChosen: '还没选',
        openStudio: '打开 AI Studio', openDemo: '试玩演示版（免账号）', reset: '更换伙伴',
        infoActive: '点“更换伙伴”可以重新选猫猫或狗狗。',
        infoInactive: '打开 AI Studio 就能和伙伴聊天，也可以先试玩演示版。'
    },
    ja: {
        status: '状態', mode: 'モード', companion: '相棒',
        active: '✅ AI Studio で動作中', inactive: '⏸ AI Studio ではありません',
        canteen: '☀️ 食堂', campfire: '🔥 焚き火', none: 'まだ使っていません',
        cat: 'ネコ', dog: 'イヌ', notChosen: 'まだ選んでいません',
        openStudio: 'AI Studio を開く', openDemo: 'デモを試す（アカウント不要）', reset: '相棒を変える',
        infoActive: '「相棒を変える」でネコかイヌを選び直せます。',
        infoInactive: 'AI Studio を開くと相棒と話せます。まずはデモもどうぞ。'
    },
    ko: {
        status: '상태', mode: '모드', companion: '동료',
        active: '✅ AI Studio에서 실행 중', inactive: '⏸ AI Studio가 아니에요',
        canteen: '☀️ 식당', campfire: '🔥 모닥불', none: '아직 사용 안 함',
        cat: '고양이', dog: '강아지', notChosen: '아직 안 골랐어요',
        openStudio: 'AI Studio 열기', openDemo: '데모 체험 (계정 불필요)', reset: '동료 바꾸기',
        infoActive: '"동료 바꾸기"를 누르면 고양이나 강아지를 다시 고를 수 있어요.',
        infoInactive: 'AI Studio를 열면 동료와 대화할 수 있어요. 먼저 데모를 해 봐도 좋아요.'
    },
    es: {
        status: 'Estado', mode: 'Modo', companion: 'Compañía',
        active: '✅ Funcionando en AI Studio', inactive: '⏸ No estás en AI Studio',
        canteen: '☀️ Cantina', campfire: '🔥 Fogata', none: 'Aún sin usar',
        cat: 'Gato', dog: 'Perro', notChosen: 'Sin elegir',
        openStudio: 'Abrir AI Studio', openDemo: 'Probar la demo (sin cuenta)', reset: 'Cambiar de compañía',
        infoActive: 'Toca "Cambiar de compañía" para volver a elegir gato o perro.',
        infoInactive: 'Abre AI Studio para charlar con tu compañía, o prueba antes la demo.'
    },
    fr: {
        status: 'État', mode: 'Mode', companion: 'Compagnon',
        active: '✅ Actif sur AI Studio', inactive: "⏸ Pas sur AI Studio",
        canteen: '☀️ Cantine', campfire: '🔥 Feu de camp', none: 'Pas encore utilisé',
        cat: 'Chat', dog: 'Chien', notChosen: 'Pas encore choisi',
        openStudio: 'Ouvrir AI Studio', openDemo: 'Essayer la démo (sans compte)', reset: 'Changer de compagnon',
        infoActive: 'Touche « Changer de compagnon » pour rechoisir le chat ou le chien.',
        infoInactive: "Ouvre AI Studio pour discuter avec ton compagnon, ou essaie d'abord la démo."
    },
    de: {
        status: 'Status', mode: 'Modus', companion: 'Begleiter',
        active: '✅ Läuft auf AI Studio', inactive: '⏸ Nicht auf AI Studio',
        canteen: '☀️ Kantine', campfire: '🔥 Lagerfeuer', none: 'Noch nicht benutzt',
        cat: 'Katze', dog: 'Hund', notChosen: 'Noch nicht gewählt',
        openStudio: 'AI Studio öffnen', openDemo: 'Demo testen (ohne Konto)', reset: 'Begleiter wechseln',
        infoActive: 'Tippe auf „Begleiter wechseln“, um Katze oder Hund neu zu wählen.',
        infoInactive: 'Öffne AI Studio, um mit deinem Begleiter zu chatten, oder teste zuerst die Demo.'
    }
};
