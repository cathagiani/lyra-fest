/* =====================================================
   EDITOR/SERVER.JS — Mini app local para editar la info de la fiesta
   y publicarla en GitHub con un botón.
   - No necesita instalar nada: solo Node.js y Git.
   - Corre SOLO en tu compu (http://localhost:4321).
   ===================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFile, exec } = require("child_process");

const PORT = 4321;
const ROOT = path.resolve(__dirname, "..");               // carpeta del proyecto
const CONFIG_PATH = path.join(ROOT, "js", "config.js");   // archivo que se edita

/* ---------- Leer config.js ---------- */
// Ejecuta config.js en un "sandbox" y devuelve el objeto CONFIG
function readConfig() {
  const src = fs.readFileSync(CONFIG_PATH, "utf8");
  const cfg = vm.runInNewContext(src + "\n;CONFIG", {});
  return JSON.parse(JSON.stringify(cfg));   // copia limpia
}

/* ---------- Escribir config.js ---------- */
// Comentario corto que se pone arriba de cada campo
const NOTES = {
  tagline: "Etiqueta chiquita arriba del título",
  sub: "Frase debajo de Lyra",
  date: "Fecha y hora (formato ISO, -03:00 = Argentina). Vacío = “Fecha próximamente”",
  links: "Links de los botones (vacío = botón apagado con “(pronto)”)",
  info: "Tarjetas de la sección Info (ic = emoji, t = título, p = texto)",
  lineup: "Artistas / DJs",
  barra: "Tarjetas de la sección La barra",
  faq: "Preguntas frecuentes (q = pregunta, a = respuesta)",
  heroPoses: "Poses que rotan en la portada (archivos de /images, sin .webp)",
  heroSays: "Frases del globo de diálogo de Lyra",
  gallery: "Galería: [archivo, epígrafe]",
  hidden: "Partes de la página ocultas (lo maneja el editor; borrá un nombre de la lista para volver a mostrarla)"
};

/* ---------- Partes de la página que se pueden ocultar ---------- */
// [clave, nombre para mostrar, texto que identifica esa parte dentro de index.html]
// Las claves tienen que coincidir con las de HIDEABLE en js/main.js
const BTN = /id="(heroBtns|bottomBtns)"/;
const PARTS = [
  ["ticker",      "Cinta de texto que se mueve",             /class="ticker"/],
  ["bubble",      "Globo de diálogo de Lyra",                /id="bubble"/],
  ["hint",        "Texto “tocá a Lyra”",                     /class="hint"/],
  ["count",       "Cuenta regresiva",                        /id="count"/],
  ["btnEntradas", "Botón Entradas",                          BTN],
  ["btnWhatsapp", "Botón Grupo de WhatsApp",                 BTN],
  ["btnInstagram","Botón Instagram",                         BTN],
  ["info",        "Sección Info",                            /id="info"/],
  ["lineup",      "Sección Line-up",                         /id="lineup"/],
  ["barra",       "Sección La barra",                        /id="barra"/],
  ["gallery",     "Sección Conocé a Lyra (galería)",         /id="lyra"/],
  ["faq",         "Sección FAQ",                             /id="faq"/],
  ["join",        "Sección Sumate (botones del final)",      /class="join"/],
  ["footer",      "Pie de página (Lyra dormida + Instagram)", /<footer/]
];

// Devuelve solo las partes que existen en tu index.html (si ya borraste una a mano, no aparece)
function availableParts() {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  return PARTS.filter(([, , re]) => re.test(html)).map(([key, label]) => ({ key, label }));
}

// Formatea un valor: las listas van una línea por elemento
function fmt(v) {
  if (Array.isArray(v)) {
    return v.length ? "[\n" + v.map(x => "    " + JSON.stringify(x)).join(",\n") + "\n  ]" : "[]";
  }
  if (v && typeof v === "object") {
    return "{\n" + Object.entries(v).map(([k, x]) => `    ${k}: ${JSON.stringify(x)}`).join(",\n") + "\n  }";
  }
  return JSON.stringify(v);
}

