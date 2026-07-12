"use strict";

window.PiuraMap = (() => {
  const provinceNames = {
    ayabaca: "Ayabaca",
    huancabamba: "Huancabamba",
    morropon: "Morropón",
    paita: "Paita",
    piura: "Piura",
    sechura: "Sechura",
    sullana: "Sullana",
    talara: "Talara"
  };

  let mapContainer = null;
  let mapTitle = null;
  let resetButton = null;
  let availableProvinces = new Set();
  let onProvinceSelect = null;
  let active = false;

  function init(options) {
    mapContainer = options.mapContainer;
    mapTitle = options.mapTitle;
    resetButton = options.resetButton;

    availableProvinces = new Set(
      options.availableProvinces || []
    );

    onProvinceSelect =
      options.onProvinceSelect || null;
  }

  async function open() {
    if (!mapContainer) {
        console.error(
        "PiuraMap: no se configuró el contenedor."
        );

        return;
    }

    try {
        mapContainer.classList.add(
        "map-transition-out"
        );

        const response = await fetch(
        "img/piura-provincias.svg"
        );

        if (!response.ok) {
        throw new Error(
            `Error ${response.status} al cargar el mapa de Piura`
        );
        }

        const svgContent = await response.text();

        active = true;

        if (mapTitle) {
        mapTitle.textContent =
            "Provincias de Piura";
        }

        if (resetButton) {
        resetButton.hidden = false;
        resetButton.textContent =
            "← Volver al Perú";
        }

        setTimeout(() => {
        mapContainer.innerHTML = svgContent;

        mapContainer.classList.remove(
            "map-transition-out"
        );

        mapContainer.classList.add(
            "piura-mode"
        );

        mapContainer.classList.add(
            "map-transition-in"
        );

        prepareMap();

        setTimeout(() => {
            mapContainer.classList.remove(
            "map-transition-in"
            );
        }, 350);
        }, 220);
    } catch (error) {
        console.error(error);

        mapContainer.classList.remove(
        "map-transition-out"
        );

        mapContainer.innerHTML = `
        <div class="map-error">
            <strong>
            No se pudo cargar el mapa de Piura.
            </strong>

            <p>
            ${escapeText(error.message)}
            </p>
        </div>
        `;
    }
  }

  function prepareMap() {
    const svg = mapContainer?.querySelector("svg");

    if (!svg) {
      console.error(
        "PiuraMap: el archivo no contiene un SVG."
      );

      return;
    }

    svg.removeAttribute("width");
    svg.removeAttribute("height");

    svg.setAttribute(
      "aria-label",
      "Mapa interactivo de las provincias de Piura"
    );

    const provincePaths = svg.querySelectorAll(
      "path[id]"
    );

    provincePaths.forEach((provincePath) => {
      const provinceId = provincePath.id;

      const provinceName =
        provinceNames[provinceId];

      provincePath.classList.add(
        "piura-province-path"
      );

      if (!provinceName) {
        provincePath.classList.add(
          "piura-province-inactive"
        );

        return;
      }

      const hasParticipants =
        availableProvinces.has(provinceName);

      if (!hasParticipants) {
        provincePath.classList.add(
          "piura-province-inactive"
        );

        provincePath.setAttribute(
          "aria-disabled",
          "true"
        );

        return;
      }

      provincePath.classList.add(
        "piura-province-active"
      );

      provincePath.setAttribute(
        "tabindex",
        "0"
      );

      provincePath.setAttribute(
        "role",
        "button"
      );

      provincePath.setAttribute(
        "aria-label",
        `Ver estadísticas de ${provinceName}`
      );

      provincePath.addEventListener(
        "click",
        () => {
          selectProvince(
            provincePath,
            provinceName
          );
        }
      );

      provincePath.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();

            selectProvince(
              provincePath,
              provinceName
            );
          }
        }
      );
    });
  }

  function selectProvince(
    provincePath,
    provinceName
  ) {
    mapContainer
      .querySelectorAll(
        ".piura-province-selected"
      )
      .forEach((element) => {
        element.classList.remove(
          "piura-province-selected"
        );
      });

    provincePath.classList.add(
      "piura-province-selected"
    );

    if (
      typeof onProvinceSelect === "function"
    ) {
      onProvinceSelect(provinceName);
    }
  }

  function close() {
    active = false;

    if (mapContainer) {
        mapContainer.classList.remove("piura-mode");
        mapContainer.classList.remove("map-transition-in");
    }
  }

  function isActive() {
    return active;
  }

  function escapeText(value) {
    const element =
      document.createElement("div");

    element.textContent = String(value);

    return element.innerHTML;
  }

  return {
    init,
    open,
    close,
    isActive
  };
})();