"use strict";

/*
|--------------------------------------------------------------------------
| Datos históricos por región
|--------------------------------------------------------------------------
|
| El valor "id" debe coincidir con el id de la región dentro del SVG.
| Por ejemplo:
|
| <path id="piura" ...>
| <path id="la-libertad" ...>
|
*/

/*
 * Datos de respaldo (Bloque 3): si la API de datos (Bloque 2) no responde
 * por cualquier motivo, la página sigue funcionando con esta copia fija
 * en vez de romperse. En condiciones normales, `regiones` se reemplaza
 * por datos frescos calculados desde Participaciones + Regiones
 * (ver computeRegionesFromApi más abajo).
 */
const REGIONES_FALLBACK = {
  "PE-PIU": {
    nombre: "Piura",

    descripcion:
      "Región anfitriona y con mayor presencia histórica en Catacaos, Color y Tradición.",

    provincias: [
      "Piura",
      "Paita",
      "Sullana",
      "Sechura",
      "Morropón",
      "Talara"
    ],

    agrupaciones: [
      {
        nombre: "G.F. Así Baila Mi Perú",
        provincia: "Sechura",
        participaciones: 2,
        titulos: 0,
        anios: ["2017", "2020"]
      },
      {
        nombre: "A.F. Sentimiento y Corazón",
        provincia: "Piura",
        localidad: "La Unión",
        participaciones: 5,
        titulos: 2,
        anios: ["2017", "2018", "2019", "2023", "2024"]
      },
      {
        nombre: "A.F. El Arte de Danzar",
        provincia: "Piura",
        localidad: "Catacaos",
        participaciones: 1,
        titulos: 0,
        anios: ["2017"]
      },
      {
        nombre: "B.F. Raymi Danzas",
        provincia: "Piura",
        localidad: "Castilla",
        participaciones: 3,
        titulos: 0,
        anios: ["2017", "2018", "2019"]
      },
      {
        nombre: "E.C.M. Tierra de Sol",
        provincia: "Paita",
        localidad: "Pueblo Nuevo de Colán",
        participaciones: 4,
        titulos: 2,
        anios: ["2017", "2018", "2019", "2024"]
      },
      {
        nombre: "A.F. Semillas y Sentimientos Norteños",
        provincia: "Sullana",
        participaciones: 1,
        titulos: 0,
        anios: ["2017"]
      },
      {
        nombre: "G.F. Corazón Costumbrista",
        provincia: "Piura",
        localidad: "La Unión",
        participaciones: 3,
        titulos: 0,
        anios: ["2018", "2020", "2024"]
      },
      {
        nombre: "A.A.F. Perú Danzante",
        provincia: "Paita",
        participaciones: 2,
        titulos: 0,
        anios: ["2018", "2019"]
      },
      {
        nombre: "C.C. Mamá Gusti",
        provincia: "Sullana",
        participaciones: 5,
        titulos: 1,
        anios: ["2018", "2019", "2020", "2023", "2024"]
      },
      {
        nombre: "A.F. Tayta Sol y Raíces",
        provincia: "Paita",
        participaciones: 1,
        titulos: 0,
        anios: ["2018"]
      },
      {
        nombre: "E.C. Perú Ritmo y Color",
        provincia: "Piura",
        localidad: "Loma Negra, La Arena",
        participaciones: 3,
        titulos: 1,
        anios: ["2019", "2023", "2024"]
      },
      {
        nombre: "C.C. Raíces Peruanas",
        provincia: "Piura",
        localidad: "La Arena",
        participaciones: 2,
        titulos: 0,
        anios: ["2019", "2020"]
      },
      {
        nombre: "A.F. Hallpa Taki",
        provincia: "Morropón",
        localidad: "Chulucanas",
        participaciones: 2,
        titulos: 0,
        anios: ["2019", "2020"]
      },
      {
        nombre: "A.F. Raíces y Tradiciones",
        provincia: "Paita",
        participaciones: 1,
        titulos: 0,
        anios: ["2019"]
      },
      {
        nombre: "A.F. Danzar Guadalupano",
        provincia: "Piura",
        localidad: "Catacaos",
        participaciones: 1,
        titulos: 0,
        anios: ["2019"]
      },
      {
        nombre: "A.C.F. Waynakay Tusuy",
        provincia: "Talara",
        participaciones: 1,
        titulos: 0,
        anios: ["2023"]
      },
      {
        nombre: "A.C. Ani Kallpa Indiafroes",
        provincia: "Paita",
        participaciones: 1,
        titulos: 0,
        anios: ["2023"]
      },
      {
        nombre: "E.C. Pasión Folclórica",
        provincia: "Piura",
        localidad: "Molino Azul, Catacaos",
        participaciones: 2,
        titulos: 0,
        anios: ["2023", "2024"]
      },
      {
        nombre: "A.F. Sentimiento MG",
        provincia: "Sullana",
        participaciones: 2,
        titulos: 1,
        anios: ["2023", "2024"]
      },
      {
        nombre: "A.A. Talentos y Tradiciones del Perú",
        provincia: "Sechura",
        participaciones: 1,
        titulos: 0,
        anios: ["2023"]
      },
      {
        nombre: "A.C. Perú Folklore - Arte y Pasión",
        provincia: "Sullana",
        localidad: "Santa Sofía",
        participaciones: 1,
        titulos: 0,
        anios: ["2023"]
      },
      {
        nombre: "A.F. Tallanes y Capullanas Jibito",
        provincia: "Paita",
        participaciones: 1,
        titulos: 0,
        anios: ["2023"]
      },
      {
        nombre: "C.C. Expresión Andina",
        provincia: "Paita",
        participaciones: 1,
        titulos: 0,
        anios: ["2023"]
      },
      {
        nombre: "A.F. Identidad Cultural",
        provincia: "Sullana",
        localidad: "San Vicente de Piedra Rodada",
        participaciones: 2,
        titulos: 0,
        anios: ["2023", "2024"]
      },
      {
        nombre: "A.C. Maya",
        provincia: "Sullana",
        localidad: "Salitral",
        participaciones: 2,
        titulos: 0,
        anios: ["2023", "2024"]
      },
      {
        nombre: "F.C. Unay Kawsay Perú",
        provincia: "Sechura",
        localidad: "Cristo Nos Valga",
        participaciones: 1,
        titulos: 0,
        anios: ["2023"]
      },
      {
        nombre: "A.F. Nina Tusuq",
        provincia: "Paita",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      },
      {
        nombre: "G.F. Sentimiento Cataquense",
        provincia: "Piura",
        localidad: "Catacaos",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      },
      {
        nombre: "G.F. Latidos del Alma",
        provincia: "Piura",
        localidad: "Catacaos",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      },
      {
        nombre: "E.C.F. Tusuy Tusuq",
        provincia: "Talara",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      },
      {
        nombre: "Academia de Danzas Warma Kuyay",
        provincia: "Piura",
        localidad: "Catacaos",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      },
      {
        nombre: "I.E.P. Isaac Newton",
        provincia: "Piura",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      },
      {
        nombre: "A.F. Raíces Sechuranas",
        provincia: "Sechura",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      },
      {
        nombre: "Tierra de Sol Kids",
        provincia: "Paita",
        localidad: "Pueblo Nuevo de Colán",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      },
      {
        nombre: "Maya Kids",
        provincia: "Sullana",
        localidad: "Salitral",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      },
      {
        nombre: "Corazón Costumbrista Kids",
        provincia: "Piura",
        localidad: "La Unión",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      }
    ]
  },

  "PE-ANC": {
    nombre: "Áncash",

    descripcion:
      "Áncash estuvo representada presencialmente por una agrupación procedente de Chimbote.",

    provincias: ["Santa"],

    agrupaciones: [
      {
        nombre: "C.I.D.F.C. Llaqtaymanta Perú",
        provincia: "Santa",
        localidad: "Chimbote",
        participaciones: 1,
        titulos: 0,
        anios: ["2024"]
      }
    ]
  },

  "PE-AYA": {
    nombre: "Ayacucho",

    descripcion:
      "Ayacucho participó en la edición especial virtual de 2020.",

    provincias: ["Ayacucho"],

    agrupaciones: [
      {
        nombre: "I.F. Renacer",
        provincia: "Ayacucho",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      },
      {
        nombre: "F.F. Siwar",
        provincia: "Ayacucho",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      }
    ]
  },

  "PE-CAL": {
    nombre: "Callao",

    descripcion:
      "La Provincia Constitucional del Callao estuvo representada desde Ventanilla en la edición virtual.",

    provincias: ["Callao"],

    agrupaciones: [
      {
        nombre: "C.I.C. Expresarte Perú",
        provincia: "Callao",
        localidad: "Ventanilla",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      }
    ]
  },

  "PE-HUV": {
    nombre: "Huancavelica",

    descripcion:
      "Huancavelica estuvo presente en la edición especial virtual de 2020.",

    provincias: ["Huancavelica"],

    agrupaciones: [
      {
        nombre: "Taller Artístico Paturpampa",
        provincia: "Huancavelica",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      }
    ]
  },

  "PE-ICA": {
    nombre: "Ica",

    descripcion:
      "Ica obtuvo el campeonato de la categoría Libre en la edición especial de 2020.",

    provincias: ["Ica"],

    agrupaciones: [
      {
        nombre: "Escuela de Pastores Cristo Moreno",
        provincia: "Ica",
        participaciones: 1,
        titulos: 1,
        anios: ["2020"]
      }
    ]
  },

  "PE-JUN": {
    nombre: "Junín",

    descripcion:
      "Junín participó con agrupaciones de Chongos Bajo y Concepción y obtuvo un campeonato en 2020.",

    provincias: [
      "Chupaca",
      "Concepción"
    ],

    agrupaciones: [
      {
        nombre: "C.F. Unión Independiente",
        provincia: "Chupaca",
        localidad: "Chongos Bajo",
        participaciones: 1,
        titulos: 1,
        anios: ["2020"]
      },
      {
        nombre: "A.C. Huacones de Corazón",
        provincia: "Concepción",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      }
    ]
  },

  "PE-LAL": {
    nombre: "La Libertad",

    descripcion:
      "La Libertad estuvo representada por agrupaciones de Santiago de Chuco y Huamachuco.",

    provincias: [
      "Santiago de Chuco",
      "Sánchez Carrión"
    ],

    agrupaciones: [
      {
        nombre: "E.D.F. Jatun Tusuq",
        provincia: "Santiago de Chuco",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      },
      {
        nombre: "F.F. Katary",
        provincia: "Sánchez Carrión",
        localidad: "Huamachuco",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      }
    ]
  },

  "PE-LAM": {
    nombre: "Lambayeque",

    descripcion:
      "Lambayeque participó con dos agrupaciones procedentes de Chiclayo en la edición virtual.",

    provincias: ["Chiclayo"],

    agrupaciones: [
      {
        nombre: "A.A. Sumak Suyai",
        provincia: "Chiclayo",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      },
      {
        nombre: "C.A.D.F. Latidos Peruanos",
        provincia: "Chiclayo",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      }
    ]
  },

  "PE-LIM": {
    nombre: "Lima Región",

    descripcion:
      "La región Lima estuvo representada por una agrupación vinculada a la provincia de Yauyos.",

    provincias: ["Yauyos"],

    agrupaciones: [
      {
        nombre: "C.E.D.C. Amanecer Yauyos",
        provincia: "Yauyos",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      }
    ]
  },

  "PE-LMA": {
    nombre: "Lima Metropolitana",

    descripcion:
      "Lima Metropolitana participó en la edición virtual mediante una agrupación de Comas.",

    provincias: ["Lima"],

    agrupaciones: [
      {
        nombre: "A.F. Tusuy Kuyay",
        provincia: "Lima",
        localidad: "Comas",
        participaciones: 1,
        titulos: 0,
        anios: ["2020"]
      }
    ]
  }
};

