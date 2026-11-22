// 繁體中文（台灣）
CAY_I18N.register('zh-TW', {
    label: '繁體中文',
    languageName: 'Traditional Chinese (Taiwan)',
    ui: {
        chooseCompanion: '選擇你的夥伴',
        cat: '貓貓 Cat',
        catDesc: '冷靜、簡潔、帶點小吐槽',
        dog: '狗狗 Dog',
        dogDesc: '溫暖、熱情、超會鼓勵',
        demoMode: '展示模式',
        reset: '清除資料重新開始',
        settings: '更換夥伴',
        language: '語言',
        returnCanteen: '回到食堂',
        optionD: 'D：我自己寫',
        placeholder: '輸入你自己的回答……（Enter 送出，Shift+Enter 換行）',
        send: '送出',
        offTheClock: '下班了：來聊聊龍與魔法吧',
        special: '🎲 今日特餐',
        specialHint: '不用想：主廚隨手配一道驚喜問題',
        spiceLight: '🧂 清淡',
        spiceNormal: '🌶️ 正常',
        spiceHint: '夥伴的幽默：清淡＝冷靜，正常＝會接梗（僅 AI Studio）',
        catnip: "🌿 木天蓼模式",
        ball: "🎾 球球模式",
        euphoriaHint: "夥伴會變茫亂叫，但點單照樣清醒",
        care: "聽起來你現在很不好受。你不用一個人扛著：請找一個信任的人聊聊；如果現在有危險，請撥打當地的緊急或心理支持專線（台灣可撥 1925 安心專線）。想聊點別的，我也一直在這裡。",
        export: "📥 下載對話",
        exportHint: "把整段對話加上說明存下來，可以貼給其他 AI 幫你會診",
        themeHint: "白天／夜晚畫面",
        pickHint: "可以多選：按每個選項的 ＋，再按送出",
        huh: "🤔 蛤？聽不懂",
        huhHint: "聽不太懂？夥伴會用更白話的方式再講一次",
        huhAsk: "等等，我沒聽懂。可以講白話一點嗎？",
        serve: "🎫 夠了，直接出菜單",
        serveHint: "跳過剩下的問題，現在就出工單",
        serveAsk: "這樣就夠了。請用目前的資訊直接出菜單，不確定的地方標成假設就好。",
        blocked: "AI Studio 的安全過濾把這則回覆擋下了。它有時太敏感，換個說法再試試看。",
        ticketTitle: '🎫 Kiro 點單',
        summary: '任務摘要',
        input: '輸入格式',
        output: '輸出格式',
        constraints: '限制條件',
        antipatterns: '要避免的事',
        done: "✅ 怎樣算做好",
        copy: '📋 複製點單',
        copied: '✓ 已複製！',
        startOver: '重新點單',
        close: '關閉（Esc）',
        showTicket: '🎫 再看一次點單',
        newOrder: '開一張新點單',
        demoCantRewrite: '展示模式沒辦法改寫點單，AI Studio 版本可以！',
        confirmReset: '要清除所有資料重新開始嗎？',
        showAIStudio: '🛠 顯示 AI Studio',
        backToApp: '💬 回到 CHAT. AND YOU.',
        failNoBox: '找不到 AI Studio 的輸入框。你在聊天頁面，而且有登入嗎？',
        failNotSent: '我的訊息沒有送進 AI Studio 的聊天（Run 沒有觸發）。',
        failNoReply: 'AI Studio 收到訊息了，但還沒回覆。',
        failFormat: 'AI Studio 有回覆，但格式我讀不懂。',
        failHint: '點右下角「顯示 AI Studio」看看，再按 A 重送。'
    },
    cat: {
        oops: '嗯。',
        thinking: '……想一下，等我。',
        sounds: ["喵嗚～","呼嚕嚕…","喵～"],
        offMenu: ["喵。這題太難了，換一個問題吧？","這道菜不在菜單上喔，點別的吧。","（躲到櫃台底下）太辣了，本喵吃不下，換一題？"],
        afterTicket: '點單放在櫃台上了。要再看一次、重新點，還是想改哪裡？直接打在下面。',
        huh: "簡單說：選最接近的就好。沒有錯的答案，之後也能改。",
        canteen: {
            message: '嘿。想把模糊的點子變成真正能用的 prompt？先從簡單的開始：你想解決什麼問題？',
            options: ['我需要分析一些資料', '我想寫或修改文字內容', '我需要寫程式的幫忙']
        },
        campfireDay: {
            message: "睡得可真久。你在一堆冒著餘煙的營火旁打盹，四周的森林灑滿午後陽光。要做什麼？",
            options: ["小心觀察四周","循著流水聲走過去","檢查身上的東西"]
        },
        campfire: {
            message: '睡得可真久。你躺在一片陌生森林的營火旁。要做什麼？',
            options: ['小心觀察四周', '大聲呼救', '檢查身上的東西']
        }
    },
    dog: {
        oops: '糟糕！',
        thinking: '嗚汪，讓我想想！',
        sounds: ["汪！","汪汪！","（哈哈喘氣）"],
        offMenu: ["哇，這題太難了啦！換一個問題好不好？","嗯…今天的菜單沒有這道耶，點別的吧！","（歪頭）這個把戲我不會耶！換一題？"],
        afterTicket: '你的點單我幫你收好了！要再看一次、開新的，還是想改哪裡？打在下面就好！',
        huh: "沒關係！選感覺最接近的就好～沒有錯的答案，之後隨時都能改！",
        canteen: {
            message: '嗨嗨！好開心見到你！我們一起做出最棒的 prompt 吧！首先，今天要處理哪種任務呢？',
            options: ['資料分析或處理', '寫作或內容創作', '寫程式或除錯']
        },
        campfireDay: {
            message: "太陽好暖，小鳥在唱歌，冒險正在等你！你站在一座神秘森林的邊緣，營火還冒著煙。第一步要做什麼？",
            options: ["沿著森林小徑探索","爬到樹上看看四周","找找看有沒有其他旅人"]
        },
        campfire: {
            message: '營火暖暖的，星星好亮，冒險正在等你！你站在一座神秘森林的邊緣。第一步要做什麼？',
            options: ['沿著森林小徑探索', '今晚就在這裡紮營', '找找看有沒有其他旅人']
        }
    },
    specials: {
        cat: '今日特餐，主廚隨便配：',
        dog: '哇，今日特餐來囉！',
        list: [
            { q: '你最常複製貼上的東西是什麼？',
              options: ['一樣的 email 回覆', '把數字貼進試算表', '同一段程式碼'] },
            { q: '如果你的待辦清單是一碗湯，裡面漂著最奇怪的料是什麼？',
              options: ['一份沒人看得懂的試算表', '一個只在星期五出現的 bug', '五十封沒讀的 email'] },
            { q: '哪件事會讓你嘆最大一口氣？',
              options: ['又在修同一個錯誤', '寫報告', '整理亂七八糟的資料'] },
            { q: '一隻鵝剛剛叼走你的筆電。你最想求牠還你哪個檔案？',
              options: ['預算試算表', '寫到一半的文章', '我的 side project 程式碼'] },
            { q: '你得到一個不會累的小幫手，期限一週。第一件交給它的事是？',
              options: ['幫我起草貼文和 email', '幫我的程式寫測試', '把收據整理成整齊的表格'] },
            { q: '你的鍵盤突然有了感情。它最受不了一直打的是什麼？',
              options: ['同一封道歉信', '到處都是 console.log', '沒完沒了的數字'] }
        ]
    }
});
