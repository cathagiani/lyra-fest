/* =====================================================
   CONFIG.JS — Contenido de la página
   Este archivo lo genera el editor local (Abrir-editor).
   También se puede editar a mano si hace falta.
   ===================================================== */
const CONFIG = {

  // Etiqueta chiquita arriba del título
  tagline: "✦ La Fiesta del Internet que te PROMETIERON ✦",

  // Frase debajo de Lyra
  sub: "Mientras más cringe des, MEJOR! (˶˃𐃷˂˶)",

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
    {"ic":"📅","t":"Fecha","p":"Próximamente!"},
    {"ic":"🕙","t":"Horario","p":"23:59-06:00"},
    {"ic":"📍","t":"Lugar","p":"VOX BA (SUBSUELO) - Hipolito Yrigoyen 968 CABA"},
    {"ic":"🎟️","t":"Entradas","p":"Próximamente!"},
    {"ic":"🔞","t":"Edad","p":"Solo para mayores de 18 Años."},
    {"ic":"👗","t":"Dress-Code","p":"MIENTRAS MAS CRINGE, MEJOR"}
  ],

  // Preguntas frecuentes (q = pregunta, a = respuesta)
  faq: [
    {"q":"¿Dónde compro las entradas?","a":"Tocá el botón “Entradas” de esta página."},
    {"q":"¿Qué metodos de pago aceptan?","a":"Aceptamos Débito, Crédito, Mercado Pago y prácticamente cualquier billetera virtual."},
    {"q":"¿Puedo ir con amigxs?","a":"¡Obvio! Cuantxs más, mejor."},
    {"q":"¿Cómo me entero de las novedades?","a":"Sumate al grupo de WhatsApp y seguinos en Instagram."},
    {"q":"¿A qué hora suelen abrir las puertas?","a":"Las puertas abren a las 12:30AM :D"},
    {"q":"¿Se permiten menores de edad?","a":"No. +18 Sin Excepción."},
    {"q":"¿Cómo me puedo contactar con la organización?","a":"Podes enviarnos un correo eléctronico mediante: contactolyrafest@gmail.com"}
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
    "¡HOLAAA! ⸜(｡˃ ᵕ ˂ )⸝♡ ",
    "¡No olvides invitar a tus amigxs!",
    "El internet NUNCA muere ʕ•ᴥ•ʔ <3",
    "Necesito más vodka...",
    "⸜(｡˃ ᵕ ˂ )⸝♡",
    "NYAN NYAN NYAN NYAN",
    "¿Estás buscando un Easter Egg? ( ͡° ͜ʖ ͡°)",
    "˚♬゚。I know this pretty rave girl... ♫⋆｡",
    "¡¡¡LYRA 4 EVER!!!",
    "RAWR x3",
    "Quiero un emo boy... u_u"
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
