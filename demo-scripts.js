// ============================================
// CHAT. AND YOU. - Demo Mode Scripts
// Pre-scripted conversation flows for standalone demo
// ============================================

// Access main app state
const appState = () => window.chatAndYou.state;
const displayMessage = (msg, opts) => window.chatAndYou.displayMessage(msg, opts);
const showTicket = (data) => window.chatAndYou.showKiroOrderTicket(data);

// ============================================
// Canteen Demo Flow
// ============================================

const canteenFlows = {
    cat: {
        data_analysis: [
            {
                message: "Data analysis, got it. So what kind of data are we talking about here?",
                options: [
                    "Excel spreadsheets with sales data",
                    "CSV files from a database",
                    "Unstructured text that needs parsing"
                ]
            },
            {
                message: "Sales data in Excel. Cool. What do you actually want to *do* with it though?",
                options: [
                    "Find trends and patterns",
                    "Create a summary report",
                    "Predict future sales"
                ]
            },
            {
                message: "Find trends. Okay, last thing: what do you *not* want? Any formats or approaches to avoid?",
                options: [
                    "Don't make it too technical",
                    "No Python code, I don't code",
                    "Avoid overwhelming detail"
                ]
            },
            {
                message: "Perfect. I've got enough to build your prompt. Check this out.",
                options: [],
                generateTicket: true,
                ticketData: {
                    summary: "Analyze sales data from Excel to identify trends and patterns",
                    input: "Excel spreadsheet (.xlsx) containing sales data with dates, products, and revenue",
                    output: "A clear, non-technical summary of key trends, seasonality, and notable patterns in plain English",
                    constraints: "Focus on actionable insights. Use simple language without technical jargon. Include visualizations if possible.",
                    antipatterns: "Avoid: overwhelming statistical details, Python code, raw data dumps, technical terminology",
                    done: "A non-technical reader can name the top 3 trends after one read; every trend points to the months or products it comes from; no code or statistics jargon appears."
                }
            }
        ],
        writing: [
            {
                message: "Writing stuff, huh? What kind of content?",
                options: [
                    "Blog posts or articles",
                    "Marketing copy",
                    "Technical documentation"
                ]
            },
            {
                message: "Blog posts. Alright. What's the vibe you're going for?",
                options: [
                    "Professional and informative",
                    "Casual and conversational",
                    "Persuasive and sales-focused"
                ]
            },
            {
                message: "Casual and conversational. Nice. Anything you definitely *don't* want in the writing?",
                options: [
                    "No corporate buzzwords",
                    "Don't be too formal or stiff",
                    "Avoid being too salesy"
                ]
            },
            {
                message: "Got it. Here's your prompt, ready to copy.",
                options: [],
                generateTicket: true,
                ticketData: {
                    summary: "Write casual, conversational blog posts",
                    input: "Topic or outline for blog post",
                    output: "Blog post (800-1200 words) with casual, conversational tone that feels like talking to a friend",
                    constraints: "Use simple language. Include personal anecdotes or relatable examples. Break up text with subheadings. Natural, flowing sentences.",
                    antipatterns: "Avoid: corporate buzzwords, stiff formal language, sales pitches, jargon, overly academic tone",
                    done: "Read aloud, it sounds like a friend talking; 800-1200 words with subheadings; no buzzwords or sales pitch."
                }
            }
        ],
        coding: [
            {
                message: "Code help. What language are we working with?",
                options: [
                    "JavaScript / TypeScript",
                    "Python",
                    "Something else"
                ]
            },
            {
                message: "JavaScript. What kind of help do you need?",
                options: [
                    "Write new functionality",
                    "Debug existing code",
                    "Refactor and improve code"
                ]
            },
            {
                message: "New functionality. Last question: any constraints or preferences for the code?",
                options: [
                    "Keep it simple and readable",
                    "Use modern ES6+ features",
                    "No external dependencies"
                ]
            },
            {
                message: "Alright, here's your prompt. Should get you what you need.",
                options: [],
                generateTicket: true,
                ticketData: {
                    summary: "Write new JavaScript functionality with modern ES6+ features",
                    input: "Description of the functionality needed, including inputs and expected outputs",
                    output: "Clean, well-commented JavaScript code using modern ES6+ syntax (arrow functions, destructuring, async/await, etc.)",
                    constraints: "Code must be readable and maintainable. Include inline comments explaining complex logic. Use descriptive variable names. Follow common JS conventions.",
                    antipatterns: "Avoid: var declarations, callback hell, unclear variable names, undocumented complex logic, outdated syntax",
                    done: "The code does what was described on the example inputs; no var and no deeply nested callbacks; every non-obvious step has a short comment."
                }
            }
        ]
    },
    dog: {
        data_analysis: [
            {
                message: "Data analysis! Awesome! What kind of data are we working with?",
                options: [
                    "Spreadsheets with numbers",
                    "Database exports",
                    "Text files or documents"
                ]
            },
            {
                message: "Spreadsheets! Perfect! What's the goal here? What do you want to learn from this data?",
                options: [
                    "Spot trends over time",
                    "Create charts and visuals",
                    "Make predictions"
                ]
            },
            {
                message: "Trends over time, great choice! One more thing: how do you want the results? What format works best?",
                options: [
                    "Simple plain English summary",
                    "Charts and graphs",
                    "Bullet points with key findings"
                ]
            },
            {
                message: "Amazing! I've put together the perfect prompt for you!",
                options: [],
                generateTicket: true,
                ticketData: {
                    summary: "Analyze spreadsheet data to identify trends over time",
                    input: "Spreadsheet file with time-series data (dates + metrics)",
                    output: "Simple plain English summary highlighting key trends, changes, and notable patterns over the time period",
                    constraints: "Focus on the story the data tells. Explain trends in simple terms. Highlight what's unusual or significant. Keep it concise.",
                    antipatterns: "Avoid: technical statistical jargon, raw numbers without context, complex formulas, overwhelming detail",
                    done: "The summary fits on one screen; each trend names the time period it covers; a non-expert can explain it back in their own words."
                }
            }
        ],
        writing: [
            {
                message: "Writing and content creation! Love it! What type of writing?",
                options: [
                    "Blog posts",
                    "Social media content",
                    "Email newsletters"
                ]
            },
            {
                message: "Email newsletters! That's so cool! What's the goal of these newsletters?",
                options: [
                    "Keep subscribers engaged",
                    "Promote products or services",
                    "Share knowledge and tips"
                ]
            },
            {
                message: "Share knowledge and tips! Perfect! What style do you want?",
                options: [
                    "Friendly and helpful",
                    "Fun and entertaining",
                    "Authoritative and expert"
                ]
            },
            {
                message: "You're going to love this prompt! Here it is!",
                options: [],
                generateTicket: true,
                ticketData: {
                    summary: "Write friendly, helpful email newsletters that share knowledge and tips",
                    input: "Topic or theme for the newsletter",
                    output: "Email newsletter (300-500 words) with a warm, helpful tone. Include 2-3 actionable tips or insights. Engaging subject line included.",
                    constraints: "Use conversational language. Make it scannable with short paragraphs. Include a clear call-to-action. Personal and approachable tone.",
                    antipatterns: "Avoid: salesy language, long walls of text, passive voice, corporate speak, being preachy or condescending",
                    done: "300-500 words with 2-3 tips someone can try today; one clear subject line and one call to action; no salesy or preachy lines."
                }
            }
        ],
        coding: [
            {
                message: "Programming! Exciting! Which language are you working with?",
                options: [
                    "Python",
                    "JavaScript",
                    "Other"
                ]
            },
            {
                message: "Python! Fantastic choice! What do you need help with?",
                options: [
                    "Building something new",
                    "Fixing bugs",
                    "Understanding existing code"
                ]
            },
            {
                message: "Building something new! So exciting! What's important to you in the code?",
                options: [
                    "Easy to understand",
                    "High performance",
                    "Follows best practices"
                ]
            },
            {
                message: "Perfect! Here's your custom Python prompt!",
                options: [],
                generateTicket: true,
                ticketData: {
                    summary: "Write new Python code that's easy to understand and follows best practices",
                    input: "Description of what the code should do, including inputs and outputs",
                    output: "Python code that is readable, well-structured, and follows PEP 8 style guidelines. Includes docstrings and comments.",
                    constraints: "Use clear variable names. Add docstrings for functions. Follow Python conventions (snake_case, etc.). Include type hints where helpful. Keep functions focused.",
                    antipatterns: "Avoid: cryptic variable names, missing documentation, overly complex one-liners, inconsistent style, global variables",
                    done: "Runs without errors on the example input; follows PEP 8; every function has a docstring."
                }
            }
        ]
    }
};

