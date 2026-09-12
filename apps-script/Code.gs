/**
 * Catacaos, Color y Tradición — API de datos (Bloque 2)
 * ---------------------------------------------------------
 * Este Apps Script es NUEVO e INDEPENDIENTE del que ya existe para
 * los resultados en vivo del concurso (CCYT_API_URL en js/main.js).
 * No lo reemplaza ni lo toca. Su único trabajo es exponer, en JSON,
 * el contenido de este mismo Sheets (CCT_Base_Datos_Historica) para
 * que el sitio estático lo consuma vía js/data-service.js.
 *
 * Proyecto INDEPENDIENTE (standalone, no vinculado a ningún Sheets):
 * identifica la planilla por su ID en SHEET_ID, así puede crearse
 * directamente en script.google.com sin pasar por "Extensiones > Apps
 * Script" de ningún archivo en particular.
 *
 * Uso: GET <url-del-deploy>?action=NOMBRE_ACCION
 * Acciones disponibles: config, ediciones, participaciones, regiones,
 * ubicaciones, agrupaciones, catalogos, galeria, all
 *
 * Respuesta siempre: { ok: true, data: ... } o { ok: false, error: "..." }
 */

var SHEET_ID = '11lVAP62zBYzlJWpH80mZmIFHQfMEEqH08m0N5tNsKfI'; // CCT_Base_Datos_Historica
var CACHE_SECONDS = 300; // 5 minutos. Bajar a 0 mientras se prueba/depura.

function getSpreadsheet() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'all';
  try {
    var data = getDataForAction(action);
    return jsonOutput({ ok: true, action: action, data: data });
  } catch (err) {
    return jsonOutput({ ok: false, action: action, error: String(err && err.message || err) });
  }
}

function getDataForAction(action) {
  var cache = CacheService.getScriptCache();
  var cacheKey = 'ccyt_' + action;

  if (CACHE_SECONDS > 0) {
    var cached = cache.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }

  var result;
  switch (action) {
    case 'config':          result = getConfig(); break;
    case 'ediciones':       result = getEdiciones(); break;
    case 'participaciones': result = getParticipaciones(); break;
    case 'regiones':        result = getRegiones(); break;
    case 'ubicaciones':     result = getUbicaciones(); break;
    case 'agrupaciones':    result = getAgrupaciones(); break;
    case 'catalogos':       result = getCatalogos(); break;
    case 'galeria':         result = getGaleria(); break;
    case 'all':
      result = {
        config: getConfig(),
        ediciones: getEdiciones(),
        participaciones: getParticipaciones(),
        regiones: getRegiones(),
        ubicaciones: getUbicaciones(),
        agrupaciones: getAgrupaciones(),
        catalogos: getCatalogos(),
        galeria: getGaleria()
      };
      break;
    default:
      throw new Error('Acción desconocida: "' + action + '". Usa una de: config, ediciones, participaciones, regiones, ubicaciones, agrupaciones, catalogos, galeria, all.');
  }

  if (CACHE_SECONDS > 0) {
    try { cache.put(cacheKey, JSON.stringify(result), CACHE_SECONDS); } catch (e2) { /* payload muy grande para cache, se ignora */ }
  }
  return result;
}

/* ============================================================
 * Helpers genéricos de lectura de hojas
 * ============================================================ */

function normalizeHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(new RegExp('[\\u0300-\\u036f]', 'g'), '') // quita tildes
    .replace(/[^a-z0-9]+/g, ''); // quita espacios, puntos, barras, etc.
}

/**
 * Lee una hoja completa y devuelve un array de objetos.
 * keyMap: { headerNormalizado: 'claveDeSalida' }
 * Si una columna no está en keyMap, se ignora (no se incluye en la salida).
 */
function readSheetAsObjects(sheetName, keyMap) {
  var sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('No existe la hoja "' + sheetName + '"');

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0].map(normalizeHeader);
  var colForKey = {}; // claveDeSalida -> índice de columna
  headers.forEach(function (h, i) {
    if (keyMap[h]) colForKey[keyMap[h]] = i;
  });

  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    // saltar filas totalmente vacías
    if (row.join('') === '') continue;

    var obj = {};
    Object.keys(colForKey).forEach(function (outKey) {
      var val = row[colForKey[outKey]];
      obj[outKey] = formatCell(val);
    });
    rows.push(obj);
  }
  return rows;
}

function formatCell(val) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  if (val === '') return null;
  return val;
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ============================================================
 * Un handler por hoja
 * ============================================================ */

