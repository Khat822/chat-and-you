// Español (gender-neutral phrasing: no adjectives about the user)
CAY_I18N.register('es', {
    label: 'Español',
    languageName: 'Spanish',
    ui: {
        chooseCompanion: 'Elige a tu compañía',
        cat: 'Gato Cat',
        catDesc: 'Calma, respuestas cortas y un toque de sarcasmo',
        dog: 'Perro Dog',
        dogDesc: 'Calidez, entusiasmo y muchos ánimos',
        demoMode: 'MODO DEMO',
        reset: 'Reiniciar y empezar de cero',
        settings: 'Cambiar de compañía',
        language: 'Idioma',
        returnCanteen: 'Volver a la cantina',
        optionD: 'Opción D: Lo escribo yo',
        placeholder: 'Escribe tu propia respuesta... (Enter envía, Shift+Enter nueva línea)',
        send: 'Enviar',
        offTheClock: 'Fuera de turno: hablemos de dragones y magia',
        special: '🎲 Plato del día',
        specialHint: 'Sin pensar: el chef elige una pregunta sorpresa',
        spiceLight: '🧂 Suave',
        spiceNormal: '🌶️ Normal',
        spiceHint: 'Humor de tu compañía: suave = calma, normal = con chispa (solo AI Studio)',
        catnip: "🌿 Modo hierba gatera",
        ball: "🎾 Modo pelota",
        euphoriaHint: "Tu compañía se vuelve loquita; la comanda sigue sobria",
        care: "Eso suena muy pesado. No tienes que cargarlo en soledad: habla con alguien de confianza y, si estás en peligro ahora, contacta con un servicio de emergencias o una línea de ayuda local. Sigo aquí si quieres hablar de otra cosa.",
        export: "📥 Descargar chat",
        exportHint: "Guarda toda la conversación con notas para pedir una segunda opinión a otra IA",
        themeHint: "Ilustraciones de día / de noche",
        pickHint: "Puedes elegir varias: toca ＋ en cada una y luego Enviar",
        huh: "🤔 ¿Cómo?",
        huhHint: "¿No lo entendiste? Pide una explicación más sencilla",
        huhAsk: "Espera, no lo entendí. ¿Me lo dices más sencillo?",
        serve: "🎫 Ya está, sírvelo",
        serveHint: "Salta las preguntas que faltan y recibe tu ticket ya",
        serveAsk: "Ya está. Sirve mi ticket ahora con lo que tienes y marca lo que no esté claro como suposición.",
        blocked: "El filtro de seguridad de AI Studio bloqueó esa respuesta. A veces es demasiado sensible: prueba a decirlo de otra forma.",
        ticketTitle: '🎫 Comanda Kiro',
        summary: 'Resumen de la tarea',
        input: 'Formato de entrada',
        output: 'Formato de salida',
        constraints: 'Restricciones',
        antipatterns: 'Qué evitar',
        done: "✅ Listo cuando",
        copy: '📋 Copiar comanda',
        copied: '✓ ¡Copiado!',
        startOver: 'Empezar de nuevo',
        close: 'Cerrar (Esc)',
        showTicket: '🎫 Ver mi comanda otra vez',
        newOrder: 'Hacer un pedido nuevo',
        demoCantRewrite: 'La demo no puede reescribir comandas, ¡pero la versión de AI Studio sí!',
        confirmReset: '¿Borrar todo y empezar de cero?',
        showAIStudio: '🛠 Mostrar AI Studio',
        backToApp: '💬 Volver a CHAT. AND YOU.',
        failNoBox: 'No encuentro el cuadro de texto de AI Studio. ¿Estás en una página de chat y con la sesión iniciada?',
        failNotSent: 'Mi mensaje no llegó al chat de AI Studio (Run no se activó).',
        failNoReply: 'AI Studio recibió el mensaje, pero aún no responde.',
        failFormat: 'AI Studio respondió, pero no en un formato que pueda leer.',
        failHint: 'Toca "Mostrar AI Studio" (abajo a la derecha) para revisar y luego toca A para reenviar.'
    },
    cat: {
        oops: 'Mmm.',
        thinking: '...pensando. Un segundo.',
        sounds: ["miau~","rrrr...","miiau~"],
        offMenu: ["Mrrp. Esa pregunta es demasiado difícil. ¿Probamos otra?","Eso no está en el menú. Pide otra cosa.","*se esconde bajo la barra* Demasiado picante. ¿Otra pregunta?"],
        afterTicket: 'La comanda está en el mostrador. ¿Verla otra vez, empezar de nuevo o cambiar algo? Escríbelo abajo.',
        huh: "Versión corta: elige la que más se parezca. No hay respuestas incorrectas y puedes cambiarla luego.",
        canteen: {
            message: 'Hola. ¿Quieres convertir una idea difusa en un prompt de verdad? Empecemos por lo simple: ¿qué problema quieres resolver?',
            options: ['Necesito analizar unos datos', 'Quiero escribir o editar un texto', 'Necesito ayuda con código']
        },
        campfireDay: {
            message: "Cuánto sueño. Despiertas junto a una fogata humeante y el bosque brilla con el sol de la tarde. ¿Qué haces?",
            options: ["Mirar alrededor con cuidado","Seguir el sonido del agua","Revisar mis cosas"]
        },
        campfire: {
            message: 'Cuánto dormiste. Hay una fogata a tu lado, en un bosque que no reconoces. ¿Qué haces?',
            options: ['Mirar alrededor con cuidado', 'Pedir ayuda a gritos', 'Revisar mis cosas']
        }
    },
    dog: {
        oops: '¡Ay, no!',
        thinking: '¡Guau, déjame pensar!',
        sounds: ["¡guau!","¡guau guau!","*jadeo*"],
        offMenu: ["¡Uy, esa es demasiado difícil para mí! ¿Probamos otra?","Mmm, ¡eso no está en el menú de hoy! ¿Elegimos otra cosa?","*ladea la cabeza* ¡No conozco ese truco! ¿Otra pregunta?"],
        afterTicket: '¡Tu comanda está a salvo conmigo! ¿Verla otra vez, hacer una nueva o cambiar algo? ¡Escríbelo abajo!',
        huh: "¡Tranqui! Elige la que más se acerque. No hay respuestas incorrectas, ¡y siempre podemos cambiarla!",
        canteen: {
            message: '¡Hola! ¡Qué alegría conocerte! ¡Hagamos juntos el prompt perfecto! Para empezar: ¿qué tipo de tarea tenemos hoy?',
            options: ['Análisis o procesamiento de datos', 'Escritura o creación de contenido', 'Programación o depuración']
        },
        campfireDay: {
            message: "¡Sale el sol, cantan los pájaros y la aventura te espera! Estás al borde de un bosque misterioso, con la fogata aún humeando. ¿Cuál es tu primer paso?",
            options: ["Explorar el sendero del bosque","Subir a un árbol para mirar","Buscar a otros viajeros"]
        },
        campfire: {
            message: '¡La fogata calienta, las estrellas brillan y la aventura espera! Estás al borde de un bosque misterioso. ¿Cuál es tu primer paso?',
            options: ['Explorar el sendero del bosque', 'Acampar aquí esta noche', 'Buscar a otros viajeros']
        }
    },
    specials: {
        cat: 'Plato del día, a elección del chef:',
        dog: '¡Uy, el plato del día!',
        list: [
            { q: '¿Qué copias y pegas demasiado a menudo?',
              options: ['Las mismas respuestas de correo', 'Números a una hoja de cálculo', 'El mismo trozo de código'] },
            { q: 'Si tu lista de pendientes fuera una sopa, ¿cuál sería el ingrediente más raro?',
              options: ['Una hoja de cálculo que nadie entiende', 'Un bug que solo aparece los viernes', 'Cincuenta correos sin leer'] },
            { q: '¿Qué tarea te hace suspirar más fuerte?',
              options: ['Arreglar otra vez el mismo error', 'Escribir informes', 'Limpiar datos desordenados'] },
            { q: 'Un ganso acaba de robarte el portátil. ¿Qué archivo le suplicas que devuelva?',
              options: ['La hoja del presupuesto', 'Mi texto a medio escribir', 'El código de mi proyecto personal'] },
            { q: 'Tienes una ayuda incansable durante una semana. ¿Qué le encargas primero?',
              options: ['Redactar publicaciones y correos', 'Escribir tests para mi código', 'Pasar tickets de compra a una tabla ordenada'] },
            { q: 'Tu teclado acaba de tener sentimientos. ¿Qué está harto de escribir?',
              options: ['El mismo correo de disculpa', 'console.log por todas partes', 'Números sin fin en celdas'] }
        ]
    }
});
