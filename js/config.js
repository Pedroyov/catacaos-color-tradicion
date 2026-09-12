/**
 * Configuración compartida del sitio (Bloque 2).
 *
 * Este archivo NO sustituye a CCYT_API_URL (js/main.js), que sigue
 * siendo la Apps Script de resultados en vivo del concurso.
 * CCT_API_URL es una Apps Script nueva y separada: solo sirve datos
 * históricos/de catálogo (Participaciones, Ediciones, Regiones,
 * Ubicaciones, Agrupaciones, Catalogos, ConfiguracionWeb, Galeria).
 *
 * Nada en el sitio usa todavía este archivo (se conecta en el Bloque 3).
 * Cargarlo hoy no cambia nada de lo que ve el público.
 */

const CCT_API_URL = "https://script.google.com/macros/s/AKfycbwlKxTUIuuilEjDr7ToKwf0RNBQCRObt0NzLBnRYeeF-4d1e9BH9x-BNxATn3EXV_Y/exec";

// Cuánto tiempo (en milisegundos) se reutiliza en el navegador una
// respuesta ya pedida antes de volver a pedirla. Ver js/data-service.js.
const CCT_CACHE_MS = 5 * 60 * 1000; // 5 minutos