// Se reemplaza por datos reales apenas responde la API (ver DOMContentLoaded).
let regiones = REGIONES_FALLBACK;

/*
|--------------------------------------------------------------------------
| Elementos de la página
|--------------------------------------------------------------------------
*/

const mapContainer = document.getElementById("peru-map");
const resetButton = document.getElementById("map-reset");

const emptyPanel = document.getElementById("region-empty");
const contentPanel = document.getElementById("region-content");

const regionName = document.getElementById("region-name");
const regionDescription = document.getElementById("region-description");

const provincesCount = document.getElementById(
  "region-provinces-count"
);

const groupsCount = document.getElementById(
  "region-groups-count"
);

const participationsCount = document.getElementById(
  "region-participations-count"
);

const titlesCount = document.getElementById(
  "region-titles-count"
);

const provincesContainer = document.getElementById(
  "region-provinces"
);

const groupsContainer = document.getElementById(
  "region-groups"
);

const tableBody = document.getElementById(
  "regions-table-body"
);

const provinceBlockTitle = document.getElementById(
  "province-block-title"
);

const groupsBlockTitle = document.getElementById(
  "groups-block-title"
);

const provinceRanking = document.getElementById(
  "province-ranking"
);

const groupRanking = document.getElementById(
  "group-ranking"
);

