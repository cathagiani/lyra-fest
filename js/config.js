/* =====================================================
   CONFIG.JS — ACÁ EDITÁS TODO EL CONTENIDO
   No hace falta tocar nada más para actualizar la fiesta.
   ===================================================== */
const CONFIG = {
  // Etiqueta chiquita arriba del título
  tagline: "✦ la fiesta ✦",

  // Frase debajo de Lyra
  sub: "Mientras más cringe des, MEJOR!",

  // Fecha y hora de la fiesta (formato ISO, con -03:00 = hora Argentina).
  // Dejalo vacío ("") para mostrar “Fecha próximamente”.
  date: "",   // ejemplo: "2026-12-12T22:00:00-03:00"

  // Links de los botones. Si queda vacío, el botón aparece apagado con “(pronto)”.
  links: {
    entradas: "",   // link de venta de entradas
    whatsapp: "https://chat.whatsapp.com/JJEiKeKRFpBFI2FSNb4pSB?s=sh&p=i&iam=2",   // link del grupo (ej: https://chat.whatsapp.com/XXXX)
    instagram: "https://www.instagram.com/lyra.fest/"
  },

  // Tarjetas de la sección Info (ic = emoji, t = título, p = texto)
  info: [
    { ic: "📅", t: "Fecha",      p: "Próximamente" },
    { ic: "🕙", t: "Horario",    p: "23:59-06:00" },
    { ic: "📍", t: "Lugar",      p: "VOX BA, Hipolito Yrigoyen 968, Buenos Aires, Argentina 1086" },
    { ic: "🎟️", t: "Entradas",   p: "Próximamente" },
    { ic: "🔞", t: "Edad",       p: "+18" },
    { ic: "👗", t: "Dress code", p: "MIENTRAS MAS CRINGE, MEJOR" }
  ],

  // Preguntas frecuentes (q = pregunta, a = respuesta)
  faq: [
    { q: "¿Dónde compro las entradas?",       a: "Tocá el botón “Entradas” de esta página." },
    { q: "¿Cómo me entero de las novedades?", a: "Sumate al grupo de WhatsApp y seguinos en Instagram." },
    { q: "¿Puedo ir con amigxs?",             a: "¡Obvio! Cuantxs más, mejor." }
  ],

  // Poses que rotan en la portada (nombres de archivo en /images, sin .webp)
  heroPoses: ["glow", "jump", "wave", "bottle", "cross"],

  // Frases del globo de diálogo de Lyra
  heroSays: ["¡hola, hola!", "¿ya abrieron?", "glowsticks arriba!", "guardame un lugar",
             "nos vemos en la pista", "vamo’ a bailar!", "traje mi botella"],

  // Galería: [archivo, epígrafe]
  gallery: [
    ["cross",  "lista para entrar"],
    ["jump",   "¡¡abrieron las puertas!!"],
    ["sit",    "esperando en la fila"],
    ["glow",   "glowsticks al aire"],
    ["vodka",  "ronda de brindis"],
    ["fernet", "fernecito, obvio"],
    ["bottle", "edición Lyra ♡"],
    ["wave",   "¡hola, hola!"],
    ["hmm",    "“ya cerramos”…"],
    ["dead",   "lunes post-fiesta"]
  ]
};
