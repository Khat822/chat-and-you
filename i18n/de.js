// Deutsch (gender-neutral phrasing: no adjectives about the user)
CAY_I18N.register('de', {
    label: 'Deutsch',
    languageName: 'German',
    ui: {
        chooseCompanion: 'Wähle deine Begleitung',
        cat: 'Katze Cat',
        catDesc: 'Entspannt, knapp, leicht sarkastisch',
        dog: 'Hund Dog',
        dogDesc: 'Herzlich, begeistert, ermutigend',
        demoMode: 'DEMO-MODUS',
        reset: 'Zurücksetzen und neu starten',
        settings: 'Begleitung wechseln',
        language: 'Sprache',
        returnCanteen: 'Zurück in die Kantine',
        optionD: 'Option D: Selbst schreiben',
        placeholder: 'Eigene Antwort eingeben... (Enter sendet, Umschalt+Enter für neue Zeile)',
        send: 'Senden',
        offTheClock: 'Feierabend: Reden wir über Drachen und Magie',
        special: '🎲 Tagesgericht',
        specialHint: 'Nicht nachdenken: Die Küche wählt eine Überraschungsfrage',
        spiceLight: '🧂 Mild',
        spiceNormal: '🌶️ Normal',
        spiceHint: 'Humor der Begleitung: mild = ruhig, normal = verspielt (nur AI Studio)',
        catnip: "🌿 Katzenminze-Modus",
        ball: "🎾 Ball-Modus",
        euphoriaHint: "Die Begleitung dreht durch, der Bestellzettel bleibt nüchtern",
        care: "Das klingt sehr schwer. Du musst das nicht allein tragen: Sprich mit einem Menschen, dem du vertraust, und wende dich bei akuter Gefahr an den Notruf oder eine örtliche Krisenhotline. Ich bin weiter da, wenn du über etwas anderes reden willst.",
        export: "📥 Chat herunterladen",
        exportHint: "Speichert das ganze Gespräch mit Erklärungen, um eine andere KI um eine zweite Meinung zu bitten",
        themeHint: "Bilder: Tag / Nacht",
        pickHint: "Mehrfachauswahl: bei jeder Option ＋ tippen, dann Senden",
        huh: "🤔 Hä, wie bitte?",
        huhHint: "Nicht verstanden? Bitte um eine einfachere Erklärung",
        huhAsk: "Moment, das hab ich nicht verstanden. Kannst du es einfacher sagen?",
        serve: "🎫 Reicht, servier es",
        serveHint: "Restliche Fragen überspringen und das Ticket jetzt bekommen",
        serveAsk: "Das reicht. Bitte servier mein Ticket jetzt mit dem, was du hast, und markiere Unsicheres als Annahme.",
        blocked: "Der Sicherheitsfilter von AI Studio hat diese Antwort blockiert. Er ist manchmal überempfindlich, also sag es einfach anders.",
        ticketTitle: '🎫 Kiro-Bestellzettel',
        summary: 'Aufgabe in Kürze',
        input: 'Eingabeformat',
        output: 'Ausgabeformat',
        constraints: 'Vorgaben',
        antipatterns: 'Vermeiden',
        done: "✅ Fertig, wenn",
        copy: '📋 Zettel kopieren',
        copied: '✓ Kopiert!',
        startOver: 'Neu anfangen',
        close: 'Schließen (Esc)',
        showTicket: '🎫 Zettel nochmal zeigen',
        newOrder: 'Neue Bestellung',
        demoCantRewrite: 'Die Demo kann Zettel nicht umschreiben, die AI-Studio-Version schon!',
        confirmReset: 'Alles zurücksetzen und neu starten?',
        showAIStudio: '🛠 AI Studio anzeigen',
        backToApp: '💬 Zurück zu CHAT. AND YOU.',
        failNoBox: 'Ich finde das Eingabefeld von AI Studio nicht. Bist du auf einer Chat-Seite und angemeldet?',
        failNotSent: 'Meine Nachricht ist nie im AI-Studio-Chat angekommen (Run wurde nicht ausgelöst).',
        failNoReply: 'AI Studio hat die Nachricht bekommen, aber noch nicht geantwortet.',
        failFormat: 'AI Studio hat geantwortet, aber nicht in einem Format, das ich lesen kann.',
        failHint: 'Tippe unten rechts auf „AI Studio anzeigen“ zum Prüfen und dann auf A zum erneuten Senden.'
    },
    cat: {
        oops: 'Hm.',
        thinking: '...denke nach. Moment.',
        sounds: ["miau~","schnurr...","mrrp~"],
        offMenu: ["Mrrp. Die Frage ist zu schwer. Nehmen wir eine andere?","Das steht nicht auf der Karte. Bestell was anderes.","*versteckt sich unter der Theke* Zu scharf für mich. Andere Frage?"],
        afterTicket: 'Der Zettel liegt auf der Theke. Nochmal ansehen, neu anfangen oder etwas ändern? Schreib es unten rein.',
        huh: "Kurz gesagt: Nimm, was am ehesten passt. Es gibt keine falsche Antwort, und du kannst es später ändern.",
        canteen: {
            message: 'Hey. Du willst aus einer vagen Idee einen echten Prompt machen? Fangen wir einfach an: Welches Problem willst du lösen?',
            options: ['Ich muss Daten analysieren', 'Ich will Texte schreiben oder überarbeiten', 'Ich brauche Hilfe beim Programmieren']
        },
        campfireDay: {
            message: "Hat ja gedauert. Neben einem glimmenden Lagerfeuer bist du eingedöst, und der Wald leuchtet in der Nachmittagssonne. Was tust du?",
            options: ["Vorsichtig umsehen","Dem Rauschen des Wassers folgen","Meine Sachen prüfen"]
        },
        campfire: {
            message: 'Hat ja gedauert. Neben dir knistert ein Lagerfeuer, mitten in einem fremden Wald. Was tust du?',
            options: ['Vorsichtig umsehen', 'Laut um Hilfe rufen', 'Meine Sachen prüfen']
        }
    },
    dog: {
        oops: 'Oh nein!',
        thinking: 'Wuff, lass mich nachdenken!',
        sounds: ["wuff!","wuff wuff!","*hechel*"],
        offMenu: ["Oh, die ist zu schwer für mich! Probieren wir eine andere?","Hmm, das gibt's heute nicht auf der Karte! Was anderes?","*legt den Kopf schief* Den Trick kenne ich nicht! Andere Frage?"],
        afterTicket: 'Dein Zettel ist bei mir sicher! Nochmal ansehen, einen neuen machen oder etwas ändern? Schreib es unten rein!',
        huh: "Kein Problem! Nimm einfach, was am besten passt. Es gibt keine falsche Antwort, und wir können es jederzeit ändern!",
        canteen: {
            message: 'Hallo! Wie schön, dich kennenzulernen! Lass uns zusammen den perfekten Prompt bauen! Zuerst: Um welche Art Aufgabe geht es heute?',
            options: ['Datenanalyse oder -verarbeitung', 'Schreiben oder Content-Erstellung', 'Programmieren oder Debuggen']
        },
        campfireDay: {
            message: "Die Sonne scheint, die Vögel singen, und das Abenteuer wartet! Du stehst am Rand eines geheimnisvollen Waldes, das Lagerfeuer raucht noch. Was machst du zuerst?",
            options: ["Den Waldpfad erkunden","Auf einen Baum klettern und schauen","Nach anderen Reisenden suchen"]
        },
        campfire: {
            message: 'Das Feuer ist warm, die Sterne leuchten und das Abenteuer wartet! Du stehst am Rand eines geheimnisvollen Waldes. Was ist dein erster Schritt?',
            options: ['Den Waldpfad erkunden', 'Hier für die Nacht lagern', 'Nach anderen Reisenden suchen']
        }
    },
    specials: {
        cat: 'Tagesgericht, nach Wahl der Küche:',
        dog: 'Oh, das Tagesgericht!',
        list: [
            { q: 'Was kopierst und fügst du viel zu oft ein?',
              options: ['Dieselben E-Mail-Antworten', 'Zahlen in eine Tabelle', 'Denselben Code-Schnipsel'] },
            { q: 'Wäre deine To-do-Liste eine Suppe: Was wäre die seltsamste Zutat darin?',
              options: ['Eine Tabelle, die niemand versteht', 'Ein Bug, der nur freitags auftaucht', 'Fünfzig ungelesene E-Mails'] },
            { q: 'Bei welcher Aufgabe seufzt du am lautesten?',
              options: ['Schon wieder denselben Fehler beheben', 'Berichte schreiben', 'Chaotische Daten aufräumen'] },
            { q: 'Eine Gans hat gerade deinen Laptop geklaut. Welche Datei soll sie unbedingt zurückbringen?',
              options: ['Die Budget-Tabelle', 'Mein halb fertiger Text', 'Der Code meines Nebenprojekts'] },
            { q: 'Du bekommst eine Woche lang eine unermüdliche Hilfe. Was gibst du zuerst ab?',
              options: ['Posts und E-Mails entwerfen', 'Tests für meinen Code schreiben', 'Belege in eine saubere Tabelle bringen'] },
            { q: 'Deine Tastatur hat plötzlich Gefühle. Was ist sie am meisten leid zu tippen?',
              options: ['Dieselbe Entschuldigungs-Mail', 'Überall console.log', 'Endlose Zahlen in Zellen'] }
        ]
    }
});
