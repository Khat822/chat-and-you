// 简体中文
CAY_I18N.register('zh-CN', {
    label: '简体中文',
    languageName: 'Simplified Chinese',
    ui: {
        chooseCompanion: '选择你的伙伴',
        cat: '猫猫 Cat',
        catDesc: '冷静、简洁、带点小吐槽',
        dog: '狗狗 Dog',
        dogDesc: '温暖、热情、特别会鼓励',
        demoMode: '演示模式',
        reset: '清除数据重新开始',
        settings: '更换伙伴',
        language: '语言',
        returnCanteen: '回到食堂',
        optionD: 'D：我自己写',
        placeholder: '输入你自己的回答……（Enter 发送，Shift+Enter 换行）',
        send: '发送',
        offTheClock: '下班了：来聊聊龙与魔法吧',
        special: '🎲 今日特餐',
        specialHint: '不用想：主厨随手配一道惊喜问题',
        spiceLight: '🧂 清淡',
        spiceNormal: '🌶️ 正常',
        spiceHint: '伙伴的幽默：清淡＝冷静，正常＝会接梗（仅 AI Studio）',
        catnip: "🌿 木天蓼模式",
        ball: "🎾 球球模式",
        euphoriaHint: "伙伴会变晕乱叫，但点单照样清醒",
        care: "听起来你现在很不好受。你不用一个人扛着：请找一个信任的人聊聊；如果现在有危险，请联系当地的紧急或心理援助热线。想聊点别的，我也一直在这里。",
        export: "📥 下载对话",
        exportHint: "把整段对话加上说明存下来，可以贴给其他 AI 帮你会诊",
        themeHint: "白天／夜晚画面",
        pickHint: "可以多选：点每个选项的 ＋，再点发送",
        huh: "🤔 啊？没听懂",
        huhHint: "没太听懂？伙伴会用更直白的方式再说一遍",
        huhAsk: "等等，我没听懂。能说得简单一点吗？",
        serve: "🎫 够了，直接出菜单",
        serveHint: "跳过剩下的问题，现在就出工单",
        serveAsk: "这样就够了。请用现在的信息直接出菜单，不确定的地方标成假设就好。",
        blocked: "AI Studio 的安全过滤把这条回复拦下了。它有时太敏感，换个说法再试试。",
        ticketTitle: '🎫 Kiro 点单',
        summary: '任务摘要',
        input: '输入格式',
        output: '输出格式',
        constraints: '限制条件',
        antipatterns: '要避免的事',
        done: "✅ 怎样算做好",
        copy: '📋 复制点单',
        copied: '✓ 已复制！',
        startOver: '重新点单',
        close: '关闭（Esc）',
        showTicket: '🎫 再看一次点单',
        newOrder: '开一张新点单',
        demoCantRewrite: '演示模式没法改写点单，AI Studio 版本可以！',
        confirmReset: '要清除所有数据重新开始吗？',
        showAIStudio: '🛠 显示 AI Studio',
        backToApp: '💬 回到 CHAT. AND YOU.',
        failNoBox: '找不到 AI Studio 的输入框。你在聊天页面，而且已经登录了吗？',
        failNotSent: '我的消息没有发进 AI Studio 的聊天（Run 没有触发）。',
        failNoReply: 'AI Studio 收到消息了，但还没回复。',
        failFormat: 'AI Studio 回复了，但格式我读不懂。',
        failHint: '点右下角“显示 AI Studio”看看，再按 A 重发。'
    },
    cat: {
        oops: '嗯。',
        thinking: '……想一下，等我。',
        sounds: ["喵呜～","呼噜噜…","喵～"],
        offMenu: ["喵。这题太难了，换一个问题吧？","这道菜不在菜单上哦，点别的吧。","（躲到柜台底下）太辣了，本喵吃不下，换一题？"],
        afterTicket: '点单放在柜台上了。要再看一次、重新点，还是想改哪里？直接打在下面。',
        huh: "简单说：选最接近的就行。没有错的答案，之后也能改。",
        canteen: {
            message: '嘿。想把模糊的想法变成真正能用的 prompt？先从简单的开始：你想解决什么问题？',
            options: ['我需要分析一些数据', '我想写或修改文字内容', '我需要写代码的帮助']
        },
        campfireDay: {
            message: "睡得可真久。你在一堆冒着余烟的营火旁打盹，四周的森林洒满午后阳光。要做什么？",
            options: ["小心观察四周","循着流水声走过去","检查身上的东西"]
        },
        campfire: {
            message: '睡得可真久。你躺在一片陌生森林的篝火旁。要做什么？',
            options: ['小心观察四周', '大声呼救', '检查身上的东西']
        }
    },
    dog: {
        oops: '糟糕！',
        thinking: '汪，让我想想！',
        sounds: ["汪！","汪汪！","（哈哈喘气）"],
        offMenu: ["哇，这题太难了啦！换一个问题好不好？","嗯…今天的菜单没有这道耶，点别的吧！","（歪头）这个把戏我不会耶！换一题？"],
        afterTicket: '你的点单我帮你收好了！要再看一次、开新的，还是想改哪里？打在下面就好！',
        huh: "没关系！选感觉最接近的就好～没有错的答案，之后随时能改！",
        canteen: {
            message: '嗨嗨！好开心见到你！我们一起做出最棒的 prompt 吧！首先，今天要处理哪种任务呢？',
            options: ['数据分析或处理', '写作或内容创作', '写代码或调试']
        },
        campfireDay: {
            message: "太阳好暖，小鸟在唱歌，冒险正在等你！你站在一座神秘森林的边缘，营火还冒着烟。第一步要做什么？",
            options: ["沿着森林小径探索","爬到树上看看四周","找找看有没有其他旅人"]
        },
        campfire: {
            message: '篝火暖暖的，星星好亮，冒险正在等你！你站在一座神秘森林的边缘。第一步要做什么？',
            options: ['沿着森林小路探索', '今晚就在这里扎营', '找找看有没有其他旅人']
        }
    },
    specials: {
        cat: '今日特餐，主厨随便配：',
        dog: '哇，今日特餐来啦！',
        list: [
            { q: '你最常复制粘贴的东西是什么？',
              options: ['一样的邮件回复', '把数字粘进表格', '同一段代码'] },
            { q: '如果你的待办清单是一碗汤，里面漂着最奇怪的料是什么？',
              options: ['一份没人看得懂的表格', '一个只在周五出现的 bug', '五十封没读的邮件'] },
            { q: '哪件事会让你叹最大一口气？',
              options: ['又在修同一个错误', '写报告', '整理乱七八糟的数据'] },
            { q: '一只鹅刚刚叼走了你的笔记本电脑。你最想求它还你哪个文件？',
              options: ['预算表格', '写到一半的文章', '我的业余项目代码'] },
            { q: '你得到一个不会累的小帮手，期限一周。第一件交给它的事是？',
              options: ['帮我起草帖子和邮件', '给我的代码写测试', '把收据整理成整齐的表格'] },
            { q: '你的键盘突然有了感情。它最受不了一直打的是什么？',
              options: ['同一封道歉信', '到处都是 console.log', '没完没了的数字'] }
        ]
    }
});