function writeConfig(cfg) {
  const keys = Object.keys(cfg);
  let out =
`/* =====================================================
   CONFIG.JS — Contenido de la página
   Este archivo lo genera el editor local (Abrir-editor).
   También se puede editar a mano si hace falta.
   ===================================================== */
const CONFIG = {
`;
  keys.forEach((k, i) => {
    out += `\n  // ${NOTES[k] || k}\n  ${k}: ${fmt(cfg[k])}${i < keys.length - 1 ? "," : ""}\n`;
  });
  out += "};\n";
  fs.writeFileSync(CONFIG_PATH, out, "utf8");
}

/* ---------- Validación básica antes de guardar ---------- */
function validate(cfg) {
  if (!cfg || typeof cfg !== "object") throw new Error("Datos inválidos");
  if (typeof cfg.links !== "object" || cfg.links === null) throw new Error("Faltan los links");
  for (const k of ["tagline", "sub", "date"]) {
    if (typeof cfg[k] !== "string") throw new Error(`El campo ${k} debe ser texto`);
  }
  for (const k of ["info", "faq", "lineup", "barra", "heroPoses", "heroSays", "gallery", "hidden"]) {
    if (k in cfg && !Array.isArray(cfg[k])) throw new Error(`El campo ${k} debe ser una lista`);
  }
  if (cfg.hidden && !cfg.hidden.every(x => typeof x === "string")) throw new Error("hidden debe ser una lista de textos");
}

/* ---------- Git ---------- */
// Corre un comando git en la carpeta del proyecto
const git = (...args) => new Promise(resolve => {
  execFile("git", args, { cwd: ROOT }, (err, stdout, stderr) =>
    resolve({ ok: !err, out: ((stdout || "") + (stderr || "")).trim(), code: err && err.code }));
});

// Guarda cambios, hace commit y push. Devuelve { ok, msg }
// overwrite = true: si hay un choque con lo que hay en GitHub, ganan los cambios de este editor
async function publish(overwrite = false) {
  const inRepo = await git("rev-parse", "--is-inside-work-tree");
  if (!inRepo.ok) return { ok: false, msg: "Esta carpeta no es un repo de Git (¿la bajaste con git clone?)." };

  await git("add", "js/config.js");
  const diff = await git("diff", "--cached", "--quiet");      // sale con error si HAY cambios
  let committed = false;

  if (!diff.ok) {
    const stamp = new Date().toLocaleString("es-AR");
    // "-- js/config.js": commitea SOLO este archivo, aunque haya otras cosas preparadas
    const commit = await git("commit", "-m", `Actualiza info de la fiesta (${stamp})`, "--", "js/config.js");
    if (!commit.ok) return { ok: false, msg: "No se pudo hacer el commit:\n" + commit.out +
      "\n\nSi dice 'Please tell me who you are', corré una vez:\n  git config --global user.name \"Tu nombre\"\n  git config --global user.email \"tu@mail.com\"" };
    committed = true;
  } else {
    // Sin cambios nuevos: ¿quedó algún commit sin subir de un intento anterior?
    const ahead = await git("rev-list", "--count", "@{u}..HEAD");
    if (!(ahead.ok && Number(ahead.out) > 0)) return { ok: true, msg: "No hay cambios nuevos para publicar." };
  }

  // Trae cambios nuevos del repo antes de subir (por si alguien más subió algo)
  // (--autostash guarda un momento cualquier otro archivo modificado para que no moleste)
  const pull = await git("pull", "--rebase", "--autostash", ...(overwrite ? ["-X", "theirs"] : []));
  if (!pull.ok) {
    if (/CONFLICT|could not apply/i.test(pull.out)) {
      // Choque real: alguien cambió lo mismo en GitHub
      await git("rebase", "--abort");
      if (committed) await git("reset", "-q", "HEAD~1");   // deshace el commit local; tus cambios quedan en el archivo
      return { ok: false, conflict: true, msg: "Alguien cambió la info en GitHub al mismo tiempo y chocan con tus cambios.\n" +
        "Tus cambios siguen guardados en tu compu, pero NO se subieron.\n" +
        "Podés avisarle al dueño, o usar “Publicar igual” para que ganen los tuyos.\n\n" + pull.out };
    }
    // Otro problema (sin internet, sin permisos…): el commit queda guardado y se reintenta la próxima vez
    return { ok: false, msg: "No se pudo bajar lo último de GitHub (¿internet o permisos?). Probá de nuevo en un rato.\n\n" + pull.out };
  }

  const push = await git("push");
  if (!push.ok) return { ok: false, msg: "No se pudo subir a GitHub:\n" + push.out };
  return { ok: true, msg: "¡Listo! Cambios subidos. En un minuto o dos se actualiza la página." };
}

