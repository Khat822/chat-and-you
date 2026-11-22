// ============================================
// CHAT. AND YOU. - sample material for the worldbook forge in the standalone
// demo (no AI there). Everyone and everything here is made up. The fake
// email, phone and @handle show the local scrub; the scripted reply goes
// through the same parser (CAY_FORGE.fromReply) as a real AI reply.
// ============================================
(() => {
    'use strict';
    if (window.CAY_LORE_SAMPLE) return;

    const chat = `[22:41] Jamie: who turned OFF the big oven again?? the night batch is ruined
[22:42] Priya: not me. ask Mr. Okafor, he keeps saying the power bill is "killing him"
[22:42] Jamie: he raised the rent AGAIN. Maple Street Bakery can't keep doing this
[22:43] Priya: also... the sourdough starter is gone. the jar is just empty. lid still on
[22:44] Jamie: Old Gus swears that starter is 80 years old and "alive". like actually alive
[22:44] Priya: Gus also swears the oven talks to him at 3am lol
[22:45] Jamie: the new café across the street keeps asking about our recipe btw
[22:46] Priya: suspicious. send me their flyer, my email is priya.k@example.com
[22:46] Jamie: or just DM @priya_bakes. or call 555-0142-889 if it's urgent
[22:47] Priya: ok but who has the spare key? only the three of us + Okafor
[22:48] Jamie: ...and Gus. Gus has had a key since before any of us were born`;

    // What a good AI reply looks like (one tag per line, no JSON)
    const reply = `[STATUS: lore]
[LORE]
[WORLD: The Ember Hearth | In a city that never sleeps, the last night bakery keeps an ancient fire burning, and someone wants it out.]
[FACTION: The Night Oven Guild | apprentice bakers who work while the city sleeps | keep the great oven lit ; protect the old recipes | their fire keeps going out and they blame the Tithe House ; they suspect the Gilded Café of spying]
[FACTION: The Tithe House | landlords who own every hearth on the street | raise the hearth tax ; buy the bakery cheap | they are secretly broke and need the Guild to fail fast ; their collector holds a spare key]
[FACTION: The Gilded Café | a shiny newcomer across the square | steal the Guild's recipe ; win the morning crowd | their bread never rises without stolen starter ; they owe the Tithe House a favour]
[PLACE: The Great Oven | a brick oven older than the city walls | warm, humming, and sometimes it seems to breathe]
[PLACE: Lantern Square | the market square between the bakery and the café | busy at dawn, empty and echoing at 3am]
[PLACE: The Key Cellar | where the bakery's oldest keys hang | dusty, cold, one hook always empty]
[TWIST: The missing starter is not stolen: it is a sleeping fire spirit that left its jar to hide from whoever keeps putting out the oven.]
[TWIST: The old night watcher who has held a key forever is the spirit's original keeper, and has been feeding it in secret for decades.]
[HOOK: You wake up on a flour sack as the great oven goes cold, and the starter jar beside you is empty with the lid still on. | Check the oven ; Look inside the empty jar ; Run to Lantern Square]
[HOOK: A soot-stained note slides under the bakery door at 3am: "The fire remembers who put it out." | Read the note again ; Open the door ; Wake the old night watcher]
[/LORE]`;

    window.CAY_LORE_SAMPLE = { chat, reply };
})();
