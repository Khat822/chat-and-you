// Français (gender-neutral phrasing: no adjectives about the user)
CAY_I18N.register('fr', {
    label: 'Français',
    languageName: 'French',
    ui: {
        chooseCompanion: 'Choisis qui t’accompagne',
        cat: 'Chat Cat',
        catDesc: 'Du calme, des réponses courtes, une pointe d’ironie',
        dog: 'Chien Dog',
        dogDesc: 'De la chaleur, de l’enthousiasme, plein d’encouragements',
        demoMode: 'MODE DÉMO',
        reset: 'Tout effacer et recommencer',
        settings: 'Changer d’animal',
        language: 'Langue',
        returnCanteen: 'Retour à la cantine',
        optionD: 'Option D : je l’écris moi-même',
        placeholder: 'Écris ta propre réponse... (Entrée pour envoyer, Maj+Entrée pour aller à la ligne)',
        send: 'Envoyer',
        offTheClock: 'Fin de service : parlons dragons et magie',
        special: '🎲 Plat du jour',
        specialHint: 'Pas besoin de réfléchir : le chef choisit une question surprise',
        spiceLight: '🧂 Doux',
        spiceNormal: '🌶️ Normal',
        spiceHint: 'Humour de l’animal : doux = calme, normal = joueur (AI Studio uniquement)',
        catnip: "🌿 Mode herbe à chat",
        ball: "🎾 Mode balle",
        euphoriaHint: "L’animal devient tout fou, le bon de commande reste sérieux",
        care: "Ça a l’air très lourd. Tu n’as pas à porter ça sans aide : parles-en à une personne de confiance et, en cas de danger immédiat, contacte les urgences ou une ligne d’écoute locale. Je suis toujours là si tu veux parler d’autre chose.",
        export: "📥 Télécharger la discussion",
        exportHint: "Enregistre toute la conversation avec des notes, pour demander un second avis à une autre IA",
        themeHint: "Décor de jour / de nuit",
        pickHint: "Plusieurs choix possibles : touche ＋ sur chacun, puis Envoyer",
        huh: "🤔 Hein ?",
        huhHint: "Pas compris ? Demande une explication plus simple",
        huhAsk: "Attends, je n'ai pas compris. Tu peux le dire plus simplement ?",
        serve: "🎫 Ça suffit, sers-le",
        serveHint: "Passer les questions restantes et obtenir ton ticket maintenant",
        serveAsk: "Ça suffit. Sers mon ticket maintenant avec ce que tu as, et note ce qui est incertain comme hypothèse.",
        blocked: "Le filtre de sécurité d'AI Studio a bloqué cette réponse. Il est parfois trop sensible : essaie de le dire autrement.",
        ticketTitle: '🎫 Bon de commande Kiro',
        summary: 'Résumé de la tâche',
        input: 'Format d’entrée',
        output: 'Format de sortie',
        constraints: 'Contraintes',
        antipatterns: 'À éviter',
        done: "✅ Terminé quand",
        copy: '📋 Copier le bon',
        copied: '✓ Copié !',
        startOver: 'Recommencer',
        close: 'Fermer (Échap)',
        showTicket: '🎫 Revoir mon bon',
        newOrder: 'Nouvelle commande',
        demoCantRewrite: 'La démo ne peut pas réécrire les bons, mais la version AI Studio, si !',
        confirmReset: 'Tout effacer et recommencer ?',
        showAIStudio: '🛠 Afficher AI Studio',
        backToApp: '💬 Retour à CHAT. AND YOU.',
        failNoBox: 'Impossible de trouver la zone de saisie d’AI Studio. Es-tu sur une page de chat, avec ta session ouverte ?',
        failNotSent: 'Mon message n’est jamais arrivé dans le chat d’AI Studio (Run ne s’est pas déclenché).',
        failNoReply: 'AI Studio a reçu le message mais n’a pas encore répondu.',
        failFormat: 'AI Studio a répondu, mais pas dans un format que je sais lire.',
        failHint: 'Touche « Afficher AI Studio » (en bas à droite) pour vérifier, puis touche A pour renvoyer.'
    },
    cat: {
        oops: 'Hum.',
        thinking: '...je réfléchis. Une seconde.',
        sounds: ["miaou~","rrrr...","mrrou~"],
        offMenu: ["Mrrp. Cette question est trop difficile. On en prend une autre ?","Ce plat n’est pas au menu. Choisis autre chose.","*se cache sous le comptoir* Trop épicé pour moi. Une autre question ?"],
        afterTicket: 'Le bon est sur le comptoir. Le revoir, recommencer, ou changer quelque chose ? Écris-le en dessous.',
        huh: "En bref : choisis celle qui s'en rapproche le plus. Pas de mauvaise réponse, et tu pourras changer après.",
        canteen: {
            message: 'Salut. Tu veux transformer une idée floue en vrai prompt ? Commençons simple : quel problème veux-tu résoudre ?',
            options: ['Je dois analyser des données', 'Je veux écrire ou corriger un texte', 'J’ai besoin d’aide pour coder']
        },
        campfireDay: {
            message: "Tu en as mis, du temps. Près d'un feu de camp qui fume encore, la forêt baigne dans le soleil de l'après-midi. Que fais-tu ?",
            options: ["Observer les alentours avec prudence","Suivre le bruit de l'eau","Vérifier mes affaires"]
        },
        campfire: {
            message: 'Il était temps. Un feu de camp crépite à côté de toi, dans une forêt inconnue. Que fais-tu ?',
            options: ['Observer les alentours avec prudence', 'Appeler à l’aide', 'Vérifier mes affaires']
        }
    },
    dog: {
        oops: 'Oh non !',
        thinking: 'Ouaf, laisse-moi réfléchir !',
        sounds: ["ouaf !","ouaf ouaf !","*halète*"],
        offMenu: ["Oh, celle-là est trop difficile pour moi ! On essaie une autre ?","Hmm, ce n’est pas au menu du jour ! On choisit autre chose ?","*penche la tête* Je ne connais pas ce tour ! Une autre question ?"],
        afterTicket: 'Ton bon est bien gardé ! Le revoir, en faire un nouveau, ou changer quelque chose ? Écris-le en dessous !',
        huh: "Pas de souci ! Choisis celle qui te parle le plus. Il n'y a pas de mauvaise réponse, et on pourra toujours changer !",
        canteen: {
            message: 'Coucou ! Quelle joie de te rencontrer ! Créons ensemble le prompt parfait ! Pour commencer : quel genre de tâche aujourd’hui ?',
            options: ['Analyse ou traitement de données', 'Écriture ou création de contenu', 'Programmation ou débogage']
        },
        campfireDay: {
            message: "Le soleil brille, les oiseaux chantent, et l'aventure t'attend ! Te voilà à l'orée d'une forêt mystérieuse, le feu de camp fume encore. Que fais-tu en premier ?",
            options: ["Explorer le sentier","Grimper à un arbre pour regarder","Chercher d'autres voyageurs"]
        },
        campfire: {
            message: 'Le feu est chaud, les étoiles brillent et l’aventure t’attend ! Te voilà à l’orée d’une forêt mystérieuse. Quelle est ta première action ?',
            options: ['Explorer le sentier de la forêt', 'Camper ici pour la nuit', 'Chercher d’autres voyageurs']
        }
    },
    specials: {
        cat: 'Plat du jour, au choix du chef :',
        dog: 'Oh, le plat du jour !',
        list: [
            { q: 'Qu’est-ce que tu copies-colles beaucoup trop souvent ?',
              options: ['Les mêmes réponses par e-mail', 'Des chiffres dans un tableur', 'Le même bout de code'] },
            { q: 'Si ta liste de tâches était une soupe, quel serait l’ingrédient le plus bizarre ?',
              options: ['Un tableur que personne ne comprend', 'Un bug qui n’apparaît que le vendredi', 'Cinquante e-mails non lus'] },
            { q: 'Quelle tâche te fait soupirer le plus fort ?',
              options: ['Corriger encore la même erreur', 'Rédiger des rapports', 'Nettoyer des données en désordre'] },
            { q: 'Une oie vient de voler ton ordinateur portable. Quel fichier la supplies-tu de rendre ?',
              options: ['Le tableur du budget', 'Mon texte à moitié écrit', 'Le code de mon projet perso'] },
            { q: 'Tu as une aide infatigable pendant une semaine. Que lui confies-tu en premier ?',
              options: ['Rédiger des posts et des e-mails', 'Écrire des tests pour mon code', 'Transformer des tickets de caisse en tableau propre'] },
            { q: 'Ton clavier vient d’avoir des sentiments. Qu’est-ce qu’il en a marre de taper ?',
              options: ['Le même e-mail d’excuses', 'Des console.log partout', 'Des chiffres à n’en plus finir'] }
        ]
    }
});
