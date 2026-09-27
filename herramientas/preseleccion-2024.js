// Preselección hecha a ojo por Claude revisando las 162 fotos de 2024.
// Es solo una propuesta: en la herramienta todo se puede cambiar.
//
// estrellas: 3 = de revista (portada / apertura de sección), 2 = buena, 1 = relleno.
// dudosas:   torcidas, lejanas, movidas o repetidas → probablemente no entren.
// familias:  fotos con el MISMO vestuario, seguramente del mismo grupo/danza.
//            Tú decides a qué agrupación corresponde cada familia.
window.CCT_PRESELECCION = window.CCT_PRESELECCION || {};
window.CCT_PRESELECCION["2024"] = {
  portada: [70, 31, 42, 13, 162, 160],
  estrellas: {
    3: [9, 13, 18, 19, 27, 31, 32, 42, 45, 48, 50, 69, 70, 78, 91, 93, 102, 108, 109, 110,
        112, 113, 119, 122, 135, 137, 142, 145, 153, 160, 162],
    2: [3, 5, 10, 17, 25, 26, 29, 30, 39, 52, 56, 64, 71, 72, 74, 75, 84, 86, 92, 95, 98,
        105, 116, 118, 124, 131, 132, 136, 138, 141, 146, 147, 152, 154, 158, 161]
  },
  dudosas: [8, 20, 23, 36, 57, 59, 63, 80, 81, 85, 89, 96],
  especiales: {
    detalle: [114],
    jurado: [128],
    blancoYNegro: [111, 113, 116, 157]
  },
  familias: [
    { id: "A", nombre: "Máscaras de diablo y polleras cortas brillantes", fotos: [3, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 110] },
    { id: "B", nombre: "Máscaras de hilos, trajes negro y rojo", fotos: [33, 34, 35, 148, 149, 150, 152, 154, 155, 156] },
    { id: "C", nombre: "Pollera roja y azul, sombrero negro, cencerro", fotos: [1, 2, 5, 9, 12, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 115, 117, 120, 122, 123] },
    { id: "D", nombre: "Pollera negra, cántaros y papas (letrero 'San Juan de Chauca')", fotos: [7, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107] },
    { id: "E", nombre: "Sombreros de paja, ponchos verdes, vestidos turquesa y rosa", fotos: [4, 6, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147] },
    { id: "F", nombre: "Pompones de colores, polleras verdes y blancas", fotos: [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 118] },
    { id: "G", nombre: "Infantil en azul (varias de noche)", fotos: [78, 79, 80, 81, 82, 83] },
    { id: "H", nombre: "Chalecos negros y polleras bordadas", fotos: [84, 85, 86, 87, 88, 89, 90] },
    { id: "I", nombre: "Danzantes de tijeras / penachos de plumas", fotos: [10, 131, 132, 133] },
    { id: "J", nombre: "Mantones dorados y celestes, bombín", fotos: [109, 111, 112, 153, 162] },
    { id: "K", nombre: "Ponchos multicolor a rayas", fotos: [119, 121, 124, 126, 129] },
    { id: "L", nombre: "Infantil colorido (amarillo, celeste, lila)", fotos: [157, 158, 159, 160] },
    { id: "?", nombre: "Sin familia clara", fotos: [8, 11, 108, 113, 114, 116, 125, 127, 128, 130, 151, 161] }
  ]
};
