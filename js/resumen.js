/**
 * Resumen numérico (index.html y ediciones.html) — Bloque 3
 * ---------------------------------------------------------
 * Calcula desde Ediciones y Agrupaciones los números que antes estaban
 * escritos a mano ("5+ ediciones", "35+ agrupaciones", etc.). Si la API
 * falla, no se toca nada y se queda el número estático que ya hay en
 * el HTML.
 */

(function () {
  'use strict';

  function normalize(value) {
    return String(value == null ? '' : value)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim()
      .toLowerCase();
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function plus(n) {
    return n + '+';
  }

  function init() {
    var targets = [
      'stat-ediciones', 'stat-agrupaciones', 'stat-danzantes', 'stat-espectadores',
      'stat-ediciones-doc', 'stat-edicion-especial', 'stat-agrupaciones-ed', 'stat-anio-inicio'
    ];
    var hasTarget = targets.some(function (id) { return document.getElementById(id); });
    if (!hasTarget || typeof CCTData === 'undefined') {
      return;
    }

    Promise.all([
      CCTData.getEdiciones(),
      CCTData.getAgrupaciones()
    ]).then(function (responses) {
      var ediciones = responses[0] || [];
      var agrupaciones = responses[1] || [];

      var finalizadas = ediciones.filter(function (e) {
        return normalize(e.estado) === 'finalizada';
      });

      var edicionesRealizadas = finalizadas.length;

      var edicionesEspeciales = finalizadas.filter(function (e) {
        return normalize(e.nombre).indexOf('especial') !== -1;
      }).length;

      var anios = finalizadas
        .map(function (e) { return Number(e.anio); })
        .filter(function (n) { return !isNaN(n) && n > 0; });
      var anioInicio = anios.length ? Math.min.apply(null, anios) : null;

      var totalDanzantes = finalizadas.reduce(function (sum, e) {
        return sum + (Number(e.numDanzantes) || 0);
      }, 0);

      var totalPublico = finalizadas.reduce(function (sum, e) {
        return sum + (Number(e.publicoEstimado) || 0);
      }, 0);

      var totalAgrupaciones = agrupaciones.filter(function (a) {
        return normalize(a.visible) !== 'no';
      }).length;

      // index.html
      setText('stat-ediciones', plus(edicionesRealizadas));
      setText('stat-agrupaciones', plus(totalAgrupaciones));
      setText('stat-danzantes', plus(totalDanzantes));
      setText('stat-espectadores', plus(totalPublico));

      // ediciones.html
      setText('stat-ediciones-doc', plus(edicionesRealizadas));
      setText('stat-edicion-especial', plus(edicionesEspeciales));
      setText('stat-agrupaciones-ed', plus(totalAgrupaciones));
      if (anioInicio) setText('stat-anio-inicio', String(anioInicio));
    }).catch(function (error) {
      console.error('[Resumen] No se pudo actualizar, se dejan los números estáticos:', error);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
