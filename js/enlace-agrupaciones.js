/* =========================================================
 * Logos clicables → ficha técnica de la agrupación
 * ---------------------------------------------------------
 * Cualquier <img> cuyo src esté en img/grupos/ lleva a
 * agrupacion.html?logo=<archivo>. Funciona también con logos
 * que se dibujan después (palmarés, ganadores, etc.).
 * Basta con incluir este script en la página.
 * ========================================================= */
(function () {
  "use strict";

  function isLogo(el) {
    return el && el.tagName === "IMG" && /\/img\/grupos\/[^/?#]+$/i.test(el.src) && !el.closest("a, button");
  }
  function urlFor(img) {
    var parts = img.src.split(/\/img\/grupos\//i);
    return parts[0] + "/agrupacion.html?logo=" + encodeURIComponent(decodeURIComponent(parts[1]));
  }
  function mark(img) {
    if (img.dataset.agLink) return;
    img.dataset.agLink = "1";
    img.setAttribute("role", "link");
    img.setAttribute("tabindex", "0");
    if (!img.title) img.title = "Ver ficha técnica" + (img.alt && !/^(agrupaci[oó]n|campe[oó]n|.*lugar)$/i.test(img.alt) ? " de " + img.alt.replace(/^Logo de /i, "") : "");
  }
  function scan(root) {
    (root.querySelectorAll ? root.querySelectorAll("img") : []).forEach(function (img) { if (isLogo(img)) mark(img); });
  }

  var st = document.createElement("style");
  st.textContent = "img[data-ag-link]{cursor:pointer;transition:transform .2s, box-shadow .2s}" +
    "img[data-ag-link]:hover{transform:scale(1.05)}" +
    "img[data-ag-link]:focus-visible{outline:3px solid #e7c77a;outline-offset:3px}";
  document.head.appendChild(st);

  document.addEventListener("click", function (e) {
    var img = e.target;
    if (!isLogo(img)) return;
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) window.open(urlFor(img), "_blank");
    else location.href = urlFor(img);
  });
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && isLogo(e.target)) { e.preventDefault(); location.href = urlFor(e.target); }
  });

  function start() {
    scan(document);
    if ("MutationObserver" in window) {
      new MutationObserver(function (ms) {
        ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { if (isLogo(n)) mark(n); else scan(n); } }); });
      }).observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
