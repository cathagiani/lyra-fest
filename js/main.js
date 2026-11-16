/* =====================================================
   MAIN.JS — Lógica de la página (usa los datos de CONFIG)
   ===================================================== */

// Atajo para buscar elementos por id
const $ = id => document.getElementById(id);
// Ruta de una imagen de Lyra a partir de su nombre
const img = name => `images/${name}.webp`;
// Partes ocultas desde el editor (lista de claves en CONFIG.hidden)
const hidden = new Set(CONFIG.hidden || []);

/* ---------- Textos simples ---------- */
$("tagline").textContent = CONFIG.tagline;
$("sub").textContent = CONFIG.sub;
$("igFoot").href = CONFIG.links.instagram;

/* ---------- Cinta que se mueve ---------- */
// Se repite el texto varias veces para que el loop no tenga cortes
$("tick").textContent = "✦ LYRA FEST ✦ GLOWSTICKS ✦ NEÓN ✦ PISTA ✦ ".repeat(8);

/* ---------- Lyra interactiva de la portada ---------- */
let pose = 0;
function showHero() {
  $("hero").src = img(CONFIG.heroPoses[pose % CONFIG.heroPoses.length]);
  // Frase al azar
  $("bubble").textContent = CONFIG.heroSays[Math.floor(Math.random() * CONFIG.heroSays.length)];
}
showHero();
$("stage").onclick = () => { pose++; showHero(); };   // al tocar: siguiente pose
setInterval(() => { pose++; showHero(); }, 5000);     // sola, cada 5 segundos

/* ---------- Botones (entradas / whatsapp / instagram) ---------- */
function makeBtn(label, href, cls) {
  const a = document.createElement("a");
  a.className = "btn " + cls + (href ? "" : " off");  // sin link = botón apagado
  a.textContent = href ? label : label + " (pronto)";
  if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; }
  return a;
}
// [clave para ocultar, texto, link, estilo]
const BUTTONS = [
  ["btnEntradas",  "🎟️ Entradas",         CONFIG.links.entradas,   ""],
  ["btnWhatsapp",  "💬 Grupo de WhatsApp", CONFIG.links.whatsapp,   "alt"],
  ["btnInstagram", "📸 Instagram",         CONFIG.links.instagram,  "alt2"]
];
// Se ponen los mismos botones arriba y abajo (saltea los que ocultaste)
["heroBtns", "bottomBtns"].forEach(id => {
  if (!$(id)) return;
  $(id).append(...BUTTONS.filter(([key]) => !hidden.has(key)).map(([, label, href, cls]) => makeBtn(label, href, cls)));
});

/* ---------- Tarjetas (Info y Barra) ---------- */
function renderCards(list, boxId) {
  if (!$(boxId)) return;   // si la sección no está en el HTML, la saltea (así no se rompe el resto)
  list.forEach(x => {
    const card = document.createElement("div"); card.className = "card";
    const ic = document.createElement("div");   ic.className = "ic"; ic.textContent = x.ic;
    const h  = document.createElement("h3");    h.textContent = x.t;
    const p  = document.createElement("p");     p.textContent = x.p;
    card.append(ic, h, p);
    $(boxId).appendChild(card);
  });
}
renderCards(CONFIG.info, "infoGrid");
renderCards(CONFIG.barra || [], "barGrid");   // si borraste la sección "La barra", no hace nada

/* ---------- Line-up (solo si la sección existe en el HTML) ---------- */
if ($("lineupList")) {
  (CONFIG.lineup || []).forEach(name => {
    const s = document.createElement("span"); s.className = "pill"; s.textContent = name;
    $("lineupList").appendChild(s);
  });
}

/* ---------- Preguntas frecuentes (desplegables) ---------- */
if ($("faqList")) {   // solo si la sección existe
  CONFIG.faq.forEach(f => {
    const d = document.createElement("details");
    const s = document.createElement("summary"); s.textContent = f.q;
    const p = document.createElement("p");       p.textContent = f.a;
    d.append(s, p);
    $("faqList").appendChild(d);
  });
}

/* ---------- Galería de stickers ---------- */
if ($("gal")) {   // solo si la sección existe
  (CONFIG.gallery || []).forEach(([file, caption]) => {
    const fig = document.createElement("figure");
    const im = document.createElement("img"); im.src = img(file); im.alt = caption; im.loading = "lazy";
    const cap = document.createElement("figcaption"); cap.textContent = caption;
    fig.append(im, cap);
    // Al tocar: efecto "pop" por medio segundo
    fig.onclick = () => { fig.classList.add("pop"); setTimeout(() => fig.classList.remove("pop"), 500); };
    $("gal").appendChild(fig);
  });
}

/* ---------- Cuenta regresiva ---------- */
const countEl = $("count");
// Mensaje simple en una sola cajita
function countMsg(text) {
  countEl.innerHTML = `<div style="min-width:0;padding:12px 22px"><b style="font-size:1.1rem">${text}</b></div>`;
}
function tick() {
  if (!CONFIG.date) return countMsg("Fecha próximamente ✦");   // sin fecha cargada
  const diff = new Date(CONFIG.date) - new Date();              // milisegundos que faltan
  if (diff <= 0) return countMsg("¡Es hoy! ✦");                 // ya empezó
  const d = Math.floor(diff / 864e5);
  const h = Math.floor(diff / 36e5) % 24;
  const m = Math.floor(diff / 6e4) % 60;
  const s = Math.floor(diff / 1e3) % 60;
  countEl.innerHTML = [[d, "días"], [h, "horas"], [m, "min"], [s, "seg"]]
    .map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("");
}
tick();
setInterval(tick, 1000);   // se actualiza cada segundo

/* ---------- Partes ocultas desde el editor ---------- */
// clave (la misma que usa el editor) -> qué elemento(s) de la página oculta
// Se esconden con display:none (no se borran) para que el resto del código siga funcionando
const HIDEABLE = {
  ticker: ".ticker",   bubble: "#bubble",   hint: ".hint",    count: "#count",
  info: "#info",       lineup: "#lineup",   barra: "#barra",   gallery: "#lyra",
  faq: "#faq",         join: ".join",       footer: "footer"
};
hidden.forEach(key => {
  if (HIDEABLE[key]) document.querySelectorAll(HIDEABLE[key]).forEach(el => el.style.display = "none");
});