/**
 * Menú dinámico de Ediciones (Bloque 4)
 * ---------------------------------------------------------
 * Genera el <ul class="dropdown-menu"> del header (lista de años) desde
 * la hoja Ediciones (columna "url"), en vez de tenerlo escrito a mano
 * en cada página. Si la API falla, se deja el menú estático tal cual.
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

  function basePrefix() {
    return /\/ediciones\//.test(window.location.pathname) ? '' : 'ediciones/';
  }

  function labelFor(edition) {
    var anio = String(edition.anio || '').trim();
    if (normalize(edition.estado) === 'proxima') {
      return 'Este Año ' + anio;
    }
    return anio;
  }

  function init() {
    var menu = document.querySelector('.dropdown-menu');
    if (!menu || typeof CCTData === 'undefined') {
      return;
    }

    CCTData.getEdiciones().then(function (ediciones) {
      var rows = (ediciones || [])
        .filter(function (edition) {
          return edition && String(edition.url || '').trim() !== '' && edition.anio;
        })
        .sort(function (a, b) {
          return Number(a.anio) - Number(b.anio);
        });

      if (!rows.length) {
        return;
      }

      var prefix = basePrefix();
      menu.replaceChildren();

      rows.forEach(function (edition) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = prefix + String(edition.url).trim();
        a.textContent = labelFor(edition);
        li.appendChild(a);
        menu.appendChild(li);
      });
    }).catch(function (error) {
      console.error('[Menú ediciones] No se pudo actualizar, se deja el menú estático:', error);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