const provincesLabel = document.getElementById(
  "region-provinces-label"
);

const groupsLabel = document.getElementById(
  "region-groups-label"
);

const competitionSummary = document.getElementById(
  "competition-summary"
);

const competitionStats = document.getElementById(
  "competition-stats"
);

const COMPETITION_GROUPS = [
  {
    id: "danzas",
    label: "Danzas Nacionales",
    kicker: "Categoría mayores"
  },
  {
    id: "infantil",
    label: "Infantiles",
    kicker: "Nuevas generaciones"
  },
  {
    id: "caporales",
    label: "Caporales",
    kicker: "Nueva modalidad"
  }
];

let participacionesActuales = [];

const piuraProvinceNames = {
  ayabaca: "Ayabaca",
  huancabamba: "Huancabamba",
  morropon: "Morropón",
  paita: "Paita",
  piura: "Piura",
  sechura: "Sechura",
  sullana: "Sullana",
  talara: "Talara"
};

const mapTitle = document.getElementById(
  "map-title"
);

/*
|--------------------------------------------------------------------------
| Funciones de cálculo
|--------------------------------------------------------------------------
*/

function getRegionTotals(region) {
  return region.agrupaciones.reduce(
    (totals, group) => {
      totals.participaciones += group.participaciones;
      totals.titulos += group.titulos;

      return totals;
    },
    {
      participaciones: 0,
      titulos: 0
    }
  );
}

function getGeneralTotals() {
  const provinceSet = new Set();
  let totalGroups = 0;
  let totalParticipations = 0;

  Object.values(regiones).forEach((region) => {
    region.provincias.forEach((province) => {
      provinceSet.add(`${region.nombre}-${province}`);
    });

    totalGroups += region.agrupaciones.length;

    totalParticipations += getRegionTotals(
      region
    ).participaciones;
  });

  return {
    regiones: Object.keys(regiones).length,
    provincias: provinceSet.size,
    agrupaciones: totalGroups,
    participaciones: totalParticipations
  };
}

function normalizeMapText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function sameMapText(first, second) {
  return normalizeMapText(first) === normalizeMapText(second);
}

