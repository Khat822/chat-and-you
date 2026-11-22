// English (reference pack: every other pack uses the same keys)
CAY_I18N.register('en', {
    label: 'English',
    languageName: 'English',
    ui: {
        chooseCompanion: 'Choose Your Companion',
        cat: 'Cat 貓貓',
        catDesc: 'Chill, concise, gently sarcastic',
        dog: 'Dog 狗狗',
        dogDesc: 'Warm, enthusiastic, encouraging',
        demoMode: 'DEMO MODE',
        reset: 'Reset & start fresh',
        settings: 'Change companion',
        language: 'Language',
        returnCanteen: 'Back to the Canteen',
        optionD: 'Option D: Write it myself',
        placeholder: 'Type your own response... (Enter to send, Shift+Enter for a new line)',
        send: 'Send',
        offTheClock: "Off the clock: Let's talk Dragons & Magic",
        special: "🎲 Today's Special",
        specialHint: 'Skip the thinking: the chef picks a surprise question',
        spiceLight: '🧂 Mild',
        spiceNormal: '🌶️ Normal',
        spiceHint: 'Companion humor: mild = calm, normal = playful (AI Studio only)',
        catnip: "🌿 Catnip Mode",
        ball: "🎾 Squeaky Ball Mode",
        euphoriaHint: "Your companion gets silly. The order ticket stays sober.",
        care: "That sounds really heavy. You don't have to carry it alone: please reach out to someone you trust, or a local crisis line if you're in danger right now. I'm still here if you want to talk about something else.",
        export: "📥 Download chat",
        exportHint: "Save the whole conversation with notes, to paste into another AI for a second opinion",
        themeHint: "Daytime / night artwork",
        pickHint: "Pick several: tap ＋ on each, then Send",
        huh: "🤔 Wait, what?",
        huhHint: "Didn't get that? Your companion will explain it more simply",
        huhAsk: "Wait, I didn't get that. Can you say it more simply?",
        serve: "🎫 That's enough, serve it",
        serveHint: "Skip the remaining questions and get your ticket now",
        serveAsk: "That's enough. Please serve my ticket now with what you have, and mark anything unsure as an assumption.",
        blocked: "AI Studio's safety filter blocked that reply. It can be oversensitive, so try saying it another way.",
        ticketTitle: '🎫 Kiro Order Ticket',
        summary: 'Task Summary',
        input: 'Input Format',
        output: 'Output Format',
        constraints: 'Constraints',
        antipatterns: 'Anti-Patterns (Avoid)',
        done: "✅ Done When",
        copy: '📋 Copy Ticket',
        copied: '✓ Copied!',
        startOver: 'Start Over',
        close: 'Close (Esc)',
        showTicket: '🎫 Show my ticket again',
        newOrder: 'Start a new order',
        demoCantRewrite: "The demo can't rewrite tickets, but the AI Studio version can!",
        confirmReset: 'Reset everything and start fresh?',
        showAIStudio: '🛠 Show AI Studio',
        backToApp: '💬 Back to CHAT. AND YOU.',
        failNoBox: "I can't find AI Studio's prompt box. Are you on a chat page and signed in?",
        failNotSent: "My message never reached AI Studio's chat (Run didn't fire).",
        failNoReply: "AI Studio got the message but hasn't replied.",
        failFormat: "AI Studio replied, but not in the tag format I can read.",
        failHint: 'Tap "Show AI Studio" (bottom-right) to check, then tap A to resend.'
    },
    cat: {
        oops: 'Hm.',
        thinking: '...thinking. Give me a sec.',
        sounds: ["meow~","purrr...","mrrp~"],
        offMenu: ["Mrrp. That one's too hard for this kitchen. Pick another?","Nope, that's not on the menu. Try something else?","*hides under the counter* Too spicy for me. Another question?"],
        afterTicket: "Ticket's on the counter. Grab it again, start fresh, or want something changed? Type it below.",
        huh: "Short version: tap whichever sounds closest. No wrong answers, and you can change it later.",
        canteen: {
            message: "Hey. So you need help turning a fuzzy idea into an actual prompt? Let's start simple: what's the problem you're trying to solve?",
            options: ['I need to analyze some data', 'I want to write or edit content', 'I need help with code']
        },
        campfireDay: {
            message: "Took you long enough. You dozed off by a smoldering campfire, and the forest around you is bright with afternoon sun. What do you do?",
            options: ["Look around carefully","Follow the sound of running water","Check my belongings"]
        },
        campfire: {
            message: "Took you long enough. You're lying by a campfire in a forest you don't recognize. What do you do?",
            options: ['Look around carefully', 'Call out for help', 'Check my belongings']
        }
    },
    dog: {
        oops: 'Oh no!',
        thinking: 'Ooh, let me think!',
        sounds: ["woof!","arf arf!","*pant pant*"],
        offMenu: ["Whoa, that one's too hard for me! Can we try another?","Hmm, that's not on today's menu! Pick something else?","*tilts head* I don't know that trick! Another question?"],
        afterTicket: 'Your ticket is safe with me! Want to see it again, start a new one, or change something? Type below!',
        huh: "No worries! Just tap whatever feels closest. There's no wrong answer, and we can always change it later!",
        canteen: {
            message: "Hi there! Awesome to meet you! Let's build the perfect prompt together! First up: what kind of task are we tackling today?",
            options: ['Data analysis or processing', 'Writing or content creation', 'Programming or debugging']
        },
        campfireDay: {
            message: "The sun's out, the birds are singing, and adventure is waiting! You're at the edge of a mysterious forest, the campfire still smoking. What's your first move?",
            options: ["Explore the forest path","Climb a tree to look around","Look for other travelers"]
        },
        campfire: {
            message: "The campfire's warm, the stars are bright, and adventure is waiting! You're at the edge of a mysterious forest. What's your first move?",
            options: ['Explore the forest path', 'Set up camp here for the night', 'Look for other travelers']
        }
    },
    // "Today's Special": surprise openers. Keep 6 items in this order in every
    // pack; demo-scripts.js maps each option to a canteen flow by position.
    specials: {
        cat: "Today's special, chef's choice:",
        dog: "Ooh, today's special!",
        list: [
            { q: "What's one thing you copy-paste way too often?",
              options: ['The same email replies', 'Numbers into a spreadsheet', 'The same chunk of code'] },
            { q: "If your to-do list were a soup, what's the weirdest ingredient floating in it?",
              options: ['A spreadsheet nobody understands', 'A bug that only shows up on Fridays', 'Fifty unread emails'] },
            { q: 'Which task makes you sigh the loudest?',
              options: ['Fixing the same error again', 'Writing reports', 'Cleaning up messy data'] },
            { q: 'A goose just stole your laptop. Which file do you beg it to bring back?',
              options: ['The budget spreadsheet', 'My half-finished essay', 'My side-project code'] },
            { q: 'You get a tireless helper for one week. What do you hand over first?',
              options: ['Drafting posts and emails', 'Writing tests for my code', 'Turning receipts into a tidy table'] },
            { q: 'Your keyboard just gained feelings. What is it most tired of typing?',
              options: ['The same apology email', 'console.log everywhere', 'Endless numbers into cells'] }
        ]
    }
});
