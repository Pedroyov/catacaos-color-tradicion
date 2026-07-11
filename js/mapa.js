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

const regiones = {
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
        provincia: "Piura",
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

  provinceBlockTitle.textContent = "Provincias representadas";
  groupsBlockTitle.textContent = "Agrupaciones participantes";

  const totals = getRegionTotals(region);

  document
    .querySelectorAll(".map-region-selected")
    .forEach((element) => {
      element.classList.remove(
        "map-region-selected"
      );
    });

  const selectedMapRegion = document.getElementById(
    regionId
  );

  if (selectedMapRegion) {
    selectedMapRegion.classList.add(
      "map-region-selected"
    );
  }

  regionName.textContent = region.nombre;
  regionDescription.textContent = region.descripcion;

  provincesCount.textContent =
    region.provincias.length;

  groupsCount.textContent =
    region.agrupaciones.length;

  participationsCount.textContent =
    totals.participaciones;

  titlesCount.textContent =
    totals.titulos;

  renderProvinces(region.provincias, regionId);
  renderGroups(region.agrupaciones);

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
    (group) => group.provincia === provinceName
  );

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

  provincesCount.textContent = 1;
  groupsCount.textContent = provinceGroups.length;
  participationsCount.textContent = totals.participaciones;
  titlesCount.textContent = totals.titulos;

  provincesContainer.innerHTML = `
    <button
      type="button"
      class="region-tag province-back-button"
      id="province-back-button"
    >
      ← Volver a ${escapeHtml(region.nombre)}
    </button>
  `;

  renderGroups(provinceGroups);

  const backButton = document.getElementById(
    "province-back-button"
  );

  backButton?.addEventListener("click", () => {
    selectRegion(regionId);
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
    .map(
      (group) => `
        <article class="region-group-card">
          <div>
            <h4>${escapeHtml(group.nombre)}</h4>

            <p>
              ${
                    group.localidad
                    ? `${escapeHtml(group.localidad)} · ${escapeHtml(group.provincia)}`
                    : escapeHtml(group.provincia)
                }
            </p>
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
      `
    )
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
  document
    .querySelectorAll(".map-region-selected")
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

/*
|--------------------------------------------------------------------------
| Inicialización
|--------------------------------------------------------------------------
*/

document.addEventListener(
  "DOMContentLoaded",
  () => {
    renderGeneralTotals();
    renderTable();
    loadMap();

    resetButton?.addEventListener(
      "click",
      resetMap
    );
  }
);