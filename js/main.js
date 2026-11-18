/* =====================================================
   MAIN.JS — Lógica de la página (usa los datos de CONFIG)
   ===================================================== */

// Atajos para buscar elementos
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
// Ruta de una imagen: acepta "glow" (= glow.webp) o el nombre completo "mi-foto.png"
const img = name => "images/" + (/\.[a-z0-9]+$/i.test(name) ? name : name + ".webp");

// Datos que maneja el editor (todos opcionales)
const hidden = new Set(CONFIG.hidden || []);   // partes ocultas
const T = CONFIG.texts || {};                  // textos cambiados
const THEME = CONFIG.theme || {};              // colores, fuentes, modo
const SLOTS = CONFIG.slots || {};              // imágenes cambiadas por sección

/* ---------- Tema: colores, modo, fuentes y CSS propio ---------- */
(function applyTheme() {
  const root = document.documentElement;
  // Colores: pisan las variables de style.css
  ["pink", "green", "cyan", "ink", "bg", "bg2", "card", "text", "muted", "h1"].forEach(k => {
    if (THEME[k]) root.style.setProperty("--" + k, THEME[k]);
  });
  // La cuadrícula de fondo acompaña al color rosa
  if (/^#[0-9a-f]{6}$/i.test(THEME.pink || "")) root.style.setProperty("--grid", THEME.pink + "22");
  // Modo forzado, cuadrícula y animaciones (las reglas están en style.css)
  if (THEME.mode === "dark" || THEME.mode === "light") root.dataset.mode = THEME.mode;
  if (THEME.grid === "off") root.dataset.grid = "off";
  if (THEME.anim === "off") root.dataset.anim = "off";

  // Fuentes de Google (las dos originales ya vienen cargadas en el HTML)
  const clean = n => String(n || "").replace(/["'<>\\;{}]/g, "").trim();
  const fTitle = clean(THEME.fontTitle), fBody = clean(THEME.fontBody);
  [fTitle, fBody].forEach(f => {
    if (f && f !== "Bungee" && f !== "Fredoka") {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(f).replace(/%20/g, "+") + "&display=swap";
      document.head.appendChild(l);
    }
  });
  let css = "";
  if (fTitle) css += `h1,h2,.ticker,.count b{font-family:"${fTitle}",Impact,sans-serif}\n`;
  if (fBody) css += `body,.btn{font-family:"${fBody}",system-ui,sans-serif}\n`;
  if (CONFIG.customCss) css += CONFIG.customCss;   // CSS propio (avanzado)
  if (css) {
    const st = document.createElement("style");
    st.id = "lyra-custom";
    st.textContent = css;
    document.head.appendChild(st);   // va al final del <head>, así gana sobre style.css
  }
})();

/* ---------- Textos simples ---------- */
$("tagline").textContent = CONFIG.tagline;
$("sub").textContent = CONFIG.sub;
$("igFoot").href = CONFIG.links.instagram;

// Pone un texto en un elemento (un salto de línea del editor = <br>)
function setText(el, value) {
  el.textContent = "";
  value.split("\n").forEach((line, i) => {
    if (i) el.append(document.createElement("br"));
    el.append(line);
  });
}
// clave del editor -> elemento de la página
const TEXT_MAP = {
  heroTitle: "h1", hintText: ".hint",
  infoTitle: "#info h2", lineupTitle: "#lineup h2", barraTitle: "#barra h2",
  lyraTitle: "#lyra h2", lyraSub: "#lyra .sub", faqTitle: "#faq h2",
  joinTitle: ".join h2", joinText: ".join .sub"
};
Object.entries(TEXT_MAP).forEach(([key, sel]) => {
  if (T[key]) $$(sel).forEach(el => setText(el, T[key]));
});
// Texto del pie (es un texto suelto dentro de <footer>)
if (T.footerText) {
  const f = document.querySelector("footer");
  const node = f && [...f.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim());
  if (node) node.nodeValue = "\n      " + T.footerText;
}

/* ---------- Imágenes cambiadas por sección ---------- */
// clave del editor -> imagen(es) de la página
const SLOT_MAP = {
  lineup: "#lineup .split img", faq: "#faq .split img", join: ".join img", footer: "footer img",
  barra1: "#barra .bar img:nth-of-type(1)", barra2: "#barra .bar img:nth-of-type(2)", barra3: "#barra .bar img:nth-of-type(3)"
};
Object.entries(SLOT_MAP).forEach(([key, sel]) => {
  const v = SLOTS[key];
  if (!v) return;   // vacío = se queda la original
  $$(sel).forEach(el => { if (v === "none") el.style.display = "none"; else el.src = img(v); });
});

/* ---------- Cinta que se mueve ---------- */
// Se repite el texto (en cantidad PAR) para que el loop no tenga cortes
const tickBase = (T.tickerText || "✦ LYRA FEST ✦ GLOWSTICKS ✦ NEÓN ✦ PISTA ✦").trim() + " ";
let reps = Math.max(2, Math.ceil(300 / tickBase.length));
if (reps % 2) reps++;
$("tick").textContent = tickBase.repeat(reps);

/* ---------- Lyra interactiva de la portada ---------- */
const POSES = (CONFIG.heroPoses || []).filter(Boolean);
const SAYS = CONFIG.heroSays || [];
// Precarga las poses para que no parpadee al cambiar
POSES.forEach(p => { new Image().src = img(p); });

let pose = 0;
let timer;   // temporizador del cambio automático

function showHero() {
  if (POSES.length) $("hero").src = img(POSES[pose % POSES.length]);
  const b = $("bubble");
  if (b) {
    b.textContent = SAYS.length ? SAYS[Math.floor(Math.random() * SAYS.length)] : "";   // frase al azar
    b.style.visibility = SAYS.length ? "" : "hidden";
  }
}

// Pasa a la siguiente pose y reinicia la cuenta de 5 segundos
// (así el cambio automático nunca se pisa con un clic)
function nextHero() {
  pose++;
  showHero();
  clearInterval(timer);
  timer = setInterval(nextHero, 5000);
}

showHero();
timer = setInterval(nextHero, 5000);   // cambio automático cada 5 segundos
$("stage").onclick = nextHero;         // al tocar: siguiente pose

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
  ["btnEntradas",  T.btnEntradas  || "🎟️ Entradas",         CONFIG.links.entradas,  ""],
  ["btnWhatsapp",  T.btnWhatsapp  || "💬 Grupo de WhatsApp", CONFIG.links.whatsapp,  "alt"],
  ["btnInstagram", T.btnInstagram || "📸 Instagram",         CONFIG.links.instagram, "alt2"]
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
renderCards(CONFIG.info || [], "infoGrid");
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
  (CONFIG.faq || []).forEach(f => {
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

/* ---------- Bloques extra (imagen y/o texto que armás desde el editor) ---------- */
// where -> [elemento de referencia, "after" (después) o "before" (antes)]
const ANCHORS = {
  hero: ["header.hero", "after"], info: ["#info", "after"], lineup: ["#lineup", "after"],
  barra: ["#barra", "after"], lyra: ["#lyra", "after"], faq: ["#faq", "after"],
  join: [".join", "before"], end: ["footer", "before"]
};
const lastAt = {};   // último bloque puesto en cada lugar (para respetar el orden)
function placeBlock(sec, where) {
  const [sel, pos] = ANCHORS[where] || ANCHORS.end;
  const ref = lastAt[where] || document.querySelector(sel);
  if (ref) {
    if (pos === "after" || lastAt[where]) ref.after(sec); else ref.before(sec);
    lastAt[where] = sec;
    return;
  }
  // Si esa sección no existe, va al final (antes del pie)
  const f = document.querySelector("footer");
  if (f) f.before(sec); else document.querySelector("main").append(sec);
}
(CONFIG.extras || []).forEach(x => {
  if (!x.title && !x.text && !x.image) return;   // bloque vacío: se ignora
  const sec = document.createElement("section");
  sec.className = "extra " + (x.layout === "right" ? "right" : x.layout === "top" ? "top" : "left");
  if (x.image) {
    const im = document.createElement("img");
    im.src = img(x.image); im.alt = x.title || ""; im.loading = "lazy";
    sec.append(im);
  }
  if (x.title || x.text) {
    const body = document.createElement("div"); body.className = "body";
    if (x.title) { const h2 = document.createElement("h2"); h2.textContent = x.title; body.append(h2); }
    if (x.text)  { const p = document.createElement("p");   p.textContent = x.text;  body.append(p); }
    sec.append(body);
  }
  placeBlock(sec, x.where || "end");
});

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
  if (HIDEABLE[key]) $$(HIDEABLE[key]).forEach(el => el.style.display = "none");
});