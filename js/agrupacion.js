/* =========================================================
 * Ficha técnica de agrupación (agrupacion.html)
 * ---------------------------------------------------------
 *   agrupacion.html                 → directorio de todas
 *   agrupacion.html?id=AGR-002      → ficha por id del Sheets
 *   agrupacion.html?logo=mama-gusti.jpg → ficha por archivo de logo
 *
 * Todo sale del Sheets (hojas Agrupaciones, Participaciones y
 * Ediciones) vía CCTData. Las fotos salen de las revistas que
 * existan (data/revista/fotos-AAAA.js).
 * ========================================================= */
(function () {
  "use strict";

  // Ediciones que ya tienen fotos asignadas por grupo (revista)
  var REVISTAS = ["2024"];

  var app = document.getElementById("agApp");
  var params = new URLSearchParams(location.search);

  /* ---------- utilidades ---------- */
  function norm(v) { return String(v == null ? "" : v).normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase(); }
  function key(v) { return norm(v).replace(/[^a-z0-9]+/g, ""); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function isHidden(v) { return ["no", "false", "0", "oculto", "inactivo", "borrador"].indexOf(norm(v)) >= 0; }
  function file(p) { return String(p || "").split("/").pop().toLowerCase(); }
  function puestoNum(v) { var m = String(v == null ? "" : v).match(/^\s*(\d+)/); return m ? Number(m[1]) : null; }
  function mono(n) { return String(n || "?").split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(); }
  function titleCase(s) { s = String(s || "").trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }
  function lista(arr) { return arr.length <= 1 ? arr.join("") : arr.slice(0, -1).join(", ") + " y " + arr[arr.length - 1]; }
  function loadScript(src) {
    return new Promise(function (ok) {
      var s = document.createElement("script"); s.src = src;
      s.onload = s.onerror = function () { ok(); }; document.head.appendChild(s);
    });
  }
  function logoHtml(g) {
    return g.logo ? '<img src="' + esc(g.logo) + '" alt="Logo de ' + esc(g.nombre) + '" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{className:\'mono\',textContent:\'' + esc(mono(g.nombre)) + '\'}))">'
      : '<span class="mono">' + esc(mono(g.nombre)) + "</span>";
  }

  /* ---------- modelo ---------- */
  function buildGroups(agr) {
    return agr.filter(function (g) { return !isHidden(g.visible) && (g.nombre_oficial || g.nombre_corto); }).map(function (g) {
      var nombre = g.nombre_oficial || g.nombre_corto;
      return {
        id: g.id_agrupacion, nombre: nombre, tipo: titleCase(g.tipo_entidad),
        region: g.region, provincia: g.provincia, distrito: g.distrito, localidad: g.localidad,
        logo: g.logo || "", facebook: g.facebook, instagram: g.instagram, tiktok: g.tiktok, web: g.web,
        aliases: [g.nombre_oficial, g.nombre_corto].map(key).filter(Boolean),
        parts: []
      };
    });
  }
  // Une cada participación con su agrupación (el nombre en Participaciones suele llevar prefijo: "A.F.", "E.C.M.", etc.)
  function attach(groups, parts) {
    parts.forEach(function (p) {
      if (isHidden(p.visible)) return;
      var c = key(p.agrupacion); if (!c) return;
      var best = null, bestLen = 0;
      groups.forEach(function (g) {
        g.aliases.forEach(function (a) {
          if ((c === a || c.endsWith(a) || a.endsWith(c)) && a.length > bestLen) { best = g; bestLen = a.length; }
        });
      });
      if (best) best.parts.push(p);
    });
    groups.forEach(function (g) {
      g.parts.sort(function (a, b) { return Number(a.anio) - Number(b.anio); });
      var anios = {}, danzas = {};
      g.parts.forEach(function (p) {
        anios[p.anio] = true;
        if (p.danzaPresentacion) danzas[p.danzaPresentacion] = (danzas[p.danzaPresentacion] || []).concat(p.anio);
      });
      g.anios = Object.keys(anios).map(Number).sort();
      g.danzas = danzas;
      var pos = g.parts.map(function (p) { return puestoNum(p.puesto); }).filter(function (n) { return n; });
      g.mejor = pos.length ? Math.min.apply(null, pos) : null;
      g.titulos = g.parts.filter(function (p) { return puestoNum(p.puesto) === 1; });
      g.segundos = g.parts.filter(function (p) { return puestoNum(p.puesto) === 2; });
      g.terceros = g.parts.filter(function (p) { return puestoNum(p.puesto) === 3; });
      g.podios = g.titulos.length + g.segundos.length + g.terceros.length;
    });
    return groups;
  }
  function lugar(g) { return [g.localidad, g.distrito, g.provincia !== g.distrito ? g.provincia : "", g.region].filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(", "); }

  function resultado(p) {
    var n = puestoNum(p.puesto);
    if (n === 1) return ["Campeón", "p1"];
    if (n === 2) return ["2.º lugar", "p2"];
    if (n === 3) return ["3.º lugar", "p3"];
    if (n) return [n + ".º lugar", "pn"];
    return [titleCase(p.puesto) || "Participante", ""];
  }

  /* ---------- color del logo ---------- */
  function colorFromLogo(src, cb) {
    if (!src) return cb(null);
    var im = new Image();
    im.onload = function () {
      try {
        var c = document.createElement("canvas"); c.width = c.height = 48;
        var x = c.getContext("2d"); x.drawImage(im, 0, 0, 48, 48);
        var d = x.getImageData(0, 0, 48, 48).data, bins = {};
        for (var i = 0; i < d.length; i += 4) {
          var r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
          if (a < 200) continue;
          var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 510, s = mx === mn ? 0 : (mx - mn) / (255 - Math.abs(mx + mn - 255));
          if (s < 0.45 || l < 0.18 || l > 0.72) continue;
          var k = (r >> 5) + "," + (g >> 5) + "," + (b >> 5);
          bins[k] = bins[k] || [0, 0, 0, 0]; bins[k][0] += r; bins[k][1] += g; bins[k][2] += b; bins[k][3]++;
        }
        // Se elige el color más presente; los amarillos pesan menos porque
        // oscurecidos quedan verde oliva / marrón.
        function hue(t) {
          var r = t[0] / t[3] / 255, g = t[1] / t[3] / 255, b = t[2] / t[3] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
          if (!d) return 0;
          var h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
          return (h * 60 + 360) % 360;
        }
        function peso(k) { var h = hue(bins[k]); return bins[k][3] * (h > 38 && h < 75 ? 0.3 : 1); }
        var top = Object.keys(bins).sort(function (p, q) { return peso(q) - peso(p); })[0];
        if (!top || bins[top][3] < 20) return cb(null);
        // Tono del logo con saturación y luz fijas: fondo intenso y texto blanco legible
        cb("hsl(" + Math.round(hue(bins[top])) + ", 62%, 34%)");
      } catch (e) { cb(null); }
    };
    im.onerror = function () { cb(null); };
    im.src = src;
  }

  /* ---------- fotos de revistas ---------- */
  function fotosDe(g) {
    var out = [];
    REVISTAS.forEach(function (y) {
      var F = ((window.CCT_FOTOS || {})[y] || {}).fotos || {};
      var S = ((window.CCT_SUGERENCIAS || {})[y]) || {};
      Object.keys(F).forEach(function (n) {
        var f = F[n], gk = key(String(f.grupo || "").split(" — ")[0]);
        if (!gk || (f.usos || []).indexOf("descartar") >= 0) return;
        var ok = g.aliases.some(function (a) { return gk === a || gk.endsWith(a); });
        if (!ok) return;
        var s = S[n], pos = f.foco || (s && s.f && s.f[2] !== "d" ? s.f[0] + "% " + s.f[1] + "%" : "50% 30%");
        out.push({ y: y, n: Number(n), e: f.estrellas || 0, p: !!f.principal, pos: pos });
      });
    });
    return out.sort(function (a, b) { return (b.p - a.p) || (b.e - a.e) || (b.y - a.y) || (a.n - b.n); }).slice(0, 9);
  }

  /* ---------- vistas ---------- */
  function renderFicha(g, all, ediciones) {
    document.title = g.nombre + " | Catacaos, Color y Tradición";
    var edMap = {}; ediciones.forEach(function (e) { edMap[e.anio] = e; });
    var totalEd = ediciones.filter(function (e) { return norm(e.estado).indexOf("final") >= 0; }).length || ediciones.length;

    // Resumen automático, solo con hechos del Sheets
    var frases = [];
    if (g.anios.length) {
      frases.push("Debutó en " + g.anios[0] + (g.anios.length > 1 ? " y ha participado en " + g.anios.length + " ediciones del concurso" : ", su única participación hasta ahora") + ".");
    }
    if (g.titulos.length) frases.push((g.titulos.length === 1 ? "Campeón en " : g.titulos.length + " veces campeón: ") + lista(g.titulos.map(function (p) { return String(p.anio); })) + ".");
    else if (g.podios) frases.push("Ha subido " + (g.podios === 1 ? "una vez" : g.podios + " veces") + " al podio.");
    var dz = Object.keys(g.danzas);
    if (dz.length) frases.push(dz.length === 1 ? "Entre sus danzas registradas está " + dz[0] + "." : "Tiene " + dz.length + " danzas registradas en el concurso.");

    var redes = [["facebook", "img/Facebook.png", "Facebook"], ["instagram", "img/instagram.png", "Instagram"], ["tiktok", "img/tiktok.png", "TikTok"], ["web", "img/web.png", "Web"]]
      .filter(function (r) { return g[r[0]]; })
      .map(function (r) { return '<a href="' + esc(g[r[0]]) + '" target="_blank" rel="noopener"><img src="' + r[1] + '" alt="">' + r[2] + "</a>"; }).join("");

    var badges = [];
    if (g.titulos.length) badges.push('<span class="ag-badge gold">★ ' + g.titulos.length + (g.titulos.length === 1 ? " título" : " títulos") + "</span>");
    if (g.parts.some(function (p) { return norm(p.categoria).indexOf("infantil") >= 0; })) badges.push('<span class="ag-badge">Categoría infantil</span>');
    if (g.anios.length) badges.push('<span class="ag-badge">Desde ' + g.anios[0] + "</span>");

    var stats = [
      [g.anios.length, "Ediciones"],
      [g.titulos.length, "Títulos"],
      [g.podios, "Podios"],
      [g.mejor ? g.mejor + "<small>.º</small>" : "—", "Mejor puesto"],
      [g.anios[0] || "—", "Debut"],
      [g.anios.length ? g.anios[g.anios.length - 1] : "—", "Última vez"]
    ];

    var medals = [["", "Campeón", g.titulos], ["plata", "Subcampeón", g.segundos], ["bronce", "Tercer lugar", g.terceros]].map(function (m, i) {
      return '<div class="ag-medal ' + m[0] + (m[2].length ? "" : " off") + '"><i>' + (i + 1) + "°</i><div><b>" +
        (m[2].length ? m[2].length + (m[2].length === 1 ? " vez" : " veces") : "—") + "</b><span>" + m[1] +
        (m[2].length ? " · " + m[2].map(function (p) { return p.anio; }).join(", ") : "") + "</span></div></div>";
    }).join("");

    var tl = g.parts.map(function (p) {
      var r = resultado(p), e = edMap[p.anio] || {};
      var url = e.url ? "ediciones/" + String(e.url).replace(/^.*\//, "") : "";
      return '<li class="ag-tl' + (r[1] === "p1" ? " win" : "") + '"><span class="yr">' + esc(p.anio) + '</span><div class="info"><b>' +
        esc(e.nombre ? titleCase(e.nombre) : "Edición " + p.anio) + "</b><small>" +
        esc([p.modalidad, p.categoria].filter(Boolean).join(" · ")) + (e.sede ? " · " + esc(e.sede) : "") + "</small>" +
        (p.danzaPresentacion ? '<div class="dz"><span>' + esc(p.danzaPresentacion) + "</span></div>" : "") +
        (p.mensajeCampeon ? "<small><i>" + esc(p.mensajeCampeon) + "</i></small>" : "") +
        (url ? '<small><a href="' + esc(url) + '">Ver la edición ' + esc(p.anio) + " →</a></small>" : "") +
        '</div><span class="res ' + r[1] + '">' + esc(r[0]) + "</span></li>";
    }).join("");

    var danzasHtml = dz.length ? '<div class="ag-danzas">' + dz.map(function (d) { return "<span>" + esc(d) + "<small>" + g.danzas[d].join(" · ") + "</small></span>"; }).join("") + "</div>" : "";
    var faltanDanzas = g.parts.filter(function (p) { return !p.danzaPresentacion; }).length;

    var fotos = fotosDe(g);
    var galHtml = fotos.map(function (f) {
      var src = "img/galeria/" + f.y + "-" + f.n + ".jpg";
      return '<a href="' + src + '" target="_blank" rel="noopener"><img src="' + src + '" alt="' + esc(g.nombre) + " en " + f.y + '" loading="lazy" style="object-position:' + esc(f.pos) + '"><span>' + f.y + "</span></a>";
    }).join("");
    var enRevista = REVISTAS.filter(function (y) { return fotos.some(function (f) { return f.y === y; }); });

    // Otras agrupaciones del mismo lugar
    var vecinas = all.filter(function (o) { return o !== g && o.parts.length && (o.provincia && o.provincia === g.provincia); })
      .sort(function (a, b) { return b.anios.length - a.anios.length; }).slice(0, 6);

    app.innerHTML =
      '<section class="ag-hero"' + (fotos.length ? ' style="--hero:url(\'img/galeria/' + fotos[0].y + "-" + fotos[0].n + '.jpg\');--hero-pos:' + esc(fotos[0].pos) + '"' : "") + '><a class="ag-back" href="agrupacion.html">← Todas las agrupaciones</a><div class="ag-wrap">' +
      '<div class="ag-crest">' + logoHtml(g) + '</div><div><span class="ag-kicker">Ficha técnica · ' + esc(g.tipo || "Agrupación") + "</span>" +
      "<h1>" + esc(g.nombre) + '</h1><div class="ag-loc">' + esc(lugar(g) || "Procedencia por confirmar") + "</div>" +
      '<div class="ag-badges">' + badges.join("") + "</div>" + (redes ? '<div class="ag-redes">' + redes + "</div>" : "") + "</div></div></section>" +

      '<div class="ag-wrap"><div class="ag-stats">' + stats.map(function (s) { return '<div class="ag-stat"><b>' + s[0] + "</b><span>" + s[1] + "</span></div>"; }).join("") + "</div>" +
      (frases.length ? '<p class="ag-resumen">' + esc(frases.join(" ")) + (totalEd ? " " + esc("Catacaos, Color y Tradición ha realizado " + totalEd + " ediciones.") : "") + "</p>" : "") +

      '<section class="ag-section"><div class="section-heading"><span class="section-kicker">Palmarés</span><h2>Sus podios</h2></div><div class="ag-medals">' + medals + "</div></section>" +

      '<section class="ag-section"><div class="section-heading"><span class="section-kicker">Trayectoria</span><h2>Edición por edición</h2></div>' +
      (tl ? '<ol class="ag-timeline">' + tl + "</ol>" : '<p class="ag-nota">Aún no hay participaciones registradas en el Sheets.</p>') + "</section>" +

      (dz.length ? '<section class="ag-section"><div class="section-heading"><span class="section-kicker">Repertorio</span><h2>Danzas presentadas</h2></div>' + danzasHtml +
        (faltanDanzas ? '<p class="ag-nota">Hay ' + faltanDanzas + (faltanDanzas === 1 ? " participación" : " participaciones") + " sin danza registrada.</p>" : "") + "</section>" : "") +

      (galHtml ? '<section class="ag-section"><div class="section-heading"><span class="section-kicker">Galería</span><h2>En escena</h2></div><div class="ag-gal">' + galHtml + "</div>" +
        (enRevista.length ? '<p class="ag-nota">' + enRevista.map(function (y) { return '<a href="revista.html?e=' + y + '">Ver la revista ' + y + " →</a>"; }).join(" · ") + "</p>" : "") + "</section>" : "") +

      (vecinas.length ? '<section class="ag-section"><div class="section-heading"><span class="section-kicker">También de ' + esc(g.provincia) + '</span><h2>Otras agrupaciones</h2></div><div class="ag-grid">' + vecinas.map(card).join("") + "</div></section>" : "") +
      "</div>";

    // El color del logo solo se usa en detalles (aro del logo y líneas), el resto sigue la paleta del sitio
    colorFromLogo(g.logo, function (c) { if (c) app.style.setProperty("--accent", c); });
    window.scrollTo(0, 0);
  }

  function card(g) {
    var tit = g.titulos.length ? "★ " + g.titulos.length + (g.titulos.length === 1 ? " título" : " títulos") : g.podios ? g.podios + (g.podios === 1 ? " podio" : " podios") : "";
    return '<a class="ag-card" href="agrupacion.html?id=' + encodeURIComponent(g.id) + '"><span class="lg">' + logoHtml(g) + "</span><b>" + esc(g.nombre) + "</b><small>" +
      esc([g.distrito || g.provincia, g.region].filter(Boolean).join(", ")) + "<br>" + g.anios.length + (g.anios.length === 1 ? " edición" : " ediciones") + (g.anios.length ? " · desde " + g.anios[0] : "") + "</small>" +
      (tit ? "<em>" + tit + "</em>" : "") + "</a>";
  }

  function renderDirectorio(all) {
    document.title = "Agrupaciones | Catacaos, Color y Tradición";
    var conPart = all.filter(function (g) { return g.parts.length; });
    var regiones = Array.from(new Set(conPart.map(function (g) { return g.region; }).filter(Boolean))).sort();
    app.innerHTML =
      '<section class="page-hero ag-dir-hero"><div class="page-hero-content"><span>Las selecciones del concurso</span><h1>Agrupaciones</h1>' +
      "<p>Las " + conPart.length + " agrupaciones que han pasado por Catacaos, Color y Tradición. Toca un logo para ver su ficha técnica.</p></div></section>" +
      '<div class="ag-wrap" style="padding-bottom:60px"><div class="ag-tools"><input type="search" id="agQ" placeholder="Buscar por nombre o lugar…" aria-label="Buscar agrupación">' +
      '<select id="agR" aria-label="Filtrar por región"><option value="">Todas las regiones</option>' + regiones.map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("") + "</select>" +
      '<select id="agO" aria-label="Ordenar"><option value="ed">Más ediciones</option><option value="tit">Más títulos</option><option value="az">A–Z</option><option value="new">Más recientes</option></select></div>' +
      '<p class="ag-count" id="agC"></p><div class="ag-grid" id="agG"></div></div>';
    function draw() {
      var q = norm(document.getElementById("agQ").value), r = document.getElementById("agR").value, o = document.getElementById("agO").value;
      var l = conPart.filter(function (g) {
        return (!r || g.region === r) && (!q || norm([g.nombre, g.tipo, g.distrito, g.provincia, g.region].join(" ")).indexOf(q) >= 0);
      }).sort(function (a, b) {
        if (o === "az") return a.nombre.localeCompare(b.nombre, "es");
        if (o === "tit") return b.titulos.length - a.titulos.length || b.podios - a.podios || a.nombre.localeCompare(b.nombre, "es");
        if (o === "new") return b.anios[0] - a.anios[0] || a.nombre.localeCompare(b.nombre, "es");
        return b.anios.length - a.anios.length || b.podios - a.podios || a.nombre.localeCompare(b.nombre, "es");
      });
      document.getElementById("agC").textContent = l.length + (l.length === 1 ? " agrupación" : " agrupaciones");
      document.getElementById("agG").innerHTML = l.map(card).join("");
    }
    ["agQ", "agR", "agO"].forEach(function (id) { document.getElementById(id).addEventListener("input", draw); });
    draw();
  }

  function renderError(msg) {
    app.innerHTML = '<div class="ag-state"><h2 class="section-title">' + esc(msg) + '</h2><p><a href="agrupacion.html">Ver todas las agrupaciones</a></p></div>';
  }

  /* ---------- inicio ---------- */
  if (typeof CCTData === "undefined") return renderError("No se pudo cargar la información.");
  Promise.all([
    CCTData.getAgrupaciones(),
    CCTData.getParticipaciones(),
    CCTData.getEdiciones().catch(function () { return []; }),
    Promise.all(REVISTAS.map(function (y) { return loadScript("data/revista/fotos-" + y + ".js"); }).concat(loadScript("herramientas/sugerencias.js")))
  ]).then(function (r) {
    var all = attach(buildGroups(r[0] || []), r[1] || []);
    var ed = (r[2] || []).filter(function (e) { return !isHidden(e.visible); });
    var id = params.get("id"), lg = params.get("logo");
    if (!id && !lg) return renderDirectorio(all);
    var g = all.find(function (x) { return (id && x.id === id) || (lg && file(x.logo) === file(lg)); });
    if (!g) return renderError("No encontramos esa agrupación.");
    renderFicha(g, all, ed);
  }).catch(function (e) {
    console.error("[Agrupación]", e);
    renderError("No pudimos cargar la ficha. Inténtalo en unos instantes.");
  });
})();