function getCompetitionId(participation) {
  const explicit = normalizeMapText(
    participation.grupoGanadores || participation.grupo || ""
  );
  const category = normalizeMapText(participation.categoria);
  const modality = normalizeMapText(participation.modalidad);

  if (explicit.includes("infantil")) return "infantil";
  if (explicit.includes("caporal")) return "caporales";
  if (explicit.includes("danza")) return "danzas";
  if (category.includes("infantil")) return "infantil";
  if (category.includes("caporal") || modality.includes("caporal")) {
    return "caporales";
  }
  return "danzas";
}

function getCompetitionMeta(id) {
  return COMPETITION_GROUPS.find((competition) => competition.id === id);
}

function renderCompetitionSummary(participations) {
  if (!competitionSummary || !competitionStats || !participations.length) return;

  const latestYear = Math.max(
    ...participations.map((item) => Number(item.anio) || 0)
  );

  const cards = COMPETITION_GROUPS.map((competition) => {
    const rows = participations.filter(
      (item) => getCompetitionId(item) === competition.id
    );
    if (!rows.length) return "";

    const groups = new Set(
      rows.map((item) => normalizeMapText(item.agrupacion)).filter(Boolean)
    );
    const participationsSet = new Set(
      rows.map((item) =>
        `${normalizeMapText(item.agrupacion)}-${item.anio || ""}`
      )
    );
    const years = Array.from(
      new Set(rows.map((item) => Number(item.anio)).filter(Boolean))
    ).sort((a, b) => a - b);
    const firstYear = years[0];
    const lastYear = years[years.length - 1];
    const period =
      firstYear === lastYear
        ? `Presente desde ${firstYear}${lastYear === latestYear ? " · edición más reciente" : ""}`
        : `Historia registrada: ${firstYear}–${lastYear}`;

    return `
      <article class="competition-stat-card competition-stat-card--${competition.id}">
        <span class="competition-card-kicker">${escapeHtml(competition.kicker)}</span>
        <h3>${escapeHtml(competition.label)}</h3>
        <div class="competition-card-values">
          <div>
            <strong>${participationsSet.size}</strong>
            <span>participaciones</span>
          </div>
          <div>
            <strong>${groups.size}</strong>
            <span>agrupaciones</span>
          </div>
        </div>
        <span class="competition-card-period">${escapeHtml(period)}</span>
      </article>
    `;
  }).filter(Boolean);

  competitionStats.innerHTML = cards.join("");
  competitionSummary.hidden = cards.length === 0;
}

/*
|--------------------------------------------------------------------------
| Cargar SVG
|--------------------------------------------------------------------------
*/

async function loadMap() {
  if (!mapContainer) {
    return;
  }

  try {
    const response = await fetch("img/peru.svg");

    if (!response.ok) {
      throw new Error(
        `No se pudo cargar el mapa: ${response.status}`
      );
    }

    const svgContent = await response.text();

    mapContainer.innerHTML = svgContent;

    window.PiuraMap?.close();

    if (mapTitle) {
    mapTitle.textContent =
        "Regiones participantes";
    }

    if (resetButton) {
    resetButton.textContent =
        "Ver todo el Perú";
    }

    prepareMap();
  } catch (error) {
    console.error(error);

    mapContainer.innerHTML = `
      <div class="map-error">
        <strong>No se pudo cargar el mapa.</strong>
        <p>
          Comprueba que el archivo
          <code>img/peru.svg</code> existe.
        </p>
      </div>
    `;
  }
}

/*
|--------------------------------------------------------------------------
| Preparar regiones del mapa
|--------------------------------------------------------------------------
*/

function prepareMap() {
  const svg = mapContainer.querySelector("svg");

  if (!svg) {
    return;
  }

  svg.setAttribute(
    "aria-label",
    "Mapa de regiones del Perú"
  );

  svg.removeAttribute("width");
  svg.removeAttribute("height");

  const mapRegions = svg.querySelectorAll("path[id]");

  mapRegions.forEach((mapRegion) => {
    const regionId = mapRegion.id;
    const regionData = regiones[regionId];

    mapRegion.classList.add("map-region");

    /*
     * PE-LKT no es una región política.
     * Se mantiene únicamente como elemento visual.
     */
    if (regionId === "PE-LKT") {
      mapRegion.classList.add("map-map-element");

      mapRegion.setAttribute(
        "aria-hidden",
        "true"
      );

      return;
    }

    if (!regionData) {
      mapRegion.classList.add(
        "map-region-inactive"
      );

      mapRegion.setAttribute(
        "aria-disabled",
        "true"
      );

      return;
    }

    mapRegion.classList.add(
      "map-region-active"
    );

    const totals = getRegionTotals(regionData);

    mapRegion.classList.add(
    getHeatLevel(totals.participaciones)
    );

    mapRegion.dataset.participaciones =
    totals.participaciones;

    mapRegion.setAttribute("tabindex", "0");
    mapRegion.setAttribute("role", "button");

    mapRegion.setAttribute(
      "aria-label",
      `Ver información de ${regionData.nombre}`
    );

    mapRegion.addEventListener(
      "click",
      () => selectRegion(regionId)
    );

    mapRegion.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          selectRegion(regionId);
        }
      }
    );
  });
}


/*
|--------------------------------------------------------------------------
| Mostrar región seleccionada
|--------------------------------------------------------------------------
*/