// ============================================
// Canteen Demo Flow
// ============================================

let currentCanteenFlow = null;
let currentFlowStep = 0;
let userNotes = [];      // Option D answers: the user's real intent
let ticketIssued = false;

const canteenGreetings = {
    cat: {
        message: "Hey. So you need help turning a fuzzy idea into an actual prompt? Let's start simple: what's the problem you're trying to solve?",
        options: ["I need to analyze some data", "I want to write or edit content", "I need help with code"]
    },
    dog: {
        message: "Hi there! Awesome to meet you! Let's build the perfect prompt together! First up: what kind of task are we tackling today?",
        options: ["Data analysis or processing", "Writing or content creation", "Programming or debugging"]
    }
};

// ============================================
// Clarify loop: an unclear Option D answer doesn't count as a round.
// At most MAX_CLARIFY follow-ups in a row, then we take our best guess.
// ============================================

const MAX_CLARIFY = 2;
let clarifyCount = 0;

// Language-agnostic gibberish check (keyboard mash, symbols, repeats)
export function looksLikeNonsense(text) {
    const t = text.trim();
    const cjk = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(t);
    if (t.length < (cjk ? 1 : 2)) return true;
    const letters = (t.match(/\p{L}/gu) || []).length;
    if (letters / t.length < 0.5) return true;                       // mostly digits/symbols
    if (/(.)\1{3,}/u.test(t)) return true;                           // aaaa, ????, 哈哈哈哈
    const latin = t.replace(/[^a-z]/gi, '');
    if (latin.length >= 5 && !/[aeiouy]/i.test(latin)) return true;  // "sdfghk"
    return /asdf|sdfg|dfgh|fghj|ghjk|hjkl|qwer|wert|erty|rtyu|tyui|yuio|uiop|zxcv|xcvb|cvbn|vbnm/i.test(t);
}

