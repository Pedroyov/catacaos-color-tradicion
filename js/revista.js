/* =========================================================
 * Revista de la edición — motor de maquetación
 * ---------------------------------------------------------
 * revista.html?e=2024  carga:
 *   data/revista/2024.js        → textos y datos (CCT_REVISTA)
 *   data/revista/fotos-2024.js  → fotos elegidas (CCT_FOTOS)
 * y arma todas las páginas. Se usan <script> (no fetch) para
 * que funcione igual en GitHub Pages y abriendo el archivo local.
 * ========================================================= */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  var YEAR = params.get("e") || params.get("edicion") || "2024";
  var book = document.getElementById("rvBook");
  var flip = null;
  var pages = [];      // [{ html, cls, density, id, toc }]
  var tocItems = [];   // [{ index, t, s }]
  var R, F, FOTOS;     // revista, fotos del año, mapa n→foto

  /* ---------- utilidades ---------- */
  function loadScript(src) {
    return new Promise(function (ok) {
      var s = document.createElement("script");
      s.src = src; s.onload = function () { ok(true); }; s.onerror = function () { ok(false); };
      document.head.appendChild(s);
    });
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fotoSrc(n) { return "img/galeria/" + YEAR + "-" + n + ".jpg"; }
  function img(src, cls, pos, alt) {
    return '<img class="' + (cls == null ? "img" : cls) + '" data-src="' + esc(src) + '" alt="' + esc(alt || "") + '"' +
      (pos ? ' style="object-position:' + esc(pos) + '"' : "") + ">";
  }
  /* Punto de recorte: 1) el que marcaste a mano en la herramienta,
     2) la cara detectada automáticamente, 3) el foco del grupo, 4) 50% 30%. */
  function focoDe(n, respaldo) {
    var f = FOTOS && FOTOS[n];
    if (f && f.foco) return f.foco;
    var s = ((window.CCT_SUGERENCIAS || {})[YEAR] || {})[n];
    if (s && s.f && s.f[2] !== "d") return s.f[0] + "% " + s.f[1] + "%";
    return respaldo || "50% 30%";
  }
  function foto(n, cls, pos) { return img(fotoSrc(n), cls, focoDe(n, pos), "Fotografía " + n + " de la edición " + YEAR); }
  function frame(n, caption, pos) {
    return '<figure class="frame" style="margin:0">' + foto(n, "", pos) +
      (caption ? "<figcaption>" + esc(caption) + "</figcaption>" : "") + "</figure>";
  }
  function paras(arr, first) {
    return (arr || []).map(function (p, i) { return "<p" + (i === 0 && first ? ' class="dropcap"' : "") + ">" + esc(p) + "</p>"; }).join("");
  }
  function mono(nombre) { return (nombre || "?").replace(/^(A\.F\.|G\.F\.|E\.C\.|C\.C\.|I\.E\.P\.)\s*/, "").split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(); }
  function logo(g) {
    return g.logo ? img(g.logo, "", null, "Logo de " + g.nombre) : '<span class="mono">' + esc(mono(g.nombre)) + "</span>";
  }
  // Logo que lleva a la ficha técnica de la agrupación (agrupacion.html).
  // Va dentro de <a> porque la librería de páginas deja pasar los clics en enlaces.
  function logoLink(g) {
    if (!g.logo) return logo(g);
    return '<a class="lglink" href="agrupacion.html?logo=' + encodeURIComponent(String(g.logo).split("/").pop()) + '" title="Ver ficha técnica de ' + esc(g.nombre) + '">' + logo(g) + "</a>";
  }
  function findGrupoByShort(nombre) {
    var key = Object.keys(R.grupos).find(function (k) { return R.grupos[k].nombre === nombre && R.grupos[k].categoria === "Mayores"; });
    return key ? R.grupos[key] : null;
  }

  /* ---------- fotos ---------- */
  var used = {};
  function fotosDe(gid) {
    return Object.keys(FOTOS).map(Number).filter(function (n) {
      var f = FOTOS[n]; return f.grupo === gid && (f.usos || []).indexOf("descartar") < 0;
    }).sort(function (a, b) {
      var fa = FOTOS[a], fb = FOTOS[b];
      return (fb.principal ? 9 : 0) + (fb.estrellas || 0) - ((fa.principal ? 9 : 0) + (fa.estrellas || 0)) || a - b;
    });
  }
  function nota(n) { return (FOTOS[n] && FOTOS[n].nota) || ""; }
  function mark(list) { list.forEach(function (n) { used[n] = true; }); return list; }
  function relleno() {
    // Mejor foto aún no usada (sirve para páginas a sangre que cuadran los pliegos)
    var libres = Object.keys(FOTOS).map(Number).filter(function (n) {
      var f = FOTOS[n]; return !used[n] && (f.estrellas || 0) >= 3 && (f.usos || []).indexOf("descartar") < 0;
    });
    libres.sort(function (a, b) { return a - b; });
    return libres.length ? libres[Math.floor(libres.length / 2)] : null;
  }

  /* ---------- armado de páginas ---------- */
  function add(html, opt) {
    opt = opt || {};
    pages.push({ html: html, cls: opt.cls || "", density: opt.hard ? "hard" : "soft", folio: opt.folio !== false, light: !!opt.light });
    if (opt.toc) tocItems.push({ index: pages.length - 1, t: opt.toc, s: opt.tocSub || "", grupo: !!opt.grupo });
    return pages.length - 1;
  }
  // Garantiza que la próxima página caiga a la IZQUIERDA de un pliego (índice impar).
  function startSpread() {
    if (pages.length % 2 === 0) {
      var n = relleno();
      if (n) { used[n] = true; add(foto(n) + (nota(n) ? '<div class="shade-b"></div><div class="caption">' + esc(nota(n)) + "</div>" : ""), { cls: "bleed", light: true }); }
      else add('<div class="pad"><p class="kicker">Notas</p></div>', {});
    }
  }

  function pPortada() {
    var c = R.portada;
    used[c.foto] = true;
    add(
      foto(c.foto, "img") + '<div class="shade-t"></div><div class="shade-b"></div>' +
      '<div class="mast"><h1>CATACAOS</h1><div class="tag">Color y Tradición</div></div>' +
      '<div class="issue"><span>Nº ' + esc(R.numero) + "</span><span>" + esc(R.mes) + "</span><span>Edición de colección</span></div>" +
      '<div class="lines">' + c.lineas.map(function (l) { return "<div><b>" + esc(l.k) + "</b><span>" + esc(l.t) + "</span></div>"; }).join("") + "</div>" +
      '<div class="headline"><div class="ante">' + esc(c.antetitulo) + "</div><h2>" + esc(c.titular) + "</h2></div>" +
      '<div class="foot"><span>' + esc(R.nombre) + "<br>" + esc(R.lugar) + '</span><span class="barcode"><i></i><small>CCT ' + esc(R.edicion) + "</small></span></div>",
      { cls: "cover", hard: true, folio: false }
    );
  }

  function pSumario() { add('<div class="pad toc"><p class="kicker">En esta edición</p><h2>Sumario</h2><ol id="tocList"></ol></div>', {}); }

  function pEditorial() {
    var e = R.editorial; used[e.foto] = true;
    add(
      '<div class="photo frame">' + foto(e.foto) + "</div>" +
      '<div class="head"><p class="kicker">Editorial</p><h2 class="h-serif">' + esc(e.titulo) + '</h2><div class="rule"></div></div>' +
      '<div class="txt body">' + paras(e.texto, true) + '<p class="firma">— ' + esc(e.firma) + "</p></div>",
      { cls: "editorial", toc: "Editorial", tocSub: e.titulo }
    );
  }

  function pCifras() {
    var c = R.cifras; used[c.foto] = true;
    add(
      '<div class="photo frame">' + foto(c.foto) + '<div class="shade-b"></div></div>' +
      '<div class="title"><p class="kicker" style="color:var(--gold2)">La edición en cifras</p><h2>' + esc(R.fecha) + "</h2></div>" +
      '<div class="grid">' + c.items.map(function (i) { return '<div class="stat"><b>' + esc(i.n) + "</b><span>" + esc(i.t) + "</span></div>"; }).join("") + "</div>",
      { cls: "cifras", toc: "La edición en cifras" }
    );
  }

  function pCronica(c) {
    var ph = c.foto ? (used[c.foto] = true, foto(c.foto)) : img(c.fotoExterna, "img");
    add(
      '<div class="photo frame">' + ph + "</div>" +
      '<div class="pad"><p class="kicker">' + esc(c.seccion) + '</p><h2 class="h-serif">' + esc(c.titulo) + "</h2>" +
      '<p class="bajada">' + esc(c.bajada) + '</p><div class="txt body">' + paras(c.texto, true) + "</div></div>",
      { cls: "cronica", toc: c.titulo, tocSub: c.seccion }
    );
  }

  function pBloques() {
    var html = '<div class="pad tablas"><p class="kicker">Así se jugó</p><h2 class="h-serif">Fase de grupos</h2>';
    R.bloques.forEach(function (b) {
      html += '<div class="bloque"><div class="bh"><span class="letra">' + esc(b.id) + "</span><span>Grupo " + esc(b.id) + "</span></div>" +
        '<table class="tbl">' + b.filas.map(function (f) {
          return '<tr class="' + (f[3] ? "q" : "") + '"><td class="eq">' + esc(f[0]) + '</td><td class="dz">' + esc(f[1]) + '</td><td class="pts">' + esc(f[2]) + "</td></tr>";
        }).join("") + "</table></div>";
    });
    html += '<p class="leyenda">▲ Clasificó a la gran final. Puntaje total de los tres jurados.</p></div>';
    add(html, { toc: "Fase de grupos", tocSub: "Bloques A, B y C" });
  }

  function pFinal() {
    var max = Math.max.apply(null, R.final.map(function (f) { return f[2]; }));
    var min = Math.min.apply(null, R.final.map(function (f) { return f[2]; })) - 6;
    var html = '<div class="pad tablas"><p class="kicker">Gran final</p><h2 class="h-serif">La tabla de la noche</h2><div class="final-list">';
    R.final.forEach(function (f) {
      var g = findGrupoByShort(f[0]) || { nombre: f[0] };
      html += '<div class="fl-row' + (f[3] === "1°" ? " top" : "") + '"><span class="pos">' + esc(f[3] || "·") + '</span><span class="lg">' + logoLink(g) + "</span>" +
        '<span class="nm">' + esc(f[0]) + "<small>" + esc(f[1]) + '</small></span><span class="pt">' + esc(f[2]) + "</span>" +
        '<span class="bar"><i style="width:' + ((f[2] - min) / (max - min) * 100).toFixed(1) + '%"></i></span></div>';
    });
    html += '</div><p class="leyenda" style="margin-top:2cqw">' + esc(R.notaFinal) + "</p></div>";
    add(html, { toc: "La gran final", tocSub: "Tabla de resultados" });
  }

  function pApertura(a) {
    used[a.foto] = true;
    add(foto(a.foto) + '<div class="shade-b"></div><div class="over"><p class="kicker">Sección</p><h2>' + esc(a.titulo) + "</h2><p>" + esc(a.bajada) + "</p></div>",
      { cls: "bleed", light: true, toc: a.titulo, tocSub: "Una sección por agrupación" });
  }

  function medalla(g) {
    if (!g.puesto || g.categoria !== "Mayores") return "";
    var cls = g.puesto === 1 ? "" : g.puesto === 2 ? " plata" : g.puesto === 3 ? " bronce" : null;
    if (cls === null) return "";
    return '<div class="medal' + cls + '"><b>' + (g.puesto === 1 ? "1°" : g.puesto + "°") + "</b><span>" + (g.puesto === 1 ? "Campeón<br>" + YEAR : "Lugar<br>" + YEAR) + "</span></div>";
  }

  function pGrupo(gid, g, idx, fotos) {
    var principal = fotos[0];
    var resto = fotos.slice(1);
    var mosaico = resto.slice(0, 3);
    mark([principal].concat(mosaico));
    var style = "--accent:" + (g.color || "var(--gold)");

    // IZQUIERDA: apertura a sangre
    startSpread();
    add(
      foto(principal, "img", g.foco) + '<div class="shade-t"></div><div class="shade-b"></div>' +
      '<div class="sec">Las selecciones · <b>' + String(idx).padStart(2, "0") + "</b></div>" + medalla(g) +
      '<div class="over"><div class="tipo">' + esc(g.tipo) + "</div><h2>" + esc(g.nombre) + '</h2><div class="loc">' + esc(g.localidad) + "</div></div>",
      { cls: "bleed g-open", light: true, toc: g.nombre, tocSub: g.resultado, grupo: true }
    );
    pages[pages.length - 1].style = style;

    // DERECHA: ficha técnica
    var best = Math.max.apply(null, g.danzas.map(function (d) { return d.final || d.puntaje || 0; }));
    var stats = [
      ["Resultado", g.resultado, true],
      ["Mejor puntaje", best || "—"],
      ["Danzas", g.danzas.length],
      ["Categoría", g.categoria, true]
    ];
    var tbl = '<table class="tbl"><tr><th>Danza</th><th>Bloque</th><th class="r">Clasif.</th><th class="r">Final</th></tr>' +
      g.danzas.map(function (d) {
        return '<tr><td class="eq">' + esc(d.nombre) + '</td><td class="dz">' + (d.bloque ? "Grupo " + esc(d.bloque) : "—") +
          '</td><td class="pts">' + esc(d.puntaje || "—") + '</td><td class="pts">' + esc(d.final || "—") + "</td></tr>";
      }).join("") + "</table>";
    var m = mosaico.length;
    add(
      '<div class="top"><p class="kicker">Ficha técnica</p><h3>' + esc(g.nombre) + '</h3></div><div class="logo">' + logoLink(g) + "</div>" +
      '<div class="stats">' + stats.map(function (s) { return "<div><b" + (s[2] ? ' class="sm"' : "") + ">" + esc(s[1]) + "</b><span>" + esc(s[0]) + "</span></div>"; }).join("") + "</div>" +
      '<div class="data"><p class="lbl">Danzas presentadas</p>' + tbl +
      (g.premios && g.premios.length ? '<ul class="premios">' + g.premios.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "") +
      (g.dato ? '<p class="dato">' + esc(g.dato) + "</p>" : "") +
      '<div class="hist" data-hist="' + esc(g.nombre) + '"></div></div>' +
      (m ? '<div class="mosaic m' + m + '">' + mosaico.map(function (n) { return frame(n, nota(n)); }).join("") + "</div>" : ""),
      { cls: "ficha" }
    );
    pages[pages.length - 1].style = style;

    // Pliego extra de galería si el grupo tiene muchas fotos buenas
    var extra = resto.slice(3).filter(function (n) { return (FOTOS[n].estrellas || 0) >= 2; }).slice(0, 7);
    if (extra.length >= 5) {
      mark(extra);
      var a = extra.slice(0, 3), b = extra.slice(3, 7);
      add('<div class="ttl"><p class="kicker">' + esc(g.nombre) + '</p><h2 class="h-serif">En escena</h2></div><div class="grid g' + a.length + '">' +
        a.map(function (n) { return frame(n, nota(n)); }).join("") + "</div>", { cls: "gal has-ttl" });
      pages[pages.length - 1].style = style;
      add('<div class="grid g' + Math.min(b.length, 4) + '">' + b.map(function (n) { return frame(n, nota(n)); }).join("") + "</div>", { cls: "gal" });
      pages[pages.length - 1].style = style;
    }
  }

  function card(g) {
    var d = g.danzas[0] || {};
    return '<div class="card" style="--accent:' + esc(g.color || "var(--gold)") + '"><span class="lg">' + logoLink(g) + "</span><div><b>" + esc(g.nombre) + "</b>" +
      "<small>" + esc([g.tipo, g.localidad].filter(Boolean).join(" · ")) + "</small>" +
      '<div class="pts">' + g.danzas.map(function (x) { return esc(x.nombre) + " <em>" + esc(x.final || x.puntaje) + "</em>"; }).join(" · ") + "</div>" +
      (g.puesto && g.puesto <= 3 || /revelaci/i.test(g.resultado) ? '<span class="badge">' + esc(g.resultado) + "</span>" : "") + "</div></div>";
  }

  function pParticiparon(lista) {
    if (!lista.length) return;
    add('<div class="pad part"><p class="kicker">Categoría Mayores</p><h2 class="h-serif">También participaron</h2>' +
      '<p class="body intro">Agrupaciones que compartieron escenario en esta edición.</p><div class="cards">' +
      lista.map(card).join("") + "</div></div>", { toc: "También participaron" });
  }

  function pInfantil(lista) {
    if (!lista.length) return;
    add('<div class="pad part"><p class="kicker">Categoría Infantil</p><h2 class="h-serif">Los más pequeños</h2>' +
      '<div class="cards infantil">' + lista.map(card).join("") + "</div></div>", { toc: "Categoría infantil", tocSub: "Las agrupaciones" });
  }

  function pHonor() {
    var h = R.honor;
    function podio(list) {
      var o = [list[1], list[0], list[2]];
      return '<div class="podio">' + o.map(function (p, i) {
        var pos = i === 1 ? 1 : i === 0 ? 2 : 3;
        return '<div class="p' + pos + '"><b>' + pos + "°</b><span>" + esc(p.grupo) + "</span><small>" + esc(p.puesto) + "</small></div>";
      }).join("") + "</div>";
    }
    add('<div class="pad honor"><p class="kicker">Resultados</p><h2 class="h-serif">Cuadro de honor</h2>' +
      '<p class="subt">Categoría Mayores</p>' + podio(h.podio) +
      '<p class="subt">Categoría Infantil</p>' + podio(h.podioInfantil) + "</div>" +
      '<div class="frame honor-foto">' + img(h.foto, "", "50% 30%") + "</div>",
      { toc: "Cuadro de honor", tocSub: "Podios y distinciones" });
    add('<div class="pad honor"><p class="kicker">Reconocimientos</p><h2 class="h-serif">Distinciones</h2><div class="dist">' +
      h.distinciones.map(function (d) { return "<div><small>" + esc(d[0]) + "</small><b>" + esc(d[1]) + "</b>" + (d[2] ? "<span>" + esc(d[2]) + "</span>" : "") + "</div>"; }).join("") +
      "</div></div>", {});
  }

  function pJurado() {
    var j = R.jurado; used[j.foto] = true;
    add('<div class="photo frame">' + foto(j.foto, "") + '</div><div class="pie">' + esc(j.pie) + "</div>" +
      '<div class="pad"><p class="kicker">Evaluación</p><h2 class="h-serif">El jurado</h2><div class="miembros">' +
      j.miembros.map(function (m, i) { return "<div><small>Jurado " + (i + 1) + "</small><b>" + esc(m) + "</b></div>"; }).join("") + "</div></div>",
      { cls: "jurado", toc: "El jurado" });
  }

  function pCuriosidades() {
    add('<div class="pad curi"><p class="kicker">¿Sabías que…?</p><h2 class="h-serif">Curiosidades</h2><div class="grid">' +
      R.curiosidades.map(function (c, i) { return "<div><b>" + String(i + 1).padStart(2, "0") + "</b><h4>" + esc(c[0]) + "</h4><p>" + esc(c[1]) + "</p></div>"; }).join("") +
      "</div></div>", { toc: "Curiosidades" });
  }

  function pGaleria(cfg, extraCls) {
    var fs = cfg.fotos.filter(function (n) { return FOTOS[n] || true; });
    mark(fs);
    var cut = Math.min(3, Math.ceil(fs.length / 2));
    var a = fs.slice(0, cut), b = fs.slice(cut, cut + 4);
    add('<div class="ttl"><p class="kicker">Galería</p><h2 class="h-serif">' + esc(cfg.titulo) + '</h2></div><div class="grid g' + a.length + '">' +
      a.map(function (n) { return frame(n, nota(n)); }).join("") + "</div>", { cls: "gal has-ttl " + (extraCls || ""), toc: cfg.titulo, tocSub: "Galería" });
    if (b.length) add('<div class="grid g' + Math.min(b.length, 4) + '">' + b.map(function (n) { return frame(n, nota(n)); }).join("") + "</div>", { cls: "gal " + (extraCls || "") });
  }

  function pContra() {
    var c = R.contraportada; used[c.foto] = true;
    // La contraportada debe quedar sola a la izquierda: total de páginas par.
    if (pages.length % 2 === 0) {
      var n = relleno();
      if (n) { used[n] = true; add(foto(n) + '<div class="shade-b"></div>', { cls: "bleed", light: true }); }
      else add("", {});
    }
    add('<div class="photo frame">' + foto(c.foto) + '</div><div class="txt"><img src="img/logo.png" alt="Catacaos, Color y Tradición">' +
      "<h2>" + esc(c.texto) + "</h2><p>Fotografías: " + esc(R.fotografos.join(" y ")) + "<br>" + esc(R.nombre) + " · " + esc(R.fecha) + " · " + esc(R.lugar) +
      '<br><a href="index.html">pedroyov.github.io/catacaos-color-tradicion</a></p></div>', { cls: "back", hard: true, folio: false });
  }

  function build() {
    pPortada();
    pSumario();
    pEditorial();
    pCifras();
    R.cronicas.forEach(pCronica);
    pBloques();
    pFinal();
    // Selecciones
    var conFotos = [], sinFotos = [], infantil = [];
    R.orden.forEach(function (gid) {
      var g = R.grupos[gid]; if (!g) return;
      var fs = fotosDe(gid);
      if (fs.length) conFotos.push([gid, g, fs]);
      else if (g.categoria === "Infantil") infantil.push(g);
      else sinFotos.push(g);
    });
    // La apertura de sección va a la DERECHA para que cada grupo empiece a la izquierda.
    if (pages.length % 2 === 1) { var rf = relleno(); if (rf) { used[rf] = true; add(foto(rf) + '<div class="shade-b"></div>', { cls: "bleed", light: true }); } else add("", {}); }
    pApertura(R.aperturaSelecciones);
    conFotos.forEach(function (x, i) { pGrupo(x[0], x[1], i + 1, x[2]); });
    startSpread();
    pParticiparon(sinFotos);
    pInfantil(infantil);
    pHonor();
    pJurado();
    pCuriosidades();
    pGaleria(R.galeria);
    pGaleria(R.blancoYNegro, "bn dark");
    pContra();
  }

  /* ---------- render al DOM ---------- */
  function render() {
    book.innerHTML = pages.map(function (p, i) {
      var folio = p.folio ? '<div class="folio' + (p.light ? " light" : "") + '"><span>' + i + "</span><span>Nº " + esc(R.numero) + " · Catacaos, Color y Tradición</span></div>" : "";
      return '<div class="page ' + p.cls + '" data-density="' + p.density + '" data-i="' + i + '"><div class="pg"' + (p.style ? ' style="' + p.style + '"' : "") + '>' + p.html + folio + "</div></div>";
    }).join("");

    // Sumario
    var toc = document.getElementById("tocList");
    if (toc) toc.innerHTML = tocItems.filter(function (t) { return t.index > 1 && !t.grupo; }).slice(0, 12).map(function (t) {
      return '<li><a href="#p' + t.index + '" data-go="' + t.index + '"><span class="n">' + String(t.index).padStart(2, "0") + '</span><span class="t">' + esc(t.t) + "" + "</span></a></li>";
    }).join("");

    var jump = document.getElementById("rvJump");
    jump.innerHTML = '<option value="">Ir a…</option><option value="0">Portada</option>' +
      tocItems.map(function (t) { return '<option value="' + t.index + '">' + esc(t.t) + "</option>"; }).join("");
  }

  function loadImagesAround(i) {
    var all = book.querySelectorAll(".page");
    for (var k = Math.max(0, i - 2); k <= Math.min(all.length - 1, i + 5); k++) {
      all[k].querySelectorAll("img[data-src]").forEach(function (im) { im.src = im.getAttribute("data-src"); im.removeAttribute("data-src"); });
    }
  }
  function loadAllImagesLazy() {
    var io = typeof window.IntersectionObserver === "function" ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { loadImagesAround(Number(e.target.getAttribute("data-i"))); io.unobserve(e.target); } });
    }, { rootMargin: "600px" }) : null;
    book.querySelectorAll(".page").forEach(function (p) { io ? io.observe(p) : loadImagesAround(Number(p.getAttribute("data-i"))); });
  }

  function updateIndicator(i) {
    var total = pages.length;
    document.getElementById("rvPage").textContent = (i === 0 ? "Portada" : i + " / " + (total - 1));
  }

  function goTo(i) {
    i = Number(i);
    if (flip) { flip.flip(i); }
    else { var el = book.querySelector('.page[data-i="' + i + '"]'); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }

  function initFlip(start) {
    if (!window.St || !St.PageFlip) { setScroll(true); return; }
    var W = 500, H = Math.round(500 / 0.735);
    flip = new St.PageFlip(book, {
      width: W, height: H, size: "stretch",
      minWidth: 380, maxWidth: 1400, minHeight: 400, maxHeight: 1900,
      showCover: true, usePortrait: true, mobileScrollSupport: false,
      maxShadowOpacity: 0.45, flippingTime: 800, drawShadow: true, autoSize: true,
      startPage: start || 0
    });
    flip.loadFromHTML(book.querySelectorAll(".page"));
    flip.on("flip", function (e) { loadImagesAround(e.data); updateIndicator(e.data); try { history.replaceState(null, "", "#p" + e.data); } catch (x) {} });
    loadImagesAround(start || 0);
    updateIndicator(start || 0);
  }

  function setScroll(on) {
    document.body.classList.add("rv-scroll");
    document.getElementById("rvMode").textContent = "Hojear";
    loadAllImagesLazy();
  }
  function switchMode() {
    var scroll = document.body.classList.contains("rv-scroll");
    var cur = flip ? flip.getCurrentPageIndex() : 0;
    params.set("e", YEAR);
    if (scroll) params.delete("modo"); else params.set("modo", "scroll");
    location.href = location.pathname + "?" + params.toString() + (cur ? "#p" + cur : "");
  }

  /* ---------- PDF: se imprime la revista página por página ---------- */
  function prepararPdf() {
    var msg = document.getElementById("rvPdfMsg"), txt = document.getElementById("rvPdfTxt");
    msg.hidden = false;
    var imgs = [];
    book.querySelectorAll("img[data-src]").forEach(function (im) { im.src = im.getAttribute("data-src"); im.removeAttribute("data-src"); });
    book.querySelectorAll("img").forEach(function (im) { im.loading = "eager"; imgs.push(im); });
    var total = imgs.length, listas = 0;
    function uno() { listas++; txt.textContent = "Cargando fotos: " + listas + " de " + total; }
    var esperas = imgs.map(function (im) {
      return im.complete ? (uno(), Promise.resolve()) : new Promise(function (ok) { im.addEventListener("load", function () { uno(); ok(); }, { once: true }); im.addEventListener("error", function () { uno(); ok(); }, { once: true }); });
    });
    var limite = new Promise(function (ok) { setTimeout(ok, 45000); });
    Promise.race([Promise.all(esperas), limite]).then(function () {
      txt.textContent = "En la ventana que se abre, elige «Guardar como PDF».";
      setTimeout(function () {
        msg.hidden = true;
        window.print();
      }, 600);
    });
  }

  function bindToc() {
    book.querySelectorAll("[data-go]").forEach(function (li) {
      li.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); goTo(li.getAttribute("data-go")); });
    });
  }

  /* ---------- historial desde el Sheets (opcional) ---------- */
  function historial() {
    if (!window.CCTData) return;
    CCTData.getParticipaciones().then(function (parts) {
      document.querySelectorAll("[data-hist]").forEach(function (el) {
        var nombre = el.getAttribute("data-hist").toLowerCase();
        var anios = {};
        parts.forEach(function (p) {
          var a = String(p.agrupacion || "").toLowerCase();
          if (a && (a === nombre || a.indexOf(nombre) >= 0) && String(p.categoria || "").toLowerCase().indexOf("infantil") < 0) {
            var win = String(p.campeon || "").toLowerCase().match(/^(s[ií]|true|1|x)/) || /^1/.test(String(p.puesto || ""));
            anios[p.anio] = anios[p.anio] || !!win;
          }
        });
        var ks = Object.keys(anios).sort();
        if (ks.length) el.innerHTML = "<span>Participaciones</span>" + ks.map(function (y) { return '<i class="' + (anios[y] ? "win" : "") + '">' + esc(y) + (anios[y] ? " ★" : "") + "</i>"; }).join("");
      });
    }).catch(function () {});
  }

  /* ---------- inicio ---------- */
  if (window.innerWidth < 760) {
    document.getElementById("rvHint").textContent = "Desliza con el dedo para pasar la página.";
    if (params.get("modo") !== "scroll") document.getElementById("rvMode").textContent = "Scroll";
  }
  document.getElementById("rvPrev").onclick = function () { flip && flip.flipPrev(); };
  document.getElementById("rvNext").onclick = function () { flip && flip.flipNext(); };
  document.getElementById("rvJump").onchange = function (e) { if (e.target.value !== "") goTo(e.target.value); e.target.value = ""; };
  document.getElementById("rvMode").onclick = switchMode;
  document.getElementById("rvPdf").onclick = function () {
    if (document.body.classList.contains("rv-scroll")) prepararPdf();
    else { params.set("e", YEAR); params.set("modo", "scroll"); params.set("pdf", "1"); location.href = location.pathname + "?" + params.toString(); }
  };
  document.getElementById("rvFull").onclick = function () {
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  };
  document.addEventListener("keydown", function (e) {
    if (!flip) return;
    if (e.key === "ArrowRight") flip.flipNext();
    if (e.key === "ArrowLeft") flip.flipPrev();
  });
  var resizeT = null;
  window.addEventListener("resize", function () {
    // Si cambia el tamaño y ya no corresponde una/dos páginas, se rehace el libro.
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      if (!flip) return;
      var w = book.parentElement.getBoundingClientRect().width;
      var want = w < 760 ? "portrait" : "landscape";
      if (flip.getOrientation() !== want) {
        var cur = flip.getCurrentPageIndex();
        location.replace(location.pathname + location.search + (cur ? "#p" + cur : ""));
        location.reload();
      }
    }, 350);
  });

  Promise.all([
    loadScript("data/revista/" + YEAR + ".js"),
    loadScript("data/revista/fotos-" + YEAR + ".js"),
    loadScript("herramientas/sugerencias.js")
  ]).then(function () {
    R = (window.CCT_REVISTA || {})[YEAR];
    F = (window.CCT_FOTOS || {})[YEAR];
    document.getElementById("rvLoading").remove();
    if (!R) { book.innerHTML = '<p style="text-align:center;color:#e7c77a">Aún no hay revista para la edición ' + esc(YEAR) + ".</p>"; return; }
    FOTOS = (F && F.fotos) || {};
    document.title = "Revista " + YEAR + " | Catacaos, Color y Tradición";
    build();
    render();
    bindToc();
    var start = Number((location.hash.match(/^#p(\d+)/) || [])[1] || 0);
    if (params.get("modo") === "scroll") {
      setScroll(true);
      var el = book.querySelector('.page[data-i="' + start + '"]'); if (el && start) setTimeout(function () { el.scrollIntoView(); }, 50);
      if (params.get("pdf")) setTimeout(prepararPdf, 300);
    } else initFlip(Math.min(start, pages.length - 1));
    historial();
  });
})();