function selectRegion(regionId) {
  const region = regiones[regionId];

  if (!region) {
    return;
  }

  const totals = getRegionTotals(region);

  document
    .querySelectorAll(".map-region-selected")
    .forEach((element) => {
      element.classList.remove(
        "map-region-selected"
      );
    });

  const selectedMapRegion =
    document.getElementById(regionId);

  if (selectedMapRegion) {
    selectedMapRegion.classList.add(
      "map-region-selected"
    );
  }

  regionName.textContent = region.nombre;
  regionDescription.textContent =
    region.descripcion;

  provincesCount.textContent =
    region.provincias.length;

  if (provincesLabel) provincesLabel.textContent = "Provincias";
  if (groupsLabel) groupsLabel.textContent = "Agrupaciones";

  groupsCount.textContent =
    region.agrupaciones.length;

  participationsCount.textContent =
    totals.participaciones;

  titlesCount.textContent =
    totals.titulos;

  if (regionId === "PE-PIU") {
    provincesContainer.innerHTML = "";

    provinceBlockTitle.textContent =
      "Provincias de Piura";

    groupsBlockTitle.textContent =
      "Selecciona una provincia";

    groupsContainer.innerHTML = `
      <div class="province-instruction">
        <span class="province-instruction-icon">
          ⌖
        </span>

        <div>
          <strong>
            Explora el mapa provincial
          </strong>

          <p>
            Selecciona una provincia en el mapa
            de la izquierda para conocer sus
            agrupaciones, participaciones y títulos.
          </p>
        </div>
      </div>
    `;

    window.PiuraMap?.open();
  } else {
    if (window.PiuraMap?.isActive()) {
      loadMap();
    }

    provinceBlockTitle.textContent =
      "Provincias representadas";

    groupsBlockTitle.textContent =
      "Agrupaciones participantes";

    renderProvinces(
      region.provincias,
      regionId
    );

    renderGroups(
      region.agrupaciones
    );
  }

  emptyPanel.hidden = true;
  contentPanel.hidden = false;
  resetButton.hidden = false;

  if (window.innerWidth <= 900) {
    contentPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function showProvince(regionId, provinceName) {
  const region = regiones[regionId];

  if (!region) {
    return;
  }

  provinceBlockTitle.textContent = "Navegación";
  groupsBlockTitle.textContent = `Agrupaciones de ${provinceName}`;

  const provinceGroups = region.agrupaciones.filter(
    (group) => sameMapText(group.provincia, provinceName)
  );

  const districtEntry = Object.entries(
    region.distritosPorProvincia || {}
  ).find(([province]) => sameMapText(province, provinceName));
  const districts = districtEntry ? districtEntry[1] : [];

  const totals = provinceGroups.reduce(
    (result, group) => {
      result.participaciones += group.participaciones;
      result.titulos += group.titulos;
      return result;
    },
    {
      participaciones: 0,
      titulos: 0
    }
  );

  regionName.textContent = provinceName;

  regionDescription.textContent =
    `Provincia de ${provinceName}, región ${region.nombre}.`;

  provincesCount.textContent = districts.length || 1;
  if (provincesLabel) {
    provincesLabel.textContent = districts.length === 1
      ? "Distrito"
      : districts.length
        ? "Distritos"
        : "Provincia";
  }
  if (groupsLabel) groupsLabel.textContent = "Agrupaciones";
  groupsCount.textContent = provinceGroups.length;
  participationsCount.textContent = totals.participaciones;
  titlesCount.textContent = totals.titulos;

  const districtButtons = districts.length
    ? `
      <div class="district-navigation">
        <span class="district-navigation-label">Filtrar por distrito</span>
        ${districts.map((district) => `
          <button
            type="button"
            class="region-tag district-button"
            data-district="${escapeHtml(district)}"
          >
            ${escapeHtml(district)}
          </button>
        `).join("")}
      </div>
    `
    : "";

  provincesContainer.innerHTML = `
    <button
      type="button"
      class="region-tag province-back-button"
      id="province-back-button"
    >
      ← Volver a ${escapeHtml(region.nombre)}
    </button>
    ${districtButtons}
  `;

  renderGroups(provinceGroups);

  const backButton = document.getElementById(
    "province-back-button"
  );

  backButton?.addEventListener("click", () => {
    selectRegion(regionId);
  });

  provincesContainer
    .querySelectorAll(".district-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        showDistrict(regionId, provinceName, button.dataset.district);
      });
    });

  document
    .querySelectorAll(".province-button")
    .forEach((button) => {
      button.classList.remove("province-selected");
    });

  if (window.innerWidth <= 900) {
    contentPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function showDistrict(regionId, provinceName, districtName) {
  const region = regiones[regionId];
  if (!region) return;

  const districtGroups = region.agrupaciones.filter(
    (group) =>
      sameMapText(group.provincia, provinceName) &&
      sameMapText(group.distrito, districtName)
  );
  const totals = districtGroups.reduce(
    (result, group) => {
      result.participaciones += group.participaciones;
      result.titulos += group.titulos;
      return result;
    },
    { participaciones: 0, titulos: 0 }
  );

  provinceBlockTitle.textContent = "Navegación territorial";
  groupsBlockTitle.textContent = `Agrupaciones de ${districtName}`;
  regionName.textContent = districtName;
  regionDescription.textContent =
    `Distrito de ${districtName}, provincia de ${provinceName}, región ${region.nombre}.`;

  provincesCount.textContent = 1;
  groupsCount.textContent = districtGroups.length;
  participationsCount.textContent = totals.participaciones;
  titlesCount.textContent = totals.titulos;
  if (provincesLabel) provincesLabel.textContent = "Provincia";
  if (groupsLabel) groupsLabel.textContent = "Agrupaciones";

  provincesContainer.innerHTML = `
    <button
      type="button"
      class="region-tag province-back-button"
      id="district-back-button"
    >
      ← Volver a ${escapeHtml(provinceName)}
    </button>
    <span class="region-tag district-button is-active">
      ${escapeHtml(districtName)}
    </span>
  `;

  if (districtGroups.length) {
    renderGroups(districtGroups);
  } else {
    groupsContainer.innerHTML = `
      <div class="district-empty">
        Todavía no hay agrupaciones publicadas para este distrito.
      </div>
    `;
  }

  document
    .getElementById("district-back-button")
    ?.addEventListener("click", () => showProvince(regionId, provinceName));

  if (window.innerWidth <= 900) {
    contentPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderProvinces(provinces, regionId) {
  provincesContainer.innerHTML = provinces
    .map(
      (province) => `
        <button
          type="button"
          class="region-tag province-button"
          data-province="${escapeHtml(province)}"
          data-region="${escapeHtml(regionId)}"
        >
          ${escapeHtml(province)}
        </button>
      `
    )
    .join("");

  provincesContainer
    .querySelectorAll(".province-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        showProvince(
          button.dataset.region,
          button.dataset.province
        );
      });
    });
}