const clarifyLine = {
    cat: "Hm. I didn't catch that. Which of these is closest?",
    dog: 'Oops, my ears missed that! Which one is closest?'
};
const guessLine = { cat: "Fine, I'll take my best guess.", dog: "No worries, I'll take my best guess!" };

const currentOptions = () => {
    const suffix = appState().mode === 'canteen' ? '' : '-night';
    return ['a', 'b', 'c'].map(k => document.getElementById(`option-${k}${suffix}`)?.textContent || '');
};

// 'clarify' = asked again (round undone), 'guess' = gave up asking, 'ok' = clear answer
function judge(unclear) {
    if (!unclear) { clarifyCount = 0; return 'ok'; }
    if (clarifyCount >= MAX_CLARIFY) { clarifyCount = 0; return 'guess'; }
    clarifyCount++;
    appState().currentRound--;
    const options = currentOptions();
    setTimeout(() => displayMessage(clarifyLine[appState().companion], options), 400);
    return 'clarify';
}

// "Today's Special": which canteen flow each option (A, B, C) leads to.
// Same order as specials.list in every i18n pack.
const SPECIAL_FLOWS = [
    ['writing', 'data_analysis', 'coding'],
    ['data_analysis', 'coding', 'writing'],
    ['coding', 'writing', 'data_analysis'],
    ['data_analysis', 'writing', 'coding'],
    ['writing', 'coding', 'data_analysis'],
    ['writing', 'coding', 'data_analysis']
];
let currentSpecial = null;

// special: { message, options, specialIndex } from app.js, or null for the usual greeting
export function startCanteenDemo(special = null) {
    currentCanteenFlow = null;
    currentFlowStep = 0;
    userNotes = [];
    ticketIssued = false;
    clarifyCount = 0;
    currentSpecial = special ? special.specialIndex : null;
    const g = special || canteenGreetings[appState().companion];
    displayMessage(g.message, g.options);
}

// Flow for a first-round answer: special options map by position, else keywords
function firstRoundFlow(option, text, companion) {
    const idx = 'abc'.indexOf(option);
    if (currentSpecial !== null && idx >= 0) {
        return canteenFlows[companion][SPECIAL_FLOWS[currentSpecial][idx]];
    }
    return pickFlow(text, companion);
}

// null = can't tell which topic the user means
function pickFlow(text, companion) {
    const t = text.toLowerCase();
    const flows = canteenFlows[companion];
    if (/data|analy|spreadsheet|excel|csv|數據|資料|数据|データ|데이터/.test(t)) return flows.data_analysis;
    if (/writ|content|blog|email|post|text|文章|寫|写|文字|書|글/.test(t)) return flows.writing;
    if (/code|program|debug|script|bug|程式|代码|コード|코드/.test(t)) return flows.coding;
    return null;
}

export function handleCanteenChoice(option, text, round) {
    if (ticketIssued) return;
    const companion = appState().companion;
    const firstRound = round === 1 || !currentCanteenFlow;

    const nonsense = option === 'd' && looksLikeNonsense(text);
    const topicUnknown = firstRound && !nonsense && !firstRoundFlow(option, text, companion);
    const verdict = judge(nonsense || topicUnknown);
    if (verdict === 'clarify') return;

    if (option === 'd' && !nonsense) userNotes.push(text);

    if (firstRound) {
        currentCanteenFlow = firstRoundFlow(option, text, companion) || canteenFlows[companion].coding;
        currentFlowStep = 0;
    } else {
        currentFlowStep++;
    }

    const step = currentCanteenFlow[currentFlowStep];
    if (!step) return;
    const prefix = verdict === 'guess' ? `${guessLine[companion]} ` : '';

    setTimeout(() => {
        displayMessage(prefix + step.message, step.options);
        if (step.generateTicket) {
            ticketIssued = true;
            setTimeout(() => showTicket(withUserNotes(step.ticketData)), 800);
        }
    }, 600);
}

