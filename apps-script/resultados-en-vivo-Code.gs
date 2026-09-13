/**
 * Catacaos, Color y Tradición — Resultados en vivo (Code.gs de referencia)
 * ---------------------------------------------------------
 * Este es el Apps Script INDEPENDIENTE del de Bloque 2 (apps-script/Code.gs).
 * Se usa desde CCYT_API_URL en js/main.js para el sistema de resultados en
 * vivo del día del concurso. Este archivo es solo una COPIA DE REFERENCIA:
 * el código real vive y se implementa desde script.google.com, no desde
 * este repositorio (no hay despliegue automático desde aquí).
 *
 * Caché por fase: mientras una fase (clasificatoria/final de cada hoja)
 * sigue en vivo, se cachea 3s; una vez que TODAS sus filas están
 * realmente terminadas (publicar=SI + estado=Publicado + total<>0),
 * se cachea 300s (5 min) porque ya no va a cambiar.
 */

var CCYT_CACHE_SECONDS_ACTIVO = 3;     // Fase que todavía se está evaluando: caché corta.
var CCYT_CACHE_SECONDS_CERRADO = 300;  // Fase ya publicada por completo: caché larga (5 min).

function doGet(e) {
  if (e && e.parameter && e.parameter.debug === 'cache') {
    return jsonResponse(debugCache());
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cache = CacheService.getScriptCache();

  try {
    const payload = {
      ok: true,
      configuracion: getCachedSimple(cache, 'configuracion', CCYT_CACHE_SECONDS_ACTIVO, function () {
        return readKeyValueSheet(ss, "Configuracion");
      }),
      estado: getCachedSimple(cache, 'estado', CCYT_CACHE_SECONDS_ACTIVO, function () {
        return readKeyValueSheet(ss, "Estado");
      }),
      general: getCachedResultsByFase(cache, ss, 'general', 'General'),
      infantil: getCachedResultsWhole(cache, ss, 'infantil', 'Infantil'),
      caporales: getCachedResultsByFase(cache, ss, 'caporales', 'Caporales'),
      campeones: getCachedResultsWhole(cache, ss, 'campeones', 'Campeones'),
      timestamp: new Date().toISOString()
    };

    return jsonResponse(payload);
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.message
    });
  }
}

/**
 * Caché simple, sin lógica de fases (para Configuracion/Estado: son
 * pequeñas y siempre pueden seguir cambiando durante todo el día).
 */
function getCachedSimple(cache, key, ttl, computeFn) {
  var cacheKey = 'ccyt_' + key;
  var cached = cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  var value = computeFn();
  try {
    cache.put(cacheKey, JSON.stringify(value), ttl);
  } catch (cacheError) {
    // Poco probable ya que son hojas chicas, pero por si acaso no rompe nada.
  }
  return value;
}

/**
 * Para hojas SIN fases (Infantil, Campeones: una sola final cada una).
 * Si todas las filas ya están realmente terminadas, se cachea mucho
 * tiempo porque ya no va a cambiar. Si falta alguna, caché corta.
 */
function getCachedResultsWhole(cache, ss, key, sheetName) {
  var cacheKey = 'ccyt_' + key;
  var cached = cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  var rows = readResultsSheet(ss, sheetName);
  var ttl = allPublished(rows) ? CCYT_CACHE_SECONDS_CERRADO : CCYT_CACHE_SECONDS_ACTIVO;

  try {
    cache.put(cacheKey, JSON.stringify(rows), ttl);
  } catch (cacheError) {
    // Si de todos modos pesa mucho, seguimos sin cachear esta vez.
  }

  return rows;
}

/**
 * Para hojas CON fases (General, Caporales: eliminatorias + final).
 * Cada fase se cachea por separado, con su propio tiempo: larga si
 * esa fase ya está completamente terminada, corta si sigue en vivo.
 */