/* ---------- Servidor web ---------- */
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

// Lee el cuerpo de un POST (máx. 1 MB)
const readBody = req => new Promise((resolve, reject) => {
  let data = "";
  req.on("data", c => { data += c; if (data.length > 1e6) { reject(new Error("Demasiado grande")); req.destroy(); } });
  req.on("end", () => resolve(data));
});

const send = (res, code, body, type = "application/json") => {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

const server = http.createServer(async (req, res) => {
  try {
    // Seguridad: solo acepta pedidos que vengan de localhost (evita que otra web le mande órdenes)
    const okHosts = [`localhost:${PORT}`, `127.0.0.1:${PORT}`];
    if (!okHosts.includes(req.headers.host)) return send(res, 403, { error: "Host no permitido" });
    if (req.method === "POST" && req.headers.origin && !okHosts.some(h => req.headers.origin === "http://" + h))
      return send(res, 403, { error: "Origen no permitido" });

    const url = new URL(req.url, "http://localhost");

    // --- API ---
    if (url.pathname === "/api/config" && req.method === "GET") return send(res, 200, { cfg: readConfig(), parts: availableParts() });

    if (url.pathname === "/api/save" && req.method === "POST") {
      const cfg = JSON.parse(await readBody(req));
      validate(cfg); writeConfig(cfg);
      return send(res, 200, { ok: true, msg: "Guardado en tu compu. Abrí la página para verla." });
    }

    if (url.pathname === "/api/publish" && req.method === "POST") {
      const cfg = JSON.parse(await readBody(req));
      validate(cfg); writeConfig(cfg);           // primero guarda
      return send(res, 200, await publish(url.searchParams.get("overwrite") === "1"));    // después sube
    }

    // --- Pantalla del editor ---
    if (url.pathname === "/__editor") return send(res, 200, fs.readFileSync(path.join(__dirname, "editor.html")), MIME[".html"]);

    // --- Archivos de la página (para la vista previa en "/") ---
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.join(ROOT, rel);
    const inside = file.startsWith(ROOT + path.sep);
    const hidden = rel.split("/").some(p => p.startsWith("."));        // bloquea .git y archivos ocultos
    if (!inside || hidden || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, "No encontrado", "text/plain");
    return send(res, 200, fs.readFileSync(file), MIME[path.extname(file)] || "application/octet-stream");
  } catch (e) {
    send(res, 500, { ok: false, msg: "Error: " + e.message });
  }
});

server.on("error", e => {
  if (e.code === "EADDRINUSE") console.log(`\nEl puerto ${PORT} ya está en uso. ¿Ya tenés el editor abierto en otra ventana?`);
  else console.log(e);
  process.exit(1);
});

// Escucha solo en esta compu (127.0.0.1) y abre el navegador
server.listen(PORT, "127.0.0.1", async () => {
  const link = `http://localhost:${PORT}/__editor`;

  // Al abrir, baja lo último del repo para no editar sobre una versión vieja
  const inRepo = await git("rev-parse", "--is-inside-work-tree");
  if (inRepo.ok) {
    const pull = await git("pull", "--rebase", "--autostash");
    console.log(pull.ok ? "✓ Info al día con GitHub" : "⚠ No se pudo actualizar desde GitHub (seguimos igual):\n" + pull.out);
  } else {
    console.log("⚠ Esta carpeta no es un repo de Git: se puede editar y guardar, pero no publicar.");
  }

  console.log(`\n✦ Editor de Lyra Fest listo en ${link}`);
  console.log("  (dejá esta ventana abierta mientras editás; cerrala para terminar)\n");
  const open = process.platform === "win32" ? `start "" "${link}"` : process.platform === "darwin" ? `open "${link}"` : `xdg-open "${link}"`;
  exec(open);
});