// "That's enough, serve it": jump straight to this flow's scripted ticket
export function serveCanteenNow() {
    if (ticketIssued || !currentCanteenFlow) return;
    const step = currentCanteenFlow.find(s => s.generateTicket);
    if (!step) return;
    ticketIssued = true;
    setTimeout(() => {
        displayMessage(step.message, step.options);
        setTimeout(() => showTicket(withUserNotes(step.ticketData)), 800);
    }, 600);
}

// Option D text goes into the ticket verbatim: the human supplies intent.
function withUserNotes(data) {
    if (!userNotes.length) return { ...data };
    return {
        ...data,
        constraints: `${data.constraints} In the user's own words: "${userNotes.join('" / "')}".`
    };
}

// ============================================
// Campfire Demo Flow
// Scripted beats, but every anchor (locations, the 2 faction tensions,
// the twist) comes from the shuffled lore session, so each run differs.
// ============================================

const voice = {
    cat: ['Hm.', 'Figures.', 'Well, well.', 'Of course it is.', 'Okay. That happened.'],
    dog: ['Ooh!', 'Whoa, whoa!', 'Oh wow!', 'Here we go!', 'We did it!!']
};

// Used only if the lore pack fails to load (e.g. opened via file://)
const FALLBACK_SESSION = {
    featuredLocations: [
        { name: 'a quiet crossroads', description: 'Where four old roads meet', atmosphere: 'Still and watchful' },
        { name: 'the drowned mill', description: 'A mill half-sunk in black water', atmosphere: 'Damp, creaking, lit by fireflies' }
    ],
    factionTensions: [
        { faction: 'The Lantern Guild', tension: 'Its members are vanishing one by one' },
        { faction: 'The River Folk', tension: 'They are hoarding the last clean water' }
    ],
    twist: { description: 'The map you carry was drawn by your own hand, years from now' }
};

const ENDING_OPTIONS = ['Shuffle a brand-new story', 'Head back to the Canteen', 'Stay by the fire a little longer'];

const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);

function beat(round, text, s, v) {
    const [l1, l2] = s.featuredLocations;
    const [t1, t2] = s.factionTensions;
    switch (round) {
        case 1: return {
            message: `${v} You chose to "${text}". The path spits you out at ${l1.name}: ${lc(l1.description)}. ${l1.atmosphere}.`,
            options: ['Ask the locals what is going on', 'Keep a low profile and listen', 'Head straight for trouble']
        };
        case 2: return {
            message: `${v} Word travels fast here. ${t1.faction}: ${lc(t1.tension)}. Someone in the crowd is watching you.`,
            options: [`Offer help to ${t1.faction}`, 'Stay neutral and gather information', 'Follow the watcher into the dark']
        };
        case 3: return {
            message: `${v} Your trail leads to ${l2.name}. ${l2.atmosphere}. Here you hear the other side: ${t2.faction}: ${lc(t2.tension)}. Both sides want you.`,
            options: [`Side with ${t2.faction}`, `Play ${t1.faction} and ${t2.faction} against each other`, 'Refuse both and slip away']
        };
        case 4: return {
            message: `${v} The campfire roars. Then the truth comes out: ${lc(s.twist.description)}.`,
            options: ['Confront it head-on', 'Run and regroup', 'Turn the secret into leverage']
        };
        default: return {
            message: `${v} You chose "${text}". The night settles. The factions will remember what you did, and the fire burns its brightest.`,
            options: ENDING_OPTIONS
        };
    }
}

export function handleCampfireChoice(option, text, round) {
    const app = window.chatAndYou;
    const companion = appState().companion;

    if (round > 5) {
        if (text === ENDING_OPTIONS[0]) return app.startCampfire();
        if (text === ENDING_OPTIONS[1]) return app.goCanteen();
        setTimeout(() => displayMessage('The fire crackles. No rush.', ENDING_OPTIONS), 400);
        return;
    }

    // TRPG: odd actions are fine ("yes, and"); only gibberish gets a follow-up
    const verdict = judge(option === 'd' && looksLikeNonsense(text));
    if (verdict === 'clarify') return;
    if (verdict === 'guess') text = 'wait quietly by the fire';

    const session = appState().loreSession || FALLBACK_SESSION;
    const v = voice[companion][(round - 1) % voice[companion].length];
    const next = beat(round, text, session, v);
    setTimeout(() => displayMessage(next.message, next.options), 800);
}

export { canteenFlows };