function renderGroups(groups) {
  groupsContainer.innerHTML = groups
    .map((group) => {
      const competitions = Array.isArray(group.competencias)
        ? group.competencias
        : [];
      const cardType = competitions.length > 1
        ? "mixta"
        : competitions[0]?.id || "danzas";
      const badges = competitions.map((competition) => {
        const meta = getCompetitionMeta(competition.id);
        if (!meta) return "";
        return `
          <span class="group-competition-badge group-competition-badge--${competition.id}">
            ${escapeHtml(meta.label)}
          </span>
        `;
      }).join("");
      const locationParts = [group.localidad, group.distrito, group.provincia]
        .filter((value, index, values) =>
          value && values.findIndex((item) => sameMapText(item, value)) === index
        );

      return `
        <article class="region-group-card region-group-card--${cardType}">
          <div>
            <h4>${escapeHtml(group.nombre)}</h4>

            <p>
              ${locationParts.map(escapeHtml).join(" · ")}
            </p>

            ${badges ? `<div class="group-competitions">${badges}</div>` : ""}
          </div>

          <div class="group-history">
            <span>
              <strong>${group.participaciones}</strong>
              participación${
                group.participaciones === 1
                  ? ""
                  : "es"
              }
            </span>

            <span>
              <strong>${group.titulos}</strong>
              título${
                group.titulos === 1
                  ? ""
                  : "s"
              }
            </span>
          </div>

          <p class="group-years">
            Ediciones:
            ${group.anios
              .map(escapeHtml)
              .join(", ")}
          </p>
        </article>
      `;
    })
    .join("");
}

/*
|--------------------------------------------------------------------------
| Tabla histórica
|--------------------------------------------------------------------------
*/

function renderTable() {
  if (!tableBody) {
    return;
  }

  const rows = Object.entries(regiones)
    .map(([id, region]) => {
      const totals = getRegionTotals(region);

      return {
        id,
        region,
        participaciones: totals.participaciones,
        titulos: totals.titulos
      };
    })
    .sort(
      (a, b) =>
        b.participaciones -
        a.participaciones
    );

  tableBody.innerHTML = rows
    .map(
      ({
        id,
        region,
        participaciones,
        titulos
      }) => `
        <tr
          class="map-table-row"
          data-region="${id}"
          tabindex="0"
        >
          <td>
            <strong>
              ${escapeHtml(region.nombre)}
            </strong>
          </td>

          <td>${region.provincias.length}</td>

          <td>
            ${region.agrupaciones.length}
          </td>

          <td>${participaciones}</td>

          <td>${titulos}</td>
        </tr>
      `
    )
    .join("");

  tableBody
    .querySelectorAll("[data-region]")
    .forEach((row) => {
      const openRegion = () => {
        selectRegion(row.dataset.region);

        document
          .getElementById("peru-map")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
      };

      row.addEventListener("click", openRegion);

      row.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            openRegion();
          }
        }
      );
    });
}

/*
|--------------------------------------------------------------------------
| Resumen general
|--------------------------------------------------------------------------
*/

function renderGeneralTotals() {
  const totals = getGeneralTotals();

  document.getElementById(
    "total-regiones"
  ).textContent = totals.regiones;

  document.getElementById(
    "total-provincias"
  ).textContent = totals.provincias;

  document.getElementById(
    "total-agrupaciones"
  ).textContent = totals.agrupaciones;

  document.getElementById(
    "total-participaciones"
  ).textContent = totals.participaciones;
}

/*
|--------------------------------------------------------------------------
| Restablecer mapa
|--------------------------------------------------------------------------
*/

