/* Contenido editorial de la Revista · Edición 2024
 * ------------------------------------------------------------
 * Aquí se editan los TEXTOS y DATOS de la revista.
 * Las FOTOS de cada grupo salen de data/revista/fotos-2024.js
 * (lo genera herramientas/seleccion-fotos.html → Descargar).
 *
 * Las claves de "grupos" deben ser IGUALES a los nombres de grupo
 * usados en la herramienta de selección de fotos.
 */
window.CCT_REVISTA = window.CCT_REVISTA || {};
window.CCT_REVISTA["2024"] = {
  edicion: 2024,
  numero: "05",
  nombre: "V Concurso de Danzas y Estampas Folclóricas",
  fecha: "20 de octubre de 2024",
  mes: "Octubre 2024",
  lugar: "Catacaos, Piura",
  fotografos: ["JuniorSilva Fotógrafo", "Jhonytimana Fotógrafo"],

  portada: {
    foto: 13,
    titular: "Sentimiento y Corazón",
    antetitulo: "Bicampeones",
    lineas: [
      { k: "La final más reñida", t: "Un empate en 290 puntos que decidió el jurado" },
      { k: "Estreno", t: "Nace la categoría infantil" },
      { k: "Las selecciones", t: "Fichas, fotos y cifras de cada agrupación" }
    ]
  },

  editorial: {
    titulo: "Una edición que siguió creciendo",
    foto: 70,
    texto: [
      "La quinta edición de Catacaos, Color y Tradición reunió a veinte agrupaciones llegadas de Piura, Sullana, Talara, Paita, Sechura y, por primera vez, de Chimbote. Treinta danzas repartidas en tres bloques clasificatorios convirtieron el 20 de octubre en una de las jornadas más largas y exigentes de la historia del concurso.",
      "Fue también el año en que los más pequeños subieron al escenario con categoría propia, y el año de una final que nadie olvidará: dos agrupaciones empatadas en lo más alto y un jurado obligado a decidir por unanimidad.",
      "Estas páginas guardan lo que pasó. Los trajes, los rostros, los números y los nombres de quienes hicieron de esta edición una fiesta."
    ],
    firma: "Organización · Catacaos, Color y Tradición"
  },

  cifras: {
    foto: 42,
    items: [
      { n: "20", t: "agrupaciones" },
      { n: "30", t: "danzas en competencia" },
      { n: "3", t: "bloques clasificatorios" },
      { n: "9", t: "finalistas" },
      { n: "8", t: "danzas infantiles" },
      { n: "290", t: "puntos: el tope de la final" }
    ]
  },

  cronicas: [
    {
      seccion: "Gran final",
      titulo: "Una final para el recuerdo",
      foto: 162,
      bajada: "Nueve danzas, tres jurados y un empate en la cima.",
      texto: [
        "La gran final reunió a las nueve mejores danzas de los tres bloques. Desde la primera presentación quedó claro que la diferencia se mediría en décimas: ninguna finalista bajó de los 283 puntos.",
        "Sentimiento y Corazón, con su Morenada Puneña, y Mamá Gusti, con el Carnaval de Opancca, cerraron empatados con 290. Por decisión unánime del jurado, el título fue para Sentimiento y Corazón, su segundo campeonato. Tierra de Sol completó el podio con el Quiullo de Chauca, a un solo punto."
      ]
    },
    {
      seccion: "Estreno",
      titulo: "Nace la categoría infantil",
      fotoExterna: "img/ediciones/pasacallei-2024.jpg",
      bajada: "El folclore también se vive con pasión desde temprana edad.",
      texto: [
        "La gran novedad del 2024 fue la categoría Infantil. Ocho danzas interpretadas por niños y niñas abrieron la tarde antes de la final general, y el público respondió como si fuera la final misma.",
        "Sentimiento MG se quedó con el primer lugar con Pastorcitas de Colán; Corazón Costumbrista e I.E.P. Isaac Newton completaron el podio. Tierra de Sol Kids fue reconocida como Grupo Revelación."
      ]
    }
  ],

  bloques: [
    { id: "A", filas: [
      ["Tierra de Sol", "Quiullo de Chauca", 258, true],
      ["Mamá Gusti", "Fiesta Patronal de Pundín", 256, true],
      ["Perú Ritmo y Color", "Diablicos de Huancabamba", 256, true],
      ["Tusuy Tusuq", "Carnaval de Totos", 254, false],
      ["Pasión Folclórica", "Santa Cruz de Layme", 248, false],
      ["Latidos del Alma", "Torollay Pukllay", 247, false]
    ]},
    { id: "B", filas: [
      ["Sentimiento y Corazón", "Morenada Puneña", 257, true],
      ["Maya", "Carnaval de Socos", 255, true],
      ["Llaqtaymanta Perú", "Huaquillas de Matacoto", 254, true],
      ["Identidad Cultural", "Carnaval de Socos", 252, false],
      ["Warma Kuyay", "Carnaval de Secclla", 252, false],
      ["Raíces Sechuranas", "Papa Tarpuy", 244, false]
    ]},
    { id: "C", filas: [
      ["Llaqtaymanta Perú", "Incas de Cusca", 258, true],
      ["Maya", "Contradanza", 258, true],
      ["Mamá Gusti", "Carnaval de Opancca", 257, true],
      ["Sentimiento y Corazón", "Shajshas de Aco", 255, false],
      ["Tusuy Tusuq", "Fiesta Patronal de Pundín", 252, false],
      ["Nina Tusuq", "Carnaval de Occollo", 249, false]
    ]}
  ],

  final: [
    ["Sentimiento y Corazón", "Morenada Puneña", 290, "1°"],
    ["Mamá Gusti", "Carnaval de Opancca", 290, "2°"],
    ["Tierra de Sol", "Quiullo de Chauca", 289, "3°"],
    ["Maya", "Contradanza", 288, "4°"],
    ["Llaqtaymanta Perú", "Incas de Cusca", 287, "5°"],
    ["Mamá Gusti", "Fiesta Patronal de Pundín", 286, ""],
    ["Llaqtaymanta Perú", "Huaquillas de Matacoto", 286, ""],
    ["Maya", "Carnaval de Socos", 286, ""],
    ["Perú Ritmo y Color", "Diablicos de Huancabamba", 283, ""]
  ],
  notaFinal: "Sentimiento y Corazón y Mamá Gusti empataron en 290 puntos; el jurado definió el primer lugar por unanimidad.",

  aperturaSelecciones: { foto: 31, titulo: "Las selecciones", bajada: "Cada agrupación, su historia en esta edición." },

  /* Orden en que aparecen las secciones de grupo */
  orden: [
    "A.F. Sentimiento y Corazón", "C.C. Mamá Gusti", "E.C.M. Tierra de Sol", "A.C. Maya",
    "C.I.D.F.C. Llaqtaymanta Perú", "E.C.F. Tusuy Tusuq", "G.F. Latidos del Alma", "A.F. Nina Tusuq",
    "E.C. Perú Ritmo y Color", "E.C. Pasión Folclórica", "A.F. Identidad Cultural",
    "Academia de Danzas Warma Kuyay", "A.F. Raíces Sechuranas",
    "A.F. Sentimiento MG — Pastorcitas de Colán", "G.F. Corazón Costumbrista — Cofradía de San Miguel",
    "I.E.P. Isaac Newton — Llamichus de Chuñoq", "Corazón Costumbrista Kids — Navidad de Chiwa",
    "G.F. Sentimiento Cataquense — Carnaval de Culluchaca", "Maya Kids — Qashwa de Viracochan",
    "Talento Cultural — Cañeros de San Jacinto", "Tierra de Sol Kids — Entrada de San Miguel"
  ],

  grupos: {
    "A.F. Sentimiento y Corazón": {
      nombre: "Sentimiento y Corazón", tipo: "Agrupación Folclórica", localidad: "La Unión, Piura",
      categoria: "Mayores", logo: "img/grupos/sentimiento-y-corazon.png", color: "#c8302a", foco: "50% 30%",
      resultado: "Campeón", puesto: 1,
      danzas: [
        { nombre: "Morenada Puneña", bloque: "B", puntaje: 257, final: 290 },
        { nombre: "Shajshas de Aco", bloque: "C", puntaje: 255 }
      ],
      premios: ["Mejor danzante masculino: Bryan Alexander Suarez Alvarez", "Mejor danzante femenino: Mercy Morales Ipanaque"],
      dato: "Con este título suma su segundo campeonato e iguala a Tierra de Sol como la agrupación más ganadora del concurso."
    },
    "C.C. Mamá Gusti": {
      nombre: "Mamá Gusti", tipo: "Centro Cultural", localidad: "Sullana",
      categoria: "Mayores", logo: "img/grupos/mama-gusti.jpg", color: "#d6246e", foco: "50% 40%",
      resultado: "Subcampeón", puesto: 2,
      danzas: [
        { nombre: "Carnaval de Opancca", bloque: "C", puntaje: 257, final: 290 },
        { nombre: "Fiesta Patronal de Pundín", bloque: "A", puntaje: 256, final: 286 }
      ],
      premios: [],
      dato: "Metió sus dos danzas en la final y llegó a 290 puntos, empatada con el campeón."
    },
    "E.C.M. Tierra de Sol": {
      nombre: "Tierra de Sol", tipo: "Embajada Cultural Municipal", localidad: "Pueblo Nuevo de Colán, Paita",
      categoria: "Mayores", logo: "img/grupos/tierra-de-sol.jpg", color: "#e39b00", foco: "50% 30%",
      resultado: "Tercer lugar", puesto: 3,
      danzas: [{ nombre: "Quiullo de Chauca", bloque: "A", puntaje: 258, final: 289 }],
      premios: ["Mejor pasacalle"],
      dato: "Volvió a competir tras cinco años de ausencia; su última participación había sido en 2019."
    },
    "A.C. Maya": {
      nombre: "Maya", tipo: "Asociación Cultural", localidad: "Salitral, Sullana",
      categoria: "Mayores", logo: "img/grupos/maya.jpg", color: "#4a4fc4", foco: "50% 50%",
      resultado: "Cuarto lugar", puesto: 4,
      danzas: [
        { nombre: "Contradanza", bloque: "C", puntaje: 258, final: 288 },
        { nombre: "Carnaval de Socos", bloque: "B", puntaje: 255, final: 286 }
      ],
      premios: ["Mejor barra"],
      dato: "Clasificó sus dos danzas a la final y su barra fue premiada como la mejor de la edición."
    },
    "C.I.D.F.C. Llaqtaymanta Perú": {
      nombre: "Llaqtaymanta Perú", tipo: "Centro de Investigación y Difusión Folclórica Cultural", localidad: "Chimbote, Áncash",
      categoria: "Mayores", logo: "img/grupos/Llaqtaymanta-Peru.jpg", color: "#1592c8", foco: "50% 30%",
      resultado: "Quinto lugar", puesto: 5,
      danzas: [
        { nombre: "Incas de Cusca", bloque: "C", puntaje: 258, final: 287 },
        { nombre: "Huaquillas de Matacoto", bloque: "B", puntaje: 254, final: 286 }
      ],
      premios: [],
      dato: "Primera vez que Chimbote estuvo representado en el concurso, y llegó con dos danzas a la final."
    },
    "E.C.F. Tusuy Tusuq": {
      nombre: "Tusuy Tusuq", tipo: "Embajada Cultural Folclórica", localidad: "Talara",
      categoria: "Mayores", logo: "img/grupos/tusuy-tusuq.jpg", color: "#1f63c7", foco: "50% 35%",
      resultado: "Fase de grupos",
      danzas: [
        { nombre: "Carnaval de Totos", bloque: "A", puntaje: 254 },
        { nombre: "Fiesta Patronal de Pundín", bloque: "C", puntaje: 252 }
      ],
      premios: [], dato: ""
    },
    "G.F. Latidos del Alma": {
      nombre: "Latidos del Alma", tipo: "Grupo Folclórico", localidad: "Catacaos",
      categoria: "Mayores", logo: "img/grupos/latidos-alma.jpg", color: "#e0691f", foco: "50% 40%",
      resultado: "Fase de grupos",
      danzas: [{ nombre: "Torollay Pukllay", bloque: "A", puntaje: 247 }],
      premios: [], dato: "Una de las cuatro agrupaciones de Catacaos en competencia: récord para el distrito."
    },
    "A.F. Nina Tusuq": {
      nombre: "Nina Tusuq", tipo: "Asociación Folclórica", localidad: "Paita",
      categoria: "Mayores", logo: "img/grupos/nina-tusuq.jpg", color: "#7a3db0", foco: "50% 35%",
      resultado: "Fase de grupos",
      danzas: [{ nombre: "Carnaval de Occollo", bloque: "C", puntaje: 249 }],
      premios: [], dato: ""
    },
    "E.C. Perú Ritmo y Color": {
      nombre: "Perú Ritmo y Color", tipo: "Embajada Cultural", localidad: "Loma Negra, La Arena",
      categoria: "Mayores", logo: "img/grupos/peru-ritmo-color.jpg", color: "#b8322a",
      resultado: "Finalista", danzas: [{ nombre: "Diablicos de Huancabamba", bloque: "A", puntaje: 256, final: 283 }], premios: []
    },
    "E.C. Pasión Folclórica": {
      nombre: "Pasión Folclórica", tipo: "Elenco Cultural", localidad: "Molino Azul, Catacaos",
      categoria: "Mayores", logo: "img/grupos/pas-folk.jpg", color: "#8a2b2b",
      resultado: "Fase de grupos", danzas: [{ nombre: "Santa Cruz de Layme", bloque: "A", puntaje: 248 }], premios: []
    },
    "A.F. Identidad Cultural": {
      nombre: "Identidad Cultural", tipo: "Agrupación Folclórica", localidad: "San Vicente de Piedra Rodada",
      categoria: "Mayores", logo: "img/grupos/identidad-cultural.jpg", color: "#2a7a4b",
      resultado: "Fase de grupos", danzas: [{ nombre: "Carnaval de Socos", bloque: "B", puntaje: 252 }], premios: []
    },
    "Academia de Danzas Warma Kuyay": {
      nombre: "Warma Kuyay", tipo: "Academia de Danzas", localidad: "Catacaos",
      categoria: "Mayores", logo: "img/grupos/warma-kuyay.jpg", color: "#a8741a",
      resultado: "Fase de grupos", danzas: [{ nombre: "Carnaval de Secclla", bloque: "B", puntaje: 252 }], premios: []
    },
    "A.F. Raíces Sechuranas": {
      nombre: "Raíces Sechuranas", tipo: "Agrupación Folclórica", localidad: "Sechura",
      categoria: "Mayores", logo: "img/grupos/raices-sechuranas.jpg", color: "#1d6f8a",
      resultado: "Fase de grupos", danzas: [{ nombre: "Papa Tarpuy", bloque: "B", puntaje: 244 }], premios: []
    },
    "A.F. Sentimiento MG — Pastorcitas de Colán": {
      nombre: "Sentimiento MG", tipo: "Agrupación Folclórica", localidad: "Sullana", categoria: "Infantil",
      logo: "img/grupos/sentimiento-MG.jpg", color: "#c8302a", resultado: "Campeón infantil", puesto: 1,
      danzas: [{ nombre: "Pastorcitas de Colán", puntaje: 253 }],
      premios: ["Mejor danzante infantil masculino: Liam Alessandro Querevalu Imán", "Mejor danzante infantil femenino: Zaida Zofia Luzardo Navarro"]
    },
    "G.F. Corazón Costumbrista — Cofradía de San Miguel": {
      nombre: "Corazón Costumbrista", tipo: "Grupo Folclórico", localidad: "La Unión", categoria: "Infantil",
      logo: "img/grupos/corazon-costumbrista.jpg", color: "#b0327a", resultado: "Segundo lugar infantil", puesto: 2,
      danzas: [{ nombre: "Cofradía de San Miguel", puntaje: 252 }], premios: []
    },
    "I.E.P. Isaac Newton — Llamichus de Chuñoq": {
      nombre: "I.E.P. Isaac Newton", tipo: "Institución Educativa", localidad: "Piura", categoria: "Infantil",
      logo: "img/grupos/issac-newton.jpg", color: "#1f4f9c", resultado: "Tercer lugar infantil", puesto: 3,
      danzas: [{ nombre: "Llamichus de Chuñoq", puntaje: 252 }], premios: ["Mejor pasacalle infantil"]
    },
    "Corazón Costumbrista Kids — Navidad de Chiwa": {
      nombre: "Corazón Costumbrista Kids", tipo: "Grupo Folclórico", localidad: "La Unión", categoria: "Infantil",
      logo: "img/grupos/corazon-costumbrista.jpg", color: "#b0327a", resultado: "Participante",
      danzas: [{ nombre: "Navidad de Chiwa", puntaje: 252 }], premios: []
    },
    "G.F. Sentimiento Cataquense — Carnaval de Culluchaca": {
      nombre: "Sentimiento Cataquense", tipo: "Grupo Folclórico", localidad: "Catacaos", categoria: "Infantil",
      logo: "img/grupos/sentimiento-cataquense.jpg", color: "#2a6f3f", resultado: "Participante",
      danzas: [{ nombre: "Carnaval de Culluchaca", puntaje: 251 }], premios: []
    },
    "Maya Kids — Qashwa de Viracochan": {
      nombre: "Maya Kids", tipo: "Asociación Cultural", localidad: "Salitral, Sullana", categoria: "Infantil",
      logo: "img/grupos/maya.jpg", color: "#4a4fc4", resultado: "Participante",
      danzas: [{ nombre: "Qashwa de Viracochan", puntaje: 250 }], premios: []
    },
    "Talento Cultural — Cañeros de San Jacinto": {
      nombre: "Talento Cultural", tipo: "Agrupación", localidad: "", categoria: "Infantil",
      logo: "", color: "#7a5a2a", resultado: "Participante",
      danzas: [{ nombre: "Cañeros de San Jacinto", puntaje: 247 }], premios: []
    },
    "Tierra de Sol Kids — Entrada de San Miguel": {
      nombre: "Tierra de Sol Kids", tipo: "Embajada Cultural Municipal", localidad: "Pueblo Nuevo de Colán", categoria: "Infantil",
      logo: "img/grupos/tierra-de-sol.jpg", color: "#e39b00", resultado: "Grupo revelación",
      danzas: [{ nombre: "Entrada de San Miguel", puntaje: 255 }], premios: ["Grupo revelación"],
      dato: "Obtuvo el puntaje más alto de la categoría (255), pero no entró en la calificación final por motivos reglamentarios."
    }
  },

  honor: {
    foto: "img/ediciones/mdm-2024.jpg",
    podio: [
      { puesto: "Campeón", grupo: "Sentimiento y Corazón" },
      { puesto: "Segundo lugar", grupo: "Mamá Gusti" },
      { puesto: "Tercer lugar", grupo: "Tierra de Sol" }
    ],
    podioInfantil: [
      { puesto: "Campeón", grupo: "Sentimiento MG" },
      { puesto: "Segundo lugar", grupo: "Corazón Costumbrista" },
      { puesto: "Tercer lugar", grupo: "I.E.P. Isaac Newton" }
    ],
    distinciones: [
      ["Mejor danzante masculino", "Bryan Alexander Suarez Alvarez", "Sentimiento y Corazón"],
      ["Mejor danzante femenino", "Mercy Morales Ipanaque", "Sentimiento y Corazón"],
      ["Mejor danzante infantil masc.", "Liam Alessandro Querevalu Imán", "Sentimiento MG"],
      ["Mejor danzante infantil fem.", "Zaida Zofia Luzardo Navarro", "Sentimiento MG"],
      ["Mejor pasacalle", "Tierra de Sol", ""],
      ["Mejor pasacalle infantil", "I.E.P. Isaac Newton", ""],
      ["Mejor barra", "Maya", ""],
      ["Grupo revelación", "Tierra de Sol Kids", ""]
    ]
  },

  jurado: {
    foto: 128,
    pie: "José Rojas, jurado 2, durante la final.",
    miembros: ["Uriel Delgado", "José Rojas", "Hiraldo Damián"]
  },

  curiosidades: [
    ["Un desempate histórico", "El primer lugar se definió por decisión unánime del jurado tras un empate en 290 puntos."],
    ["Récord para Catacaos", "Por primera vez, cuatro agrupaciones de Catacaos compitieron en una misma edición."],
    ["Debut de Chimbote", "Llaqtaymanta Perú llevó por primera vez a Chimbote al concurso."],
    ["Ocho debutantes", "Ocho agrupaciones participaron por primera vez."],
    ["El regreso de Tierra de Sol", "Volvió tras cinco años y terminó en el podio."],
    ["Segundo título", "Sentimiento y Corazón iguala a Tierra de Sol con dos campeonatos."]
  ],

  galeria: { titulo: "Instantes", fotos: [109, 112, 119, 122, 135, 110] },
  blancoYNegro: { titulo: "En blanco y negro", fotos: [113, 116, 111, 157] },

  contraportada: { foto: 160, texto: "Nos vemos en la próxima edición." }
};
