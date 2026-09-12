/**
 * CCTData — capa de datos única (Bloque 2)
 * ---------------------------------------------------------
 * Envuelve las llamadas a la Apps Script CCT_API_URL (js/config.js)
 * en un solo lugar, con caché simple en memoria, para que ninguna
 * página tenga que hacer fetch() directo ni repetir URLs.
 *
 * IMPORTANTE: por ahora nada usa este archivo todavía. Se conecta
 * página por página en el Bloque 3, una sección a la vez, sin
 * romper lo que ya funciona con datos hardcodeados.
 *
 * Uso previsto:
 *   const ediciones = await CCTData.getEdiciones();
 *   const config    = await CCTData.getConfig();
 *
 * Todas las funciones devuelven una Promise. Si algo falla (red,
 * Apps Script caída, acción inválida), la Promise se rechaza con
 * un Error legible — quien la consuma decide qué mostrar de fallback.
 */

const CCTData = (function () {
  const cache = {}; // { accion: { data, ts } }

  function isFresh(entry) {
    return entry && (Date.now() - entry.ts) < CCT_CACHE_MS;
  }

  async function fetchAction(accion) {
    if (isFresh(cache[accion])) {
      return cache[accion].data;
    }

    if (!CCT_API_URL || CCT_API_URL === "PENDIENTE_DE_DESPLIEGUE") {
      throw new Error(
        "CCT_API_URL todavía no está configurada en js/config.js " +
        "(falta desplegar la Apps Script del Bloque 2)."
      );
    }

    const url = CCT_API_URL + "?action=" + encodeURIComponent(accion);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Error de red pidiendo \"" + accion + "\": HTTP " + res.status);
    }

    const json = await res.json();
    if (!json.ok) {
      throw new Error("La API respondió con error para \"" + accion + "\": " + json.error);
    }

    cache[accion] = { data: json.data, ts: Date.now() };
    return json.data;
  }

  function clearCache(accion) {
    if (accion) {
      delete cache[accion];
    } else {
      Object.keys(cache).forEach(function (k) { delete cache[k]; });
    }
  }

  return {
    getConfig: function ()          { return fetchAction("config"); },
    getEdiciones: function ()       { return fetchAction("ediciones"); },
    getParticipaciones: function () { return fetchAction("participaciones"); },
    getRegiones: function ()        { return fetchAction("regiones"); },
    getUbicaciones: function ()     { return fetchAction("ubicaciones"); },
    getAgrupaciones: function ()    { return fetchAction("agrupaciones"); },
    getCatalogos: function ()       { return fetchAction("catalogos"); },
    getGaleria: function ()         { return fetchAction("galeria"); },
    getAll: function ()             { return fetchAction("all"); },

    // Fuerza volver a pedir algo aunque haya caché vigente (ej. tras editar el Sheets).
    refresh: function (accion) {
      clearCache(accion);
      return fetchAction(accion);
    },
    clearCache: clearCache
  };
})();
