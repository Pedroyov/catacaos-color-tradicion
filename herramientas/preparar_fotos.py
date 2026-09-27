"""
Prepara las fotos de la galería para la herramienta de selección de la revista.

1. Genera miniaturas livianas en img/galeria/mini/ (480 px de lado mayor).
2. Calcula una nota técnica (0-100) por foto: nitidez, exposición y resolución.
   Esto NO mide si la foto es "bonita": solo ayuda a descartar movidas u oscuras.
3. Detecta caras para saber dónde recortar (foco). Si no encuentra cara, busca
   piel en la parte alta; si tampoco, usa 50% 30%. En la herramienta se puede
   corregir a mano haciendo clic sobre la cara.
4. Escribe herramientas/sugerencias.js (lo leen la herramienta y la revista).

Uso (desde la raíz del repo):  python herramientas/preparar_fotos.py [años...]
   ej.: python herramientas/preparar_fotos.py 2024      (solo esa edición)
Requiere: pip install opencv-python numpy
"""
import glob
import json
import os
import re
import sys

import cv2
import numpy as np

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALERIA = os.path.join(RAIZ, "img", "galeria")
MINI = os.path.join(GALERIA, "mini")
SALIDA = os.path.join(RAIZ, "herramientas", "sugerencias.js")
LADO_MINI = 480

os.makedirs(MINI, exist_ok=True)

# ---------- detección de caras ----------
M=os.path.join(RAIZ,'herramientas','modelos')+os.sep
fr=cv2.CascadeClassifier(M+'haarcascade_frontalface_alt2.xml'); pr=cv2.CascadeClassifier(M+'haarcascade_profileface.xml')
def foco(img):
    h,w=img.shape[:2]; s=900/max(h,w); sm=cv2.resize(img,(int(w*s),int(h*s)))
    g=cv2.equalizeHist(cv2.cvtColor(sm,cv2.COLOR_BGR2GRAY)); H,W=g.shape; mn=int(min(H,W)*0.05)
    faces=[]
    for c,flip in ((fr,False),(pr,False),(pr,True)):
        gg=cv2.flip(g,1) if flip else g
        for (x,y,fw,fh) in c.detectMultiScale(gg,1.1,6,minSize=(mn,mn)):
            if flip: x=W-x-fw
            faces.append((x,y,fw,fh))
    if faces:
        # las caras suelen estar arriba: se premia tamaño y altura
        score=lambda f: f[2]*f[3]*(1.6-(f[1]+f[3]/2)/H)**3
        best=max(faces,key=score)
        if (best[1]+best[3]/2)/H < 0.62 or len(faces)==1 and best[2]*best[3] > H*W*0.01:
            return round((best[0]+best[2]/2)/W*100), round((best[1]+best[3]/2)/H*100), 'cara'
    # respaldo: piel en la parte superior
    ycc=cv2.cvtColor(sm,cv2.COLOR_BGR2YCrCb)
    m=cv2.inRange(ycc,(40,138,85),(235,175,130))
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
    m[int(H*0.6):,:]=0
    n,lab,st,cen=cv2.connectedComponentsWithStats(m)
    if n>1:
        # componente más grande, favoreciendo las altas
        best=max(range(1,n),key=lambda i: st[i,4]*(1.4-cen[i][1]/H))
        if st[best,4]>H*W*0.002:
            return round(cen[best][0]/W*100), round(cen[best][1]/H*100), 'piel'
    return 50, 30, 'defecto'


SOLO = set(sys.argv[1:])  # años pedidos (vacío = todos)
fotos = {}
for ruta in glob.glob(os.path.join(GALERIA, "*.*")):
    m = re.match(r"(\d{4})-(\d+)\.(jpe?g|png)$", os.path.basename(ruta), re.I)
    if not m:
        continue
    anio, num, ext = m.group(1), int(m.group(2)), m.group(3).lower()
    if SOLO and anio not in SOLO:
        continue
    img = cv2.imread(ruta)
    if img is None:
        continue
    h, w = img.shape[:2]

    # Miniatura
    esc = LADO_MINI / max(h, w)
    mini = cv2.resize(img, (int(w * esc), int(h * esc)), interpolation=cv2.INTER_AREA) if esc < 1 else img
    ruta_mini = os.path.join(MINI, f"{anio}-{num}.jpg")
    if not os.path.exists(ruta_mini):
        cv2.imwrite(ruta_mini, mini, [cv2.IMWRITE_JPEG_QUALITY, 74])

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

    fx, fy, fk = foco(img)
    fotos.setdefault(anio, []).append({
        "n": num, "w": w, "h": h, "ext": ext, "f": [fx, fy, fk[0]],
        "nit": nitidez, "bri": brillo, "clip": quemado + negro,
    })

# Conserva los años que no se recalcularon
resultado = {}
if SOLO and os.path.exists(SALIDA):
    previo = open(SALIDA, encoding="utf-8").read()
    previo = previo[previo.index("window.CCT_SUGERENCIAS"):]
    resultado = json.loads(previo[previo.index("=") + 1:].strip().rstrip(";"))
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
            "f": f["f"],
        }

with open(SALIDA, "w", encoding="utf-8") as fh:
    fh.write("// Generado por herramientas/preparar_fotos.py — no editar a mano.\n")
    fh.write("// q = nota técnica 0-100 · o = orientación (v/h) · s = top / bajo · f = foco [x%, y%, c=cara p=piel d=defecto]\n")
    fh.write("window.CCT_SUGERENCIAS = ")
    json.dump(resultado, fh, ensure_ascii=False, separators=(",", ":"))
    fh.write(";\n")

print({a: len(v) for a, v in resultado.items()}, "->", SALIDA)