function resetMap() {
  if (window.PiuraMap?.isActive()) {
    window.PiuraMap.close();

    loadMap();

    contentPanel.hidden = true;
    emptyPanel.hidden = false;
    resetButton.hidden = true;

    return;
  }

  document
    .querySelectorAll(
      ".map-region-selected"
    )
    .forEach((element) => {
      element.classList.remove(
        "map-region-selected"
      );
    });

  contentPanel.hidden = true;
  emptyPanel.hidden = false;
  resetButton.hidden = true;
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = String(value);

  return element.innerHTML;
}

function getProvinceRanking() {
  const provinces = new Map();

  Object.values(regiones).forEach((region) => {
    region.agrupaciones.forEach((group) => {
      const key = `${group.provincia}-${region.nombre}`;

      if (!provinces.has(key)) {
        provinces.set(key, {
          provincia: group.provincia,
          region: region.nombre,
          participaciones: 0,
          agrupaciones: new Set(),
          titulos: 0
        });
      }

      const province = provinces.get(key);

      province.participaciones += group.participaciones;
      province.titulos += group.titulos;
      province.agrupaciones.add(group.nombre);
    });
  });

  return Array.from(provinces.values())
    .map((province) => ({
      ...province,
      agrupaciones: province.agrupaciones.size
    }))
    .sort(
      (a, b) =>
        b.participaciones - a.participaciones ||
        b.titulos - a.titulos
    );
}

function getGroupRanking() {
  const groups = [];

  Object.values(regiones).forEach((region) => {
    region.agrupaciones.forEach((group) => {
      groups.push({
        nombre: group.nombre,
        provincia: group.provincia,
        region: region.nombre,
        participaciones: group.participaciones,
        titulos: group.titulos
      });
    });
  });

  return groups.sort(
    (a, b) =>
      b.participaciones - a.participaciones ||
      b.titulos - a.titulos ||
      a.nombre.localeCompare(b.nombre)
  );
}

function renderProvinceRanking() {
  if (!provinceRanking) {
    return;
  }

  const ranking = getProvinceRanking().slice(0, 10);

  provinceRanking.innerHTML = ranking
    .map(
      (province, index) => `
        <article class="ranking-card">
          <span class="ranking-position">
            ${index + 1}
          </span>

          <div class="ranking-info">
            <h3>${escapeHtml(province.provincia)}</h3>

            <p>
              ${escapeHtml(province.region)}
            </p>
          </div>

          <div class="ranking-values">
            <strong>
              ${province.participaciones}
            </strong>

            <span>
              participaciones
            </span>

            <small>
              ${province.agrupaciones}
              agrupación${
                province.agrupaciones === 1 ? "" : "es"
              }
            </small>
          </div>
        </article>
      `
    )
    .join("");
}

function renderGroupRanking() {
  if (!groupRanking) {
    return;
  }

  const ranking = getGroupRanking().slice(0, 10);

  groupRanking.innerHTML = ranking
    .map(
      (group, index) => `
        <article class="ranking-card">
          <span class="ranking-position">
            ${index + 1}
          </span>

          <div class="ranking-info">
            <h3>${escapeHtml(group.nombre)}</h3>

            <p>
              ${escapeHtml(group.provincia)}
              ·
              ${escapeHtml(group.region)}
            </p>
          </div>

          <div class="ranking-values">
            <strong>
              ${group.participaciones}
            </strong>

            <span>
              participaciones
            </span>

            <small>
              ${group.titulos}
              título${group.titulos === 1 ? "" : "s"}
            </small>
          </div>
        </article>
      `
    )
    .join("");
}

function getHeatLevel(participations) {
  if (participations >= 30) {
    return "heat-level-5";
  }

  if (participations >= 15) {
    return "heat-level-4";
  }

  if (participations >= 6) {
    return "heat-level-3";
  }

  if (participations >= 3) {
    return "heat-level-2";
  }

  return "heat-level-1";
}

/*
|--------------------------------------------------------------------------
| Datos en vivo (Bloque 3): Regiones + Participaciones vía CCTData
|--------------------------------------------------------------------------
|
| Reconstruye el mismo objeto "regiones" (por región: nombre, descripcion,
| provincias[], agrupaciones[]) pero calculado a partir de la hoja
| Participaciones en lugar de estar escrito a mano. Así, participaciones,
| títulos y años por agrupación nunca se vuelven a desactualizar.
|
| "participaciones" de una agrupación = cantidad de ediciones (años)
| distintas en las que participó (si compitió en dos categorías el mismo
| año, sigue contando como 1 participación, igual que en los datos
| históricos curados a mano).
*/

