// ============================================
// CHAT. AND YOU. - Lore Shuffler
// Stage-Based Dynamic Worldbook System
// ============================================

/**
 * Load a lore pack JSON file
 * @param {string} filename - Name of the JSON file in lore-packs/
 * @returns {Promise<Object>} Parsed worldbook object
 */
export async function loadLorePack(filename) {
    try {
        // Resolve relative to this module, so it works on GitHub Pages
        // and inside the extension (chrome-extension:// URL) alike.
        const url = new URL(`./lore-packs/${filename}`, import.meta.url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load lore pack: ${response.statusText}`);
        }
        const worldbook = await response.json();
        
        // Validate schema
        if (!validateWorldbook(worldbook)) {
            throw new Error('Invalid worldbook schema');
        }
        
        return worldbook;
    } catch (error) {
        console.error('Lore pack loading error:', error);
        throw error;
    }
}

/**
 * Validate worldbook structure
 * @param {Object} worldbook - Worldbook object to validate
 * @returns {boolean} True if valid
 */
function validateWorldbook(worldbook) {
    const required = ['worldbook_name', 'version', 'factions', 'locations', 'twists', 'starter_hooks'];
    return required.every(field => worldbook.hasOwnProperty(field));
}

/**
 * Shuffle and create a unique session from a worldbook
 * Randomly selects:
 * - 1 starter hook
 * - 2 faction tensions
 * - 1 twist
 * @param {Object} worldbook - Loaded worldbook
 * @returns {Object} Session state with shuffled elements
 */
export function shuffleSession(worldbook) {
    const session = {
        worldbookName: worldbook.worldbook_name,
        starterHook: randomChoice(worldbook.starter_hooks),
        // 2 tensions from 2 different factions, so they can collide
        factionTensions: randomSample(worldbook.factions, 2).map(f => ({
            faction: f.name,
            factionId: f.id,
            tension: randomChoice(f.tensions),
            description: f.description
        })),
        twist: randomChoice(worldbook.twists),
        locations: worldbook.locations,
        featuredLocations: randomSample(worldbook.locations, 2),
        stage: 'opening', // opening, development, climax, resolution
        storyState: {}
    };
    
    console.log('Session shuffled:', session);
    return session;
}

/**
 * Extract all faction tensions from factions array
 * @param {Array} factions - Array of faction objects
 * @returns {Array} Flattened array of all tensions with faction context
 */
function getAllFactionTensions(factions) {
    const tensions = [];
    factions.forEach(faction => {
        faction.tensions.forEach(tension => {
            tensions.push({
                faction: faction.name,
                factionId: faction.id,
                tension: tension,
                description: faction.description
            });
        });
    });
    return tensions;
}

/**
 * Inject lore context into narrative based on user choice and current stage
 * @param {Object} sessionState - Current session state
 * @param {string} userChoice - User's selected option text
 * @param {number} round - Current round number
 * @returns {Object} Updated session state with narrative context
 */
export function injectLoreContext(sessionState, userChoice, round) {
    // Determine story stage based on round
    if (round <= 2) {
        sessionState.stage = 'opening';
    } else if (round <= 5) {
        sessionState.stage = 'development';
    } else if (round <= 8) {
        sessionState.stage = 'climax';
    } else {
        sessionState.stage = 'resolution';
    }
    
    // Build narrative context
    const context = {
        stage: sessionState.stage,
        activeTensions: [],
        activeLocations: [],
        twistRevealed: false
    };
    
    // Inject faction tensions at development stage
    if (sessionState.stage === 'development' || sessionState.stage === 'climax') {
        context.activeTensions = sessionState.factionTensions;
    }
    
    // Reveal twist at climax
    if (sessionState.stage === 'climax' && round === 6) {
        context.twistRevealed = true;
        context.twist = sessionState.twist;
    }
    
    // Select relevant locations
    context.activeLocations = randomSample(sessionState.locations, 2);
    
    sessionState.currentContext = context;
    return sessionState;
}

/**
 * Generate system instruction for AI based on lore session
 * @param {Object} sessionState - Current session state
 * @returns {string} System instruction for AI
 */
export function generateLoreInstruction(sessionState) {
    let instruction = `You are narrating a TRPG story in the "${sessionState.worldbookName}" world.\n\n`;
    
    instruction += `Current Stage: ${sessionState.stage}\n\n`;
    
    if (sessionState.currentContext) {
        const ctx = sessionState.currentContext;
        
        if (ctx.activeTensions.length > 0) {
            instruction += `Active Faction Tensions:\n`;
            ctx.activeTensions.forEach(t => {
                instruction += `- ${t.faction}: ${t.tension}\n`;
            });
            instruction += `\n`;
        }
        
        if (ctx.activeLocations.length > 0) {
            instruction += `Current Locations:\n`;
            ctx.activeLocations.forEach(loc => {
                instruction += `- ${loc.name}: ${loc.description} (${loc.atmosphere})\n`;
            });
            instruction += `\n`;
        }
        
        if (ctx.twistRevealed && ctx.twist) {
            instruction += `TWIST TO REVEAL: ${ctx.twist.description}\n\n`;
        }
    }
    
    instruction += `Provide your response in this format:\n`;
    instruction += `[MSG: Your narrative message]\n`;
    instruction += `[A: First option]\n`;
    instruction += `[B: Second option]\n`;
    instruction += `[C: Third option]\n`;
    
    return instruction;
}

/**
 * Get opening message from starter hook
 * @param {Object} sessionState - Session state
 * @returns {Object} Message and options
 */
export function getOpeningFromSession(sessionState) {
    return {
        message: `Hey, you. You're finally awake. ${sessionState.starterHook.opening}`,
        options: sessionState.starterHook.initial_options
    };
}

/**
 * One-shot brief of the whole shuffled session, sent to the AI once
 * so it can pace the story by stage (used by the AI Studio bridge).
 */
export function buildSessionBrief(s, { hookShown = true } = {}) {
    const tensions = s.factionTensions.map(t => `- ${t.faction}: ${t.tension}`).join('\n');
    const places = s.featuredLocations.map(l => `- ${l.name}: ${l.description} (${l.atmosphere})`).join('\n');
    return [
        `World: ${s.worldbookName}`,
        hookShown
            ? `Opening already shown to the player: ${s.starterHook.opening}`
            : `Opening hook (the player has only seen a short campfire greeting; weave this hook into your FIRST reply): ${s.starterHook.opening}`,
        `Featured locations:\n${places}`,
        `Faction tensions (introduce one around round 2, the other around round 3):\n${tensions}`,
        `Secret twist (reveal around round 4, never earlier): ${s.twist.description}`,
        `Round 5+: move toward a resolution.`
    ].join('\n\n');
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get random choice from array
 */
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random sample of N items from array (without replacement)
 */
function randomSample(array, n) {
    // Fisher-Yates: unbiased, unlike sort(() => Math.random() - 0.5)
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, Math.min(n, a.length));
}

/**
 * Weighted random choice
 */
function weightedChoice(items, weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return items[i];
        }
    }
    
    return items[items.length - 1];
}

// Export utility functions for external use
export { randomChoice, randomSample, weightedChoice };
