"""
Prepara las fotos de la galería para la herramienta de selección de la revista.

1. Genera miniaturas livianas en img/galeria/mini/ (480 px de lado mayor).
2. Calcula una nota técnica (0-100) por foto: nitidez, exposición y resolución.
   Esto NO mide si la foto es "bonita": solo ayuda a descartar movidas u oscuras.
3. Escribe herramientas/sugerencias.js, que lee herramientas/seleccion-fotos.html.

Uso (desde la raíz del repo):  python herramientas/preparar_fotos.py
Requiere: pip install opencv-python numpy
"""
import glob
import json
import os
import re

import cv2
import numpy as np

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALERIA = os.path.join(RAIZ, "img", "galeria")
MINI = os.path.join(GALERIA, "mini")
SALIDA = os.path.join(RAIZ, "herramientas", "sugerencias.js")
LADO_MINI = 480

os.makedirs(MINI, exist_ok=True)

fotos = {}
for ruta in glob.glob(os.path.join(GALERIA, "*.*")):
    m = re.match(r"(\d{4})-(\d+)\.(jpe?g|png)$", os.path.basename(ruta), re.I)
    if not m:
        continue
    anio, num, ext = m.group(1), int(m.group(2)), m.group(3).lower()
    img = cv2.imread(ruta)
    if img is None:
        continue
    h, w = img.shape[:2]

    # Miniatura
    esc = LADO_MINI / max(h, w)
    mini = cv2.resize(img, (int(w * esc), int(h * esc)), interpolation=cv2.INTER_AREA) if esc < 1 else img
    cv2.imwrite(os.path.join(MINI, f"{anio}-{num}.jpg"), mini, [cv2.IMWRITE_JPEG_QUALITY, 74])

    # Métricas sobre versión de 1000 px
    esc2 = min(1.0, 1000 / max(h, w))
    peq = cv2.resize(img, (int(w * esc2), int(h * esc2)), interpolation=cv2.INTER_AREA)
    gris = cv2.cvtColor(peq, cv2.COLOR_BGR2GRAY)
    # Nitidez de la ZONA más nítida (no de toda la foto): así un retrato con
    # fondo desenfocado —muy de revista— no se castiga.
    lap = cv2.Laplacian(gris, cv2.CV_64F)
    th, tw = lap.shape[0] // 5, lap.shape[1] // 5
    tiles = [lap[y:y + th, x:x + tw].var() for y in range(0, th * 5, th) for x in range(0, tw * 5, tw)]
    nitidez = float(np.percentile(tiles, 90))
    brillo = float(gris.mean()) / 255
    quemado = float((gris > 250).mean())
    negro = float((gris < 8).mean())

    fotos.setdefault(anio, []).append({
        "n": num, "w": w, "h": h, "ext": ext,
        "nit": nitidez, "bri": brillo, "clip": quemado + negro,
    })

resultado = {}
for anio, lista in fotos.items():
    nits = np.array([f["nit"] for f in lista])
    lognits = np.log1p(nits)
    lo, hi = np.percentile(lognits, 5), np.percentile(lognits, 95)
    for f in lista:
        s_nit = np.clip((np.log1p(f["nit"]) - lo) / max(hi - lo, 1e-6), 0, 1)
        s_exp = 1 - min(abs(f["bri"] - 0.47) / 0.35, 1)
        s_clip = 1 - min(f["clip"] / 0.15, 1)
        s_res = min(max(f["w"], f["h"]) / 2000, 1)
        f["score"] = round(100 * (0.55 * s_nit + 0.2 * s_exp + 0.15 * s_clip + 0.1 * s_res))
    orden = sorted(lista, key=lambda f: -f["score"])
    corte_top = max(1, round(len(orden) * 0.3))
    corte_bajo = round(len(orden) * 0.85)
    resultado[anio] = {}
    for i, f in enumerate(orden):
        resultado[anio][f["n"]] = {
            "ext": f["ext"],
            "o": "v" if f["h"] > f["w"] else "h",
            "q": f["score"],
            "s": "top" if i < corte_top else ("bajo" if i >= corte_bajo else ""),
        }

with open(SALIDA, "w", encoding="utf-8") as fh:
    fh.write("// Generado por herramientas/preparar_fotos.py — no editar a mano.\n")
    fh.write("// q = nota técnica 0-100 · o = orientación (v/h) · s = top / bajo\n")
    fh.write("window.CCT_SUGERENCIAS = ")
    json.dump(resultado, fh, ensure_ascii=False, separators=(",", ":"))
    fh.write(";\n")

print({a: len(v) for a, v in resultado.items()}, "->", SALIDA)
