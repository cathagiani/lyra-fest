/* =====================================================
   CONFIG.JS — Contenido de la página
   Este archivo lo genera el editor local (Abrir-editor).
   También se puede editar a mano si hace falta.
   ===================================================== */
const CONFIG = {

  // Etiqueta chiquita arriba del título
  tagline: "✦ la MEJOR fiesta ✦",

  // Frase debajo de Lyra
  sub: "Mientras más cringe des, MEJOR!",

  // Fecha y hora (formato ISO, -03:00 = Argentina). Vacío = “Fecha próximamente”
  date: "",

  // Links de los botones (vacío = botón apagado con “(pronto)”)
  links: {
    entradas: "",
    whatsapp: "https://chat.whatsapp.com/JJEiKeKRFpBFI2FSNb4pSB?s=sh&p=i&iam=2",
    instagram: "https://www.instagram.com/lyra.fest/"
  },

  // Tarjetas de la sección Info (ic = emoji, t = título, p = texto)
  info: [
    {"ic":"📅","t":"Fecha","p":"Próximamente"},
    {"ic":"🕙","t":"Horario","p":"23:59-06:00"},
    {"ic":"📍","t":"Lugar","p":"VOX BA, Hipolito Yrigoyen 968, Buenos Aires, Argentina 1086"},
    {"ic":"🎟️","t":"Entradas","p":"Próximamente"},
    {"ic":"🔞","t":"Edad","p":"+18"},
    {"ic":"👗","t":"Dress code","p":"MIENTRAS MAS CRINGE, MEJOR"}
  ],

  // Preguntas frecuentes (q = pregunta, a = respuesta)
  faq: [
    {"q":"¿Dónde compro las entradas?","a":"Tocá el botón “Entradas” de esta página."},
    {"q":"¿Cómo me entero de las novedades?","a":"Sumate al grupo de WhatsApp y seguinos en Instagram."},
    {"q":"¿Puedo ir con amigxs?","a":"¡Obvio! Cuantxs más, mejor."}
  ],

  // Poses que rotan en la portada (archivos de /images, sin .webp)
  heroPoses: [
    "glow",
    "jump",
    "wave",
    "bottle",
    "cross"
  ],

  // Frases del globo de diálogo de Lyra
  heroSays: [
    "¡hola, hola!",
    "¿ya abrieron?",
    "glowsticks arriba!",
    "guardame un lugar",
    "nos vemos en la pista",
    "vamo’ a bailar!",
    "traje mi botella"
  ],

  // Galería: [archivo, epígrafe]
  gallery: [
    ["cross","lista para entrar"],
    ["jump","¡¡abrieron las puertas!!"],
    ["sit","esperando en la fila"],
    ["glow","glowsticks al aire"],
    ["vodka","ronda de brindis"],
    ["fernet","fernecito, obvio"],
    ["bottle","edición Lyra ♡"],
    ["wave","¡hola, hola!"],
    ["hmm","“ya cerramos”…"],
    ["dead","lunes post-fiesta"]
  ],

  // Artistas / DJs
  lineup: [],

  // Tarjetas de la sección La barra
  barra: [],

  // Partes de la página ocultas (lo maneja el editor; borrá un nombre de la lista para volver a mostrarla)
  hidden: []
};