async function computeRegionesFromApi() {
  const [regionesApi, participaciones, ubicaciones, agrupaciones] = await Promise.all([
    CCTData.getRegiones(),
    CCTData.getParticipaciones(),
    CCTData.getUbicaciones().catch(() => []),
    CCTData.getAgrupaciones().catch(() => [])
  ]);

  participacionesActuales = participaciones;

  const metaByCode = {};
  const codeByName = {};

  const locationById = new Map(
    ubicaciones.map((location) => [
      normalizeMapText(location.idUbicacion),
      location
    ])
  );

  const groupReferences = agrupaciones.map((group) => {
    const location = locationById.get(normalizeMapText(group.id_ubicacion)) || {};
    return {
      group,
      names: [group.nombre_oficial, group.nombre_corto]
        .map(normalizeMapText)
        .filter(Boolean),
      location
    };
  });

  function findGroupReference(participationName) {
    const key = normalizeMapText(participationName);
    return groupReferences.find((reference) =>
      reference.names.some((name) =>
        key === name || key.endsWith(name) || name.endsWith(key)
      )
    );
  }

  regionesApi.forEach((r) => {
    metaByCode[r.idMapa] = r;
    codeByName[normalizeMapText(r.region)] = r.idMapa;
  });

  const result = {};

  participaciones.forEach((p) => {
    if (!p.agrupacion) return;

    const reference = findGroupReference(p.agrupacion);
    const groupMeta = reference?.group || {};
    const locationMeta = reference?.location || {};
    const regionName = p.region || groupMeta.region || locationMeta.region;
    const provinceName = p.provincia || groupMeta.provincia || locationMeta.provincia || "";
    const districtName =
      locationMeta.distrito ||
      groupMeta.distrito ||
      p.distritoLocalidad ||
      "";
    const localityName =
      locationMeta.localidad ||
      groupMeta.localidad ||
      (p.distritoLocalidad && !sameMapText(p.distritoLocalidad, districtName)
        ? p.distritoLocalidad
        : "");
    const officialName = groupMeta.nombre_oficial || p.agrupacion;
    const code = codeByName[normalizeMapText(regionName)];
    if (!code) {
      console.warn(
        `Participación con región desconocida "${regionName}" (agrupación: ${p.agrupacion}); se omite.`
      );
      return;
    }

    if (!result[code]) {
      const meta = metaByCode[code] || {};
      result[code] = {
        nombre: meta.region || regionName,
        descripcion: meta.descripcion || "",
        provinciasSet: new Set(),
        agrupacionesMap: new Map()
      };
    }

    const region = result[code];
    if (provinceName) region.provinciasSet.add(provinceName);

    const groupKey = normalizeMapText(officialName);
    if (!region.agrupacionesMap.has(groupKey)) {
      region.agrupacionesMap.set(groupKey, {
        nombre: officialName,
        provincia: provinceName,
        distrito: districtName,
        localidad: localityName,
        titulos: 0,
        aniosSet: new Set(),
        competenciasMap: new Map()
      });
    }

    const group = region.agrupacionesMap.get(groupKey);
    if (String(p.campeon).toUpperCase() === "SI") group.titulos += 1;
    if (p.anio) {
      group.aniosSet.add(String(p.anio));
      const competitionId = getCompetitionId(p);
      if (!group.competenciasMap.has(competitionId)) {
        group.competenciasMap.set(competitionId, new Set());
      }
      group.competenciasMap.get(competitionId).add(String(p.anio));
    }
  });

  const finalRegiones = {};
  Object.entries(result).forEach(([code, region]) => {
    const groups = Array.from(region.agrupacionesMap.values())
      .map((g) => ({
        nombre: g.nombre,
        provincia: g.provincia,
        distrito: g.distrito,
        localidad: g.localidad,
        participaciones: g.aniosSet.size,
        titulos: g.titulos,
        anios: Array.from(g.aniosSet).sort(),
        competencias: Array.from(g.competenciasMap.entries()).map(
          ([id, years]) => ({ id, participaciones: years.size })
        )
      }));
    const districtsByProvince = {};

    groups.forEach((group) => {
      if (!group.provincia || !group.distrito) return;
      if (!districtsByProvince[group.provincia]) {
        districtsByProvince[group.provincia] = new Map();
      }
      districtsByProvince[group.provincia].set(
        normalizeMapText(group.distrito),
        group.distrito
      );
    });

    finalRegiones[code] = {
      nombre: region.nombre,
      descripcion: region.descripcion,
      provincias: Array.from(region.provinciasSet).sort((a, b) => a.localeCompare(b, "es")),
      distritosPorProvincia: Object.fromEntries(
        Object.entries(districtsByProvince).map(([province, districts]) => [
          province,
          Array.from(districts.values()).sort((a, b) => a.localeCompare(b, "es"))
        ])
      ),
      agrupaciones: groups
    };
  });

  return finalRegiones;
}

/*
|--------------------------------------------------------------------------
| Inicialización
|--------------------------------------------------------------------------
*/

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    try {
      const datosReales = await computeRegionesFromApi();

      if (datosReales && Object.keys(datosReales).length > 0) {
        regiones = datosReales;
        renderCompetitionSummary(participacionesActuales);
      } else {
        console.warn(
          "La API respondió sin datos utilizables; se usan los datos de respaldo del mapa."
        );
      }
    } catch (error) {
      console.error(
        "No se pudieron cargar los datos en vivo del mapa, se usan los datos de respaldo:",
        error
      );
    }

    renderGeneralTotals();
    renderTable();
    renderProvinceRanking();
    renderGroupRanking();

    window.PiuraMap?.init({
        mapContainer,
        mapTitle,
        resetButton,

        availableProvinces:
            regiones["PE-PIU"]?.provincias || [],

        onProvinceSelect: (provinceName) => {
            showProvince(
            "PE-PIU",
            provinceName
            );
        }
    });

    loadMap();

    resetButton?.addEventListener(
      "click",
      resetMap
    );
  }
);