function getCachedResultsByFase(cache, ss, key, sheetName) {
  var keyClasif = 'ccyt_' + key + '_clasificatoria';
  var keyFinal = 'ccyt_' + key + '_final';

  var cachedClasif = cache.get(keyClasif);
  var cachedFinal = cache.get(keyFinal);

  if (cachedClasif && cachedFinal) {
    return JSON.parse(cachedClasif).concat(JSON.parse(cachedFinal));
  }

  // Si falta cualquiera de las dos partes en caché, se lee la hoja
  // completa una sola vez (no dos), y se separan las fases de ahí.
  var rows = readResultsSheet(ss, sheetName);
  var clasificatoria = rows.filter(function (row) {
    return normalizeValue(row.fase) !== 'FINAL';
  });
  var final = rows.filter(function (row) {
    return normalizeValue(row.fase) === 'FINAL';
  });

  var ttlClasif = allPublished(clasificatoria) ? CCYT_CACHE_SECONDS_CERRADO : CCYT_CACHE_SECONDS_ACTIVO;
  var ttlFinal = allPublished(final) ? CCYT_CACHE_SECONDS_CERRADO : CCYT_CACHE_SECONDS_ACTIVO;

  try {
    cache.put(keyClasif, JSON.stringify(clasificatoria), ttlClasif);
  } catch (cacheError) { /* seguimos sin cachear esta parte */ }

  try {
    cache.put(keyFinal, JSON.stringify(final), ttlFinal);
  } catch (cacheError) { /* seguimos sin cachear esta parte */ }

  return clasificatoria.concat(final);
}

/**
 * Una fila se considera realmente terminada solo si las 3 condiciones
 * se dieron juntas: ya se publicó, el estado quedó "Publicado" y el
 * total ya no es 0. Publicar=SI por sí solo no basta (puede estar SI
 * solo para que el grupo aparezca, antes de tener nota).
 */
function isRowFinished(row) {
  return normalizeValue(row.publicar) === 'SI'
    && normalizeValue(row.estado) === 'PUBLICADO'
    && Number(row.total) !== 0;
}

/**
 * Una fase/hoja se considera "cerrada" (ya no cambia) cuando TODAS
 * sus filas están realmente terminadas. Sin filas, se trata como
 * "en vivo" (caché corta), por si todavía faltan datos por cargar.
 */
function allPublished(rows) {
  if (!rows.length) {
    return false;
  }
  return rows.every(isRowFinished);
}

function debugCache() {
  var cacheDiag = CacheService.getScriptCache();
  var testKey = 'diagnostico_cache_test';
  var testValue = 'valor-' + Date.now();
  cacheDiag.put(testKey, testValue, 30);
  var leido = cacheDiag.get(testKey);
  return {
    escribioYLeyoOk: leido === testValue,
    valorEscrito: testValue,
    valorLeido: leido
  };
}


/* =========================================================
   HOJAS CLAVE / VALOR
========================================================= */

function readKeyValueSheet(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return {};
  }

  const values =
    sheet.getDataRange().getDisplayValues();

  const result = {};

  for (let i = 1; i < values.length; i++) {
    const key = String(values[i][0]).trim();
    const value = values[i][1];

    if (!key) {
      continue;
    }

    result[key] = value;
  }

  return result;
}


/* =========================================================
   HOJAS DE RESULTADOS
========================================================= */

function readResultsSheet(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return [];
  }

  const values =
    sheet.getDataRange().getDisplayValues();

  if (values.length < 2) {
    return [];
  }

  const headers = values[0].map(
    header => normalizeHeader(header)
  );

  const rows = [];

  for (let i = 1; i < values.length; i++) {
    const rawRow = values[i];

    const isEmpty = rawRow.every(
      cell => String(cell).trim() === ""
    );

    if (isEmpty) {
      continue;
    }

    const row = {};

    headers.forEach((header, index) => {
      row[header] =
        String(rawRow[index] ?? "").trim();
    });

    /*
      Nunca enviamos públicamente notas
      que todavía no fueron autorizadas.
    */
    if (
      normalizeValue(row.publicar) !== "SI"
    ) {
      hidePrivateScores(row);
    }

    rows.push(row);
  }

  return rows;
}


function hidePrivateScores(row) {
  [
    "j1",
    "j2",
    "j3",
    "j4",
    "j5",
    "subtotal",
    "penalizacion",
    "total",
    "mensaje"
  ].forEach(key => {
    if (key in row) {
      row[key] = "";
    }
  });

  /*
    Tampoco revelamos anticipadamente
    clasificación o descalificación.
  */
  if ("clasificado" in row) {
    row.clasificado = "";
  }

  if ("descalificado" in row) {
    row.descalificado = "";
  }

  if ("motivo" in row) {
    row.motivo = "";
  }
}


function normalizeHeader(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "_");
}


function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}


function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(
      ContentService.MimeType.JSON
    );
}