function getParticipaciones() {
  return readSheetAsObjects('Participaciones', {
    'ano': 'anio',
    'modalidad': 'modalidad',
    'categoria': 'categoria',
    'agrupacion': 'agrupacion',
    'region': 'region',
    'provincia': 'provincia',
    'distritolocalidad': 'distritoLocalidad',
    'danzapresentacion': 'danzaPresentacion',
    'puesto': 'puesto',
    'campeon': 'campeon',
    'observacion': 'observacion',
    'fuentereferencia': 'fuente'
  });
}

function getEdiciones() {
  return readSheetAsObjects('Ediciones', {
    'ano': 'anio',
    'nombredeedicion': 'nombre',
    'fecha': 'fecha',
    'sede': 'sede',
    'estado': 'estado',
    'modalidadesrealizadas': 'modalidades',
    'categoriasrealizadas': 'categorias',
    'nagrupaciones': 'numAgrupaciones',
    'ndanzantes': 'numDanzantes',
    'publicoestimado': 'publicoEstimado'
  });
}

function getRegiones() {
  return readSheetAsObjects('Regiones', {
    'idmapa': 'idMapa',
    'region': 'region',
    'descripcion': 'descripcion'
  });
}

function getUbicaciones() {
  return readSheetAsObjects('Ubicaciones', {
    'idubicacion': 'idUbicacion',
    'idregion': 'idRegion',
    'region': 'region',
    'provincia': 'provincia',
    'distrito': 'distrito',
    'localidadcentropoblado': 'localidad',
    'nivel': 'nivel',
    'visible': 'visible',
    'orden': 'orden',
    'observacion': 'observacion',
    'fuente': 'fuente'
  });
}

function getAgrupaciones() {
  // Las cabeceras de esta hoja ya son snake_case (id_agrupacion, nombre_oficial, ...),
  // así que se normalizan igual y se mapean 1 a 1 a sí mismas.
  var keyMap = {};
  ['id_agrupacion', 'nombre_oficial', 'nombre_corto', 'id_ubicacion', 'region',
   'provincia', 'distrito', 'localidad', 'tipo_entidad', 'id_agrupacion_madre',
   'logo', 'facebook', 'instagram', 'tiktok', 'web', 'visible', 'observacion', 'fuente'
  ].forEach(function (col) { keyMap[normalizeHeader(col)] = col; });
  return readSheetAsObjects('Agrupaciones', keyMap);
}

function getGaleria() {
  return readSheetAsObjects('Galeria', {
    'ano': 'anio',
    'cantidaddefotos': 'cantidadFotos',
    'visible': 'visible',
    'prefijoruta': 'prefijoRuta',
    'observacion': 'observacion'
  });
}

/**
 * Catalogos no es una tabla de filas: son 5 listas independientes,
 * una por columna (A, C, E, G, I), cada una con su propio encabezado.
 */
function getCatalogos() {
  var sheet = getSpreadsheet().getSheetByName('Catalogos');
  if (!sheet) throw new Error('No existe la hoja "Catalogos"');

  var values = sheet.getDataRange().getValues();
  var columnasPorClave = {
    modalidades: 0,   // columna A
    categorias: 2,    // columna C
    puestos: 4,       // columna E
    estadosEdicion: 6,// columna G
    siNo: 8           // columna I
  };

  var out = {};
  Object.keys(columnasPorClave).forEach(function (clave) {
    var col = columnasPorClave[clave];
    var lista = [];
    for (var r = 1; r < values.length; r++) {
      var val = values[r][col];
      if (val === '' || val === null || val === undefined) continue;
      lista.push(val);
    }
    out[clave] = lista;
  });
  return out;
}

/**
 * ConfiguracionWeb es clave/valor. Se devuelve como objeto plano
 * (fácil de usar: config.estado_evento) y también como lista cruda
 * (por si se necesita mostrar la descripción de cada clave).
 */
function getConfig() {
  var sheet = getSpreadsheet().getSheetByName('ConfiguracionWeb');
  if (!sheet) throw new Error('No existe la hoja "ConfiguracionWeb"');

  var values = sheet.getDataRange().getValues();
  var mapa = {};
  var lista = [];

  for (var r = 1; r < values.length; r++) {
    var clave = values[r][0];
    var valor = values[r][1];
    var descripcion = values[r][2];
    if (clave === '' || clave === null || clave === undefined) continue;

    mapa[clave] = valor;
    lista.push({ clave: clave, valor: valor, descripcion: descripcion });
  }

  return { mapa: mapa, lista: lista };
}
