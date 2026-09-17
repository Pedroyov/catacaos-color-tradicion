const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

const header = document.getElementById("header");
const headerStartsTransparent = header?.classList.contains("transparent");

if (header && headerStartsTransparent) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      header.classList.remove("transparent");
      header.classList.add("scrolled");
    } else {
      header.classList.add("transparent");
      header.classList.remove("scrolled");
    }
  });
}

const countdown = document.getElementById("countdown");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

if (countdown && daysEl && hoursEl && minutesEl && secondsEl) {
  const targetDate = new Date("October 25, 2026 12:00:00").getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      countdown.innerHTML = "<h3>¡El evento ya comenzó!</h3>";
      return;
    }

    daysEl.innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    hoursEl.innerText = Math.floor((distance / (1000 * 60 * 60)) % 24);
    minutesEl.innerText = Math.floor((distance / (1000 * 60)) % 60);
    secondsEl.innerText = Math.floor((distance / 1000) % 60);
  }, 1000);
}


const filterButtons = document.querySelectorAll(".gallery-filter button");
const galleryImages = document.querySelectorAll(".gallery-masonry img");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    galleryImages.forEach(img => {
      if (filter === "all" || img.dataset.year === filter) {
        img.style.display = "block";
      } else {
        img.style.display = "none";
      }
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

if (lightbox && lightboxImg && closeLightbox) {
  galleryImages.forEach(img => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.add("active");
    });
  });

  closeLightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });
}



const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-zoom"
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach(element => {
  revealObserver.observe(element);
});

const shareBtn = document.getElementById("shareBtn");

if (shareBtn) {
  shareBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const shareData = {
      title: "Catacaos, Color y Tradición",
      text: "Conoce la web oficial de Catacaos, Color y Tradición.",
      url: "https://pedroyov.github.io/catacaos-color-tradicion/"
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Enlace copiado al portapapeles");
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert("Enlace copiado al portapapeles");
      } catch (copyError) {
        alert("No se pudo compartir. Copia este enlace: " + shareData.url);
      }
    }
  });
}

let deferredPrompt = null;

const installAppBtn = document.getElementById(
  "install-app-btn"
);

window.addEventListener(
  "beforeinstallprompt",
  (event) => {
    event.preventDefault();

    deferredPrompt = event;

    if (installAppBtn) {
      installAppBtn.hidden = false;
    }
  }
);

installAppBtn?.addEventListener(
  "click",
  async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    const choice =
      await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      installAppBtn.hidden = true;
    }

    deferredPrompt = null;
  }
);

window.addEventListener(
  "appinstalled",
  () => {
    deferredPrompt = null;

    if (installAppBtn) {
      installAppBtn.hidden = true;
    }
  }
);


/* =========================================================
   CUENTA REGRESIVA - CATACAOS 2026
========================================================= */

const countdownSection = document.getElementById(
  "cuenta-regresiva"
);

const countdownGrid = document.getElementById(
  "countdown-grid"
);

const countdownToday = document.getElementById(
  "countdown-today"
);

const countdownTitle = document.getElementById(
  "countdown-title"
);

const countdownDescription = document.getElementById(
  "countdown-description"
);

const countdownDays = document.getElementById(
  "countdown-days"
);

const countdownHours = document.getElementById(
  "countdown-hours"
);

const countdownMinutes = document.getElementById(
  "countdown-minutes"
);

const countdownSeconds = document.getElementById(
  "countdown-seconds"
);


/*
  Inicio del concurso:
  25 de octubre de 2026 - 12:00 p. m.
  Zona horaria Perú (-05:00)
*/
const CONTEST_DATE =
  new Date("2026-10-25T12:00:00-05:00");

const DAY_AFTER_CONTEST =
  new Date("2026-10-26T00:00:00-05:00");


function updateContestCountdown() {
  if (!countdownSection) {
    return;
  }

  const now = new Date();

  /*
    Desde el día siguiente al concurso,
    dejamos de mostrar la cuenta regresiva.
  */
  if (now >= DAY_AFTER_CONTEST) {
    countdownSection.hidden = true;
    return;
  }

  /*
    Durante el día del concurso.
  */
  const contestDayStart =
    new Date("2026-10-25T00:00:00-05:00");

  if (
    now >= contestDayStart &&
    now < DAY_AFTER_CONTEST
  ) {
    countdownGrid.hidden = true;
    countdownToday.hidden = false;

    countdownTitle.textContent =
      "¡Hoy nos reencontramos con nuestra tradición!";

    countdownDescription.textContent =
      "Sigue el desarrollo del concurso y sus resultados oficiales desde esta página.";

    return;
  }

  const difference =
    CONTEST_DATE.getTime() - now.getTime();

  if (difference <= 0) {
    return;
  }

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  countdownDays.textContent =
    String(days).padStart(2, "0");

  countdownHours.textContent =
    String(hours).padStart(2, "0");

  countdownMinutes.textContent =
    String(minutes).padStart(2, "0");

  countdownSeconds.textContent =
    String(seconds).padStart(2, "0");
}


updateContestCountdown();

setInterval(
  updateContestCountdown,
  1000
);


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/catacaos-color-tradicion/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registrado:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error(
          "Error al registrar el Service Worker:",
          error
        );
      });
  });
}

/* =========================================================
   ESTADO EN VIVO DEL CONCURSO
========================================================= */

const contestLivePanel =
  document.getElementById(
    "contest-live-panel"
  );

const contestLiveStage =
  document.getElementById(
    "contest-live-stage"
  );

const contestLiveDetail =
  document.getElementById(
    "contest-live-detail"
  );

const contestLiveNext =
  document.getElementById(
    "contest-live-next"
  );

const contestLiveUpdate =
  document.getElementById(
    "contest-live-update"
  );

const contestLiveJump =
  document.getElementById(
    "contest-live-jump"
  );

function renderContestLiveStatus(data) {
  if (!contestLivePanel) {
    return;
  }

  if (
    !isLiveAffirmative(data.mostrar) ||
    normalizeLiveValue(data.estado) !== "EN_VIVO"
  ) {
    contestLivePanel.hidden = true;
    return;
  }

  contestLiveStage.textContent =
    data.etapa || "Concurso en desarrollo";

  contestLiveDetail.textContent =
    data.detalle || "";

  contestLiveNext.textContent =
    data.siguiente || "Próxima etapa por confirmar";

  contestLiveUpdate.textContent =
    data.ultima_actualizacion
      ? `Actualizado ${data.ultima_actualizacion}`
      : "";

  contestLivePanel.hidden = false;
}

const CCYT_API_URL =
  "https://script.google.com/macros/s/AKfycbwTqhcJttTFaip35tncMNJG_x18GmS3vbphfA4pVf0PAU3o78v8VUYn5JtvQ9DvGKqy/exec";


/* =========================================================
   RESULTADOS EN VIVO 2026
========================================================= */

const groups2026 =
  document.getElementById("groups-2026");

const liveResultsContainer =
  document.getElementById(
    "live-results-container"
  );

const liveResultsSection =
  document.getElementById("resultados");

const liveResultsNavLink =
  document.getElementById(
    "live-results-nav-link"
  );

const liveRefreshSeconds =
  document.getElementById(
    "live-refresh-seconds"
  );

const liveConnectionState =
  document.getElementById(
    "live-connection-state"
  );

const classifiedSection =
  document.getElementById("clasificados");

const classified2026 =
  document.getElementById(
    "classified-2026"
  );

const liveGlobalUpdate =
  document.getElementById(
    "live-global-update"
  );

const liveGlobalUpdateTime =
  document.getElementById(
    "live-global-update-time"
  );

const liveConnectionWarning =
  document.getElementById(
    "live-connection-warning"
  );

const liveLoadingOverlay =
  document.getElementById(
    "live-loading-overlay"
  );


let lastLivePayload = null;
let changedLiveRows = new Set();
let liveRequestInFlight = false;
const activeLiveFilters = {
  qualifying: "all",
  finals: "all"
};
const liveGroupOpenState = new Map();
let lastLiveFocusSignature = "";


/* =========================================================
   CONSULTA API
========================================================= */

async function loadCompetition2026() {
  /*
    Este código solo funciona en la página
    que contiene los resultados 2026.
  */
  if (
    !groups2026 &&
    !liveResultsContainer &&
    !contestLivePanel
  ) {
    return;
  }

  /*
    Evita peticiones superpuestas si Google Apps Script tarda más
    que el intervalo de actualización.
  */
  if (liveRequestInFlight) {
    return;
  }

  liveRequestInFlight = true;

  if (!lastLivePayload) {
    setLiveConnectionState("connecting");
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(
    () => timeoutController.abort(),
    25000
  );

  try {
    const response = await fetch(
      `${CCYT_API_URL}?_=${Date.now()}`,
      {
        cache: "no-store",
        signal: timeoutController.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const payload = await response.json();

    if (!payload.ok) {
      throw new Error(
        payload.error ||
        "No se pudieron cargar los resultados"
      );
    }

    if (liveConnectionWarning) {
      liveConnectionWarning.hidden = true;
    }

    setLiveConnectionState("connected");

    const isFirstLoad =
      lastLivePayload === null;

    changedLiveRows =
      detectChangedLiveRows(
        lastLivePayload,
        payload
      );

    const hasChanges =
      changedLiveRows.size > 0;

    lastLivePayload = payload;

    renderCompetition2026(payload);

    if (
      isFirstLoad ||
      hasChanges
    ) {
      updateGlobalLiveTime();
    }

  } catch (error) {
    console.error(
      "Error cargando resultados 2026:",
      error
    );

    if (liveConnectionWarning) {
      liveConnectionWarning.hidden = false;
    }

    setLiveConnectionState("reconnecting");

  } finally {
    clearTimeout(timeoutId);
    liveRequestInFlight = false;

    /*
      Pase lo que pase en el primer intento (éxito o error), el
      overlay de "Cargando..." se quita apenas termina esa primera
      petición. Así nunca se queda trabado a pantalla completa: si
      falla, el aviso de "no se pudo actualizar" toma el relevo.
    */
    if (liveLoadingOverlay) {
      liveLoadingOverlay.hidden = true;
    }
  }
}

function updateGlobalLiveTime() {
  if (
    !liveGlobalUpdate ||
    !liveGlobalUpdateTime
  ) {
    return;
  }

  const now = new Date();

  const formattedTime =
    new Intl.DateTimeFormat(
      "es-PE",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    ).format(now);

  liveGlobalUpdateTime.textContent =
    formattedTime;

  liveGlobalUpdate.hidden = false;
}


/* =========================================================
   RENDER GENERAL
========================================================= */

function renderCompetition2026(payload) {
  const config =
    payload.configuracion || {};

  const estado =
    payload.estado || {};

  const liveFocus =
    resolveLiveCompetitionFocus(payload);

  syncLiveCompetitionFocus(liveFocus);

  renderContestLiveStatus(estado);

  renderQualifyingCompetition(
    payload,
    config,
    liveFocus
  );

  renderOtherResults(
    payload,
    config,
    liveFocus
  );

  renderClassifiedCompetition(
    payload
  );

  updateContestLiveJump();
}

function updateContestLiveJump() {
  if (!contestLiveJump) {
    return;
  }

  const currentGroup =
    document.querySelector(
      "details.live-current-group"
    );

  contestLiveJump.hidden = !currentGroup;

  if (!currentGroup) {
    contestLiveJump.onclick = null;
    return;
  }

  contestLiveJump.onclick = () => {
    const container = currentGroup.closest(
      "#groups-2026, #live-results-container"
    );

    const showAllButton =
      container?.querySelector(
        '[data-live-filter="all"]'
      );

    if (
      showAllButton &&
      showAllButton.getAttribute(
        "aria-pressed"
      ) !== "true"
    ) {
      showAllButton.click();
    }

    currentGroup.open = true;

    liveGroupOpenState.set(
      currentGroup.dataset.liveGroupKey,
      true
    );

    currentGroup.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  };
}

async function shareLiveGroupImage(
  groupDetails,
  shareButton
) {
  if (
    !groupDetails ||
    !shareButton
  ) {
    return;
  }

  const originalButtonHtml =
    shareButton.innerHTML;

  shareButton.disabled = true;
  shareButton.innerHTML =
    "<span aria-hidden=\"true\">…</span><b>Preparando</b>";

  try {
    const exportData =
      getLiveGroupExportData(
        groupDetails
      );

    const canvas =
      createLiveGroupCanvas(
        exportData
      );

    const imageBlob =
      await new Promise(
        (resolve, reject) => {
          canvas.toBlob(
            blob => {
              if (blob) {
                resolve(blob);
                return;
              }

              reject(
                new Error(
                  "El navegador no pudo crear el archivo PNG"
                )
              );
            },
            "image/png"
          );
        }
      );

    const fileName =
      `${createLiveExportFileName(
        exportData
      )}.png`;

    const imageFile =
      typeof File === "function"
        ? new File(
            [imageBlob],
            fileName,
            { type: "image/png" }
          )
        : null;

    const canShareFile =
      imageFile &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({
        files: [imageFile]
      });

    if (canShareFile) {
      await navigator.share({
        files: [imageFile],
        title: `${exportData.categoryName} · ${exportData.title}`,
        text: "Resultados actuales de Catacaos, Color y Tradición 2026"
      });

      shareButton.innerHTML =
        "<span aria-hidden=\"true\">✓</span><b>Compartida</b>";
    } else {
      downloadLiveImageFile(
        imageBlob,
        fileName
      );

      shareButton.innerHTML =
        "<span aria-hidden=\"true\">↓</span><b>Descargada</b>";
    }
  } catch (error) {
    if (error?.name === "AbortError") {
      shareButton.innerHTML =
        originalButtonHtml;
      shareButton.disabled = false;
      return;
    }

    console.error(
      "No se pudo compartir la imagen del grupo o final:",
      error
    );

    shareButton.innerHTML =
      "<span aria-hidden=\"true\">!</span><b>Error</b>";
  }

  window.setTimeout(() => {
    shareButton.disabled = false;
    shareButton.innerHTML =
      originalButtonHtml;
  }, 1800);
}

function downloadLiveImageFile(
  imageBlob,
  fileName
) {
  const imageUrl =
    URL.createObjectURL(imageBlob);

  const downloadLink =
    document.createElement("a");

  downloadLink.download = fileName;
  downloadLink.href = imageUrl;

  document.body.appendChild(
    downloadLink
  );

  downloadLink.click();
  downloadLink.remove();

  window.setTimeout(
    () => URL.revokeObjectURL(imageUrl),
    1000
  );
}

function getLiveGroupExportData(
  currentGroup
) {
  const categoryNames = {
    general: "Danzas Nacionales",
    caporales: "Caporales",
    infantil: "Infantil",
    campeones: "Campeón de Campeones"
  };

  const themes = {
    general: {
      primary: "#0b6d7c",
      soft: "#eaf6f7"
    },
    caporales: {
      primary: "#9f2629",
      soft: "#fff0f0"
    },
    infantil: {
      primary: "#a97f00",
      soft: "#fff7d5"
    },
    campeones: {
      primary: "#6f4aa8",
      soft: "#f2ecfa"
    }
  };

  const category =
    [
      "general",
      "caporales",
      "infantil",
      "campeones"
    ].find(name =>
      currentGroup.classList.contains(
        `live-category-${name}`
      )
    ) || "general";

  const rows = [
    ...currentGroup.querySelectorAll(
      ".live-scores-table tbody tr"
    )
  ].map(row => {
    const scoreCells = [
      ...row.querySelectorAll(
        ".live-score-cell"
      )
    ];

    const total =
      row.querySelector(
        ".live-total"
      )?.textContent.trim() || "";

    const state =
      row.querySelector(
        ".live-result-state, .live-disqualified"
      )?.textContent.trim() || "";

    return {
      order:
        row.dataset.exportOrder ||
        row.querySelector(
          ".live-order-cell"
        )?.textContent.trim() || "—",
      group:
        row.dataset.exportGroup ||
        row.querySelector(
          ".live-group-cell > strong"
        )?.textContent.trim() || "",
      dance:
        row.dataset.exportDance ||
        row.querySelector(
          ".live-dance-cell"
        )?.textContent.trim() || "",
      scores: scoreCells.map(cell => ({
        label: cell.dataset.label || "",
        value: cell.textContent.trim() || "—"
      })),
      total: total || state || "Pendiente",
      classified: Boolean(
        row.querySelector(
          ".live-classified"
        )
      ),
      evaluating: row.classList.contains(
        "live-evaluating-row"
      ),
      disqualified: row.classList.contains(
        "live-disqualified-row"
      )
    };
  });

  return {
    category,
    categoryName:
      categoryNames[category],
    theme: themes[category],
    stage:
      currentGroup.classList.contains(
        "live-phase-final"
      )
        ? "Etapa final"
        : "Fase clasificatoria",
    title:
      currentGroup.querySelector(
        ".live-table-heading h3"
      )?.textContent.trim() ||
      "Grupo actual",
    rows,
    updatedAt:
      new Intl.DateTimeFormat(
        "es-PE",
        {
          dateStyle: "long",
          timeStyle: "short"
        }
      ).format(new Date())
  };
}

function createLiveGroupCanvas(data) {
  const scoreLabels = [
    ...new Set(
      data.rows.flatMap(row =>
        row.scores.map(score =>
          score.label
        )
      )
    )
  ];

  const hasDance =
    data.rows.some(row => row.dance);

  const columns = [
    {
      key: "order",
      label: "ORDEN",
      width: 90,
      align: "center"
    },
    {
      key: "group",
      label: "AGRUPACIÓN",
      width: 350,
      align: "left"
    },
    ...(hasDance
      ? [{
          key: "dance",
          label: "DANZA",
          width: 260,
          align: "left"
        }]
      : []),
    ...scoreLabels.map(label => ({
      key: `score-${label}`,
      label,
      width: 105,
      align: "center"
    })),
    {
      key: "total",
      label: "TOTAL",
      width: 150,
      align: "center"
    }
  ];

  const tableWidth =
    columns.reduce(
      (sum, column) =>
        sum + column.width,
      0
    );

  const width = Math.max(
    1080,
    tableWidth + 100
  );
  const headerHeight = 275;
  const tableHeaderHeight = 68;
  const rowHeight = 112;
  const footerHeight = 90;
  const tableY = headerHeight + 30;

  const height = Math.max(
    650,
    tableY +
      tableHeaderHeight +
      data.rows.length * rowHeight +
      footerHeight
  );

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

  context.fillStyle = "#f4f7f7";
  context.fillRect(0, 0, width, height);

  context.fillStyle = data.theme.primary;
  context.fillRect(
    0,
    0,
    width,
    headerHeight
  );

  context.fillStyle = "rgba(255,255,255,0.14)";
  context.beginPath();
  context.arc(
    width - 80,
    45,
    180,
    0,
    Math.PI * 2
  );
  context.fill();

  context.fillStyle = "#ffffff";
  context.font =
    '800 25px "Montserrat", Arial, sans-serif';
  context.fillText(
    "CATACAOS, COLOR Y TRADICIÓN 2026",
    60,
    58
  );

  context.fillStyle = "rgba(255,255,255,0.78)";
  context.font =
    '700 23px "Montserrat", Arial, sans-serif';
  context.fillText(
    data.categoryName.toUpperCase(),
    60,
    108
  );

  context.fillStyle = "#ffffff";
  context.font =
    '800 48px "Montserrat", Arial, sans-serif';

  drawLiveCanvasText(
    context,
    `${data.stage} · ${data.title}`,
    60,
    165,
    width - 120,
    54,
    2
  );

  context.fillStyle = "rgba(255,255,255,0.82)";
  context.font =
    '600 21px "Nunito Sans", Arial, sans-serif';
  context.fillText(
    `Datos actuales · ${data.updatedAt}`,
    60,
    250
  );

  drawLiveResultsTable(
    context,
    data,
    columns,
    scoreLabels,
    50,
    tableY,
    tableWidth,
    tableHeaderHeight,
    rowHeight
  );

  context.fillStyle = "#6a737b";
  context.font =
    '600 20px "Nunito Sans", Arial, sans-serif';
  context.textAlign = "center";
  context.fillText(
    "Resultados en vivo · Los puntajes pueden actualizarse durante el concurso",
    width / 2,
    height - 42
  );
  context.textAlign = "left";

  return canvas;
}

function drawLiveResultsTable(
  context,
  data,
  columns,
  scoreLabels,
  x,
  y,
  width,
  headerHeight,
  rowHeight
) {
  drawLiveRoundedRect(
    context,
    x,
    y,
    width,
    headerHeight +
      data.rows.length * rowHeight,
    18,
    "#ffffff",
    "#d6e0e1",
    2
  );

  drawLiveRoundedRect(
    context,
    x,
    y,
    width,
    headerHeight,
    18,
    data.theme.primary,
    null,
    0
  );

  let columnX = x;

  columns.forEach(column => {
    context.fillStyle = "#ffffff";
    context.font =
      '800 17px "Montserrat", Arial, sans-serif';
    context.textAlign =
      column.align === "center"
        ? "center"
        : "left";

    context.fillText(
      column.label,
      column.align === "center"
        ? columnX + column.width / 2
        : columnX + 14,
      y + 42
    );

    columnX += column.width;
  });

  data.rows.forEach((row, rowIndex) => {
    const rowY =
      y + headerHeight +
      rowIndex * rowHeight;

    let rowFill =
      rowIndex % 2 === 0
        ? "#ffffff"
        : "#f7f9f9";

    if (row.classified) {
      rowFill = "#edf9f1";
    } else if (row.evaluating) {
      rowFill = "#fff8dc";
    } else if (row.disqualified) {
      rowFill = "#fff0f0";
    }

    context.fillStyle = rowFill;
    context.fillRect(
      x + 1,
      rowY,
      width - 2,
      rowHeight
    );

    context.fillStyle =
      row.classified
        ? "#37a85d"
        : row.evaluating
          ? "#e0a900"
          : row.disqualified
            ? "#9f2629"
            : data.theme.primary;
    context.fillRect(
      x + 1,
      rowY,
      7,
      rowHeight
    );

    const scoresByLabel =
      Object.fromEntries(
        row.scores.map(score => [
          score.label,
          score.value
        ])
      );

    const values = {
      order: row.order,
      group: row.group,
      dance: row.dance,
      total: row.total
    };

    scoreLabels.forEach(label => {
      values[`score-${label}`] =
        scoresByLabel[label] || "—";
    });

    columnX = x;

    columns.forEach((column, columnIndex) => {
      const value =
        String(values[column.key] || "—");

      if (columnIndex > 0) {
        context.strokeStyle = "#dfe7e8";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(columnX, rowY);
        context.lineTo(
          columnX,
          rowY + rowHeight
        );
        context.stroke();
      }

      if (
        column.key === "group" ||
        column.key === "dance"
      ) {
        context.fillStyle =
          column.key === "group"
            ? "#17242c"
            : "#59656d";
        context.font =
          column.key === "group"
            ? '800 21px "Montserrat", Arial, sans-serif'
            : '600 19px "Nunito Sans", Arial, sans-serif';
        context.textAlign = "left";

        drawLiveCanvasText(
          context,
          value,
          columnX + 14,
          rowY + 39,
          column.width - 28,
          25,
          2
        );
      } else {
        context.fillStyle =
          column.key === "total"
            ? data.theme.primary
            : "#17242c";
        context.font =
          column.key === "total"
            ? value.length > 8
              ? '800 16px "Montserrat", Arial, sans-serif'
              : '800 23px "Montserrat", Arial, sans-serif'
            : '800 21px "Montserrat", Arial, sans-serif';
        context.textAlign = "center";
        context.fillText(
          value,
          columnX + column.width / 2,
          rowY + 65
        );

        if (
          column.key === "total" &&
          row.classified
        ) {
          context.fillStyle = "#176b35";
          context.font =
            '800 13px "Montserrat", Arial, sans-serif';
          context.fillText(
            "CLASIFICADO",
            columnX + column.width / 2,
            rowY + 91
          );
        }
      }

      columnX += column.width;
    });

    context.strokeStyle = "#dfe7e8";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x, rowY + rowHeight);
    context.lineTo(
      x + width,
      rowY + rowHeight
    );
    context.stroke();
  });

  context.textAlign = "left";
}

function drawLiveCanvasText(
  context,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  maxLines
) {
  const words =
    String(text || "").split(/\s+/);
  const lines = [];
  let currentLine = "";

  words.forEach(word => {
    const candidate = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (
      context.measureText(candidate).width >
        maxWidth &&
      currentLine
    ) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  const visibleLines =
    lines.slice(0, maxLines);

  if (lines.length > maxLines) {
    let lastLine =
      visibleLines[maxLines - 1];

    while (
      lastLine &&
      context.measureText(
        `${lastLine}…`
      ).width > maxWidth
    ) {
      lastLine = lastLine.slice(0, -1);
    }

    visibleLines[maxLines - 1] =
      `${lastLine}…`;
  }

  visibleLines.forEach(
    (line, index) => {
      context.fillText(
        line,
        x,
        y + index * lineHeight
      );
    }
  );
}

function drawLiveRoundedRect(
  context,
  x,
  y,
  width,
  height,
  radius,
  fill,
  stroke,
  strokeWidth
) {
  const safeRadius = Math.min(
    radius,
    width / 2,
    height / 2
  );

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(
    x + width - safeRadius,
    y
  );
  context.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + safeRadius
  );
  context.lineTo(
    x + width,
    y + height - safeRadius
  );
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height
  );
  context.lineTo(
    x + safeRadius,
    y + height
  );
  context.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - safeRadius
  );
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(
    x,
    y,
    x + safeRadius,
    y
  );
  context.closePath();

  context.fillStyle = fill;
  context.fill();

  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = strokeWidth;
    context.stroke();
  }
}

function createLiveExportFileName(data) {
  return [
    data.categoryName,
    data.title,
    "resultados-actuales"
  ]
    .join("-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderQualifyingCompetition(
  payload,
  config,
  liveFocus
) {
  if (!groups2026) {
    return;
  }

  const sections = [];
  const availableCategories = [];


  /* ==========================================
     DANZAS NACIONALES
  ========================================== */

  if (
    isLiveAffirmative(
      config.mostrar_general
    )
  ) {
    const generalRows =
      (payload.general || []).filter(
        row =>
          normalizeLiveValue(row.fase) ===
            "CLASIFICATORIA" &&
          hasLiveParticipant(row)
      );

    const generalGroups =
      groupRowsBy(
        generalRows,
        "grupo"
      );

    if (
      Object.keys(generalGroups).length
    ) {
      availableCategories.push("general");

      sections.push(`
        <div class="qualifying-category-title qualifying-category-general" data-live-category="general">
          <span>Danzas Nacionales</span>
          <h3>Grupos clasificatorios</h3>
        </div>
      `);

      Object.entries(generalGroups)
        .sort(([a], [b]) =>
          a.localeCompare(b)
        )
        .forEach(
          ([groupName, rows], index) => {
            sections.push(
              createScoreTable({
                title:
                  `Grupo ${groupName}`,
                rows,
                showDance: true,
                showClassification: true,
                category: "general",
                phase: "qualifying",
                liveFocus
              })
            );
          }
        );
    }
  }


  /* ==========================================
     CAPORALES
  ========================================== */

  if (
    isLiveAffirmative(
      config.mostrar_caporales
    )
  ) {
    const caporalesRows =
      (payload.caporales || []).filter(
        row =>
          normalizeLiveValue(row.fase) ===
            "CLASIFICATORIA" &&
          hasLiveParticipant(row)
      );

    const caporalesGroups =
      groupRowsBy(
        caporalesRows,
        "grupo"
      );

    if (
      Object.keys(caporalesGroups).length
    ) {
      availableCategories.push("caporales");

      sections.push(`
        <div class="
          qualifying-category-title
          qualifying-category-caporales
        " data-live-category="caporales">
          <span>Caporales</span>
          <h3>Grupos clasificatorios</h3>
        </div>
      `);

      Object.entries(caporalesGroups)
        .sort(([a], [b]) =>
          a.localeCompare(b)
        )
        .forEach(
          ([groupName, rows], index) => {
            sections.push(
              createScoreTable({
                title:
                  `Grupo ${groupName}`,
                rows,
                showDance: false,
                showClassification: true,
                category: "caporales",
                phase: "qualifying",
                liveFocus
              })
            );
          }
        );
    }
  }


  /* ==========================================
     SIN GRUPOS
  ========================================== */

  if (!sections.length) {
    groups2026.innerHTML = `
      <div class="results-waiting small">

        <div class="results-waiting-icon">
          🎭
        </div>

        <h3>
          Grupos próximamente
        </h3>

        <p>
          La distribución será publicada
          después del sorteo oficial.
        </p>

      </div>
    `;

    return;
  }


  groups2026.innerHTML =
    createLiveCategoryFilters(
      availableCategories,
      "qualifying"
    ) + sections.join("");

  setupLiveCategoryFilters(
    groups2026,
    "qualifying"
  );

  setupLiveGroupToggles(groups2026);
}

function createScoreTable(options) {
  const {
    title,
    rows,
    showDance,
    showClassification,
    category = "",
    phase = "qualifying",
    liveFocus = null
  } = options;

  const sortedRows = [...rows].sort(
    (a, b) =>
      Number(a.orden || 999) -
      Number(b.orden || 999)
  );

  const jurors =
    getVisibleJurors(sortedRows);

  const groupKey = [
    phase,
    category,
    normalizeLiveValue(title)
  ].join("|");

  const isCurrentGroup =
    isLiveCompetitionGroupCurrent(
      liveFocus,
      phase,
      category,
      title
    );

  const shouldExpand =
    liveGroupOpenState.has(groupKey)
      ? liveGroupOpenState.get(groupKey)
      : isCurrentGroup;

  const jurorHeaders =
    jurors
      .map(
        juror =>
          `<th>${juror.toUpperCase()}</th>`
      )
      .join("");

  const body =
    sortedRows
      .map(row => {
        return createScoreRow(
          row,
          jurors,
          showDance,
          showClassification,
          category
        );
      })
      .join("");

  return `
    <details
      class="group-block live-group-block live-category-${category} live-phase-${phase}${isCurrentGroup ? " live-current-group" : ""}"
      data-live-category="${category}"
      data-live-group-key="${escapeLiveHtml(groupKey)}"
      ${shouldExpand ? "open" : ""}
    >

      <summary class="live-table-heading">
        <h3>${escapeLiveHtml(title)}</h3>

        <span class="live-table-meta">
          ${isCurrentGroup
      ? "En curso ahora"
      : "Actualización automática"
    }
        </span>

        <button
          type="button"
          class="live-group-share"
          data-live-share
          aria-label="Compartir imagen de ${escapeLiveAttribute(title)}"
          title="Compartir como imagen"
        >
          <span aria-hidden="true">↗</span>
          <b>Compartir</b>
        </button>

        <span class="live-table-toggle" aria-hidden="true">
          <span class="live-table-toggle-label"></span>
          <span class="live-table-toggle-icon"></span>
        </span>
      </summary>

      <div class="scores-table-wrapper">

        <table class="scores-table live-scores-table live-jurors-${jurors.length}">

          <thead>
            <tr>
              <th>Orden</th>
              <th>Agrupación</th>

              ${showDance
      ? "<th>Danza</th>"
      : ""
    }

              ${jurorHeaders}

              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            ${body}
          </tbody>

        </table>

      </div>

    </details>
  `;
}

function createLiveCategoryFilters(
  categories,
  scope
) {
  if (categories.length <= 1) {
    activeLiveFilters[scope] = "all";
    return "";
  }

  const labels = {
    general: "Danzas",
    caporales: "Caporales",
    infantil: "Infantil",
    campeones: "Campeones"
  };

  const activeCategory =
    categories.includes(activeLiveFilters[scope])
      ? activeLiveFilters[scope]
      : "all";

  activeLiveFilters[scope] = activeCategory;

  return `
    <div class="live-category-filters" data-live-filter-scope="${scope}" role="group" aria-label="Filtrar categorías">
      <button type="button" data-live-filter="all" aria-pressed="${activeCategory === "all"}">
        Todas
      </button>

      ${categories.map(category => `
        <button
          type="button"
          data-live-filter="${category}"
          aria-pressed="${activeCategory === category}"
        >
          ${labels[category] || category}
        </button>
      `).join("")}
    </div>
  `;
}

function setupLiveCategoryFilters(
  container,
  scope
) {
  const filterBar =
    container.querySelector(
      `[data-live-filter-scope="${scope}"]`
    );

  if (!filterBar) {
    return;
  }

  const applyFilter = category => {
    activeLiveFilters[scope] = category;

    filterBar
      .querySelectorAll("[data-live-filter]")
      .forEach(button => {
        button.setAttribute(
          "aria-pressed",
          String(
            button.dataset.liveFilter === category
          )
        );
      });

    container
      .querySelectorAll("[data-live-category]")
      .forEach(element => {
        element.hidden =
          category !== "all" &&
          element.dataset.liveCategory !== category;
      });
  };

  filterBar.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-live-filter]"
        );

      if (!button) {
        return;
      }

      applyFilter(
        button.dataset.liveFilter
      );
    }
  );

  applyFilter(activeLiveFilters[scope]);
}

function setupLiveGroupToggles(container) {
  container
    .querySelectorAll(
      "details[data-live-group-key]"
    )
    .forEach(details => {
      details.addEventListener(
        "toggle",
        () => {
          liveGroupOpenState.set(
            details.dataset.liveGroupKey,
            details.open
          );
        }
      );
    });

  container
    .querySelectorAll(
      "[data-live-share]"
    )
    .forEach(shareButton => {
      shareButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          event.stopPropagation();

          const groupDetails =
            shareButton.closest(
              "details[data-live-group-key]"
            );

          shareLiveGroupImage(
            groupDetails,
            shareButton
          );
        }
      );
    });
}

function createScoreRow(
  row,
  jurors,
  showDance,
  showClassification,
  category
) {
  const published =
    isLiveRowPublished(row);

  const evaluating =
    isLiveRowEvaluating(row);

  const disqualified =
    published &&
    isLiveAffirmative(
      row.descalificado
    );

  const classified =
    published &&
    showClassification &&
    isLiveAffirmative(
      row.clasificado
    );

  let rowClass = "";

  if (disqualified) {
    rowClass = "live-disqualified-row";
  } else if (classified) {
    rowClass = "classified-row";
  } else if (evaluating) {
    rowClass = "live-evaluating-row";
  }

  const jurorCells =
    jurors
      .map(juror => {
        const jurorLabel = juror.toUpperCase();

        if (!published) {
          return `
            <td class="live-score-cell score-pending" data-label="${jurorLabel}">
              —
            </td>
          `;
        }

        return `
          <td class="live-score-cell" data-label="${jurorLabel}">
            ${escapeLiveHtml(
          row[juror] || "—"
        )}
          </td>
        `;
      })
      .join("");

  const rowKey =
    getLiveRowKey(
      category,
      row
    );

  const rowUpdated =
    changedLiveRows.has(rowKey);

  if (rowUpdated) {
    rowClass += " live-row-updated";
  }

  const changeIndicator = rowUpdated
    ? `
        <span class="live-score-change" title="Puntaje actualizado" aria-label="Puntaje actualizado">
          ↑
        </span>
      `
    : "";

  let resultCell;

  if (!published) {
    resultCell = `
      <td class="live-total-cell" data-label="Total">
        <span class="live-result-state ${evaluating
        ? "is-evaluating"
        : ""
      }">
          ${evaluating
        ? "En evaluación"
        : "Pendiente"
      }
        </span>
        ${changeIndicator}
      </td>
    `;
  } else if (disqualified) {
    resultCell = `
      <td class="live-total-cell" data-label="Total">
        <span class="live-disqualified">
          Descalificado
        </span>

        ${row.motivo
        ? `
              <small class="live-result-note">
                ${escapeLiveHtml(
          row.motivo
        )}
              </small>
            `
        : ""
      }
        ${changeIndicator}
      </td>
    `;
  } else {
    resultCell = `
      <td class="live-total-cell" data-label="Total">
        <strong class="live-total">
          ${escapeLiveHtml(
      row.total || "—"
    )}
        </strong>

        ${Number(row.penalizacion) > 0
        ? `
              <small class="live-penalty">
                -${escapeLiveHtml(
          row.penalizacion
        )} pts
              </small>
            `
        : ""
      }

        ${classified
        ? `
              <small class="live-classified">
                Clasificado
              </small>
            `
        : ""
      }
        ${changeIndicator}
      </td>
    `;
  }

  return `
    <tr
      class="${rowClass}"
      data-export-order="${escapeLiveAttribute(row.orden || "—")}"
      data-export-group="${escapeLiveAttribute(row.agrupacion || "")}"
      data-export-dance="${escapeLiveAttribute(row.danza || "")}"
    >
      <td class="live-order-cell" data-label="Orden">
        ${escapeLiveHtml(
    row.orden || "—"
  )}
      </td>

      <td class="live-group-cell" data-label="Agrupación">
        <strong>
          ${escapeLiveHtml(
    row.agrupacion || ""
        )}
        </strong>

        ${showDance && row.danza
      ? `
            <span class="live-mobile-dance">
              ${escapeLiveHtml(row.danza)}
            </span>
          `
      : ""
    }

        ${evaluating
      ? `
            <small class="live-current-badge">
              <i></i>
              Compitiendo ahora
            </small>
          `
      : ""
    }
      </td>

      ${showDance
      ? `
            <td class="live-dance-cell" data-label="Danza">
              ${escapeLiveHtml(
        row.danza || ""
      )}
            </td>
          `
      : ""
    }

      ${jurorCells}

      ${resultCell}
    </tr>
  `;
}

function getVisibleJurors(rows) {
  const jurors = [
    "j1",
    "j2",
    "j3",
    "j4",
    "j5"
  ];

  return jurors.filter(juror =>
    rows.some(row => {
      return (
        isLiveRowPublished(row) &&
        String(row[juror] || "").trim() !== ""
      );
    })
  );
}

function renderClassifiedCompetition(
  payload
) {
  if (
    !classifiedSection ||
    !classified2026
  ) {
    return;
  }

  const general =
    (payload.general || [])
      .filter(row =>
        normalizeLiveValue(row.fase) ===
          "CLASIFICATORIA" &&
        hasLiveParticipant(row) &&
        isLiveRowPublished(row) &&
        isLiveAffirmative(row.clasificado) &&
        !isLiveAffirmative(row.descalificado)
      );

  const caporales =
    (payload.caporales || [])
      .filter(row =>
        normalizeLiveValue(row.fase) ===
          "CLASIFICATORIA" &&
        hasLiveParticipant(row) &&
        isLiveRowPublished(row) &&
        isLiveAffirmative(row.clasificado) &&
        !isLiveAffirmative(row.descalificado)
      );


  if (
    !general.length &&
    !caporales.length
  ) {
    classifiedSection.hidden = true;
    classified2026.innerHTML = "";
    return;
  }


  classifiedSection.hidden = false;

  let html = "";


  /* DANZAS NACIONALES */

  if (general.length) {
    html += `
      <div class="classified-category">

        <div class="classified-category-heading">
          <span>Danzas Nacionales</span>

          <div class="classified-category-title-row">
            <h3>
              Clasificados a la Gran Final
            </h3>

            <strong class="classified-count">
              ${general.length}
            </strong>
          </div>
        </div>

        <div class="classified-live-grid">

          ${general
            .sort((a, b) =>
              String(a.grupo)
                .localeCompare(
                  String(b.grupo)
                )
            )
            .map(row => `
              <article
                class="classified-live-card"
              >

                <span class="classified-group-chip">
                  Grupo ${escapeLiveHtml(
                    row.grupo
                  )}
                </span>

                <h3>
                  ${escapeLiveHtml(
                    row.agrupacion
                  )}
                </h3>

                ${row.danza
                  ? `
                      <p>
                        ${escapeLiveHtml(row.danza)}
                      </p>
                    `
                  : ""
                }

                <strong class="classified-total">
                  ${escapeLiveHtml(
                    row.total
                  )} pts
                </strong>

              </article>
            `)
            .join("")}

        </div>

      </div>
    `;
  }


  /* CAPORALES */

  if (caporales.length) {
    html += `
      <div
        class="classified-category
               classified-category-caporales"
      >

        <div class="classified-category-heading">
          <span>Caporales</span>

          <div class="classified-category-title-row">
            <h3>
              Clasificados a la Gran Final
            </h3>

            <strong class="classified-count">
              ${caporales.length}
            </strong>
          </div>
        </div>

        <div class="classified-live-grid">

          ${caporales
            .sort((a, b) =>
              String(a.grupo)
                .localeCompare(
                  String(b.grupo)
                )
            )
            .map(row => `
              <article
                class="classified-live-card
                       classified-caporales-card"
              >

                <span class="classified-group-chip">
                  Grupo ${escapeLiveHtml(
                    row.grupo
                  )}
                </span>

                <h3>
                  ${escapeLiveHtml(
                    row.agrupacion
                  )}
                </h3>

                <strong class="classified-total">
                  ${escapeLiveHtml(
                    row.total
                  )} pts
                </strong>

              </article>
            `)
            .join("")}

        </div>

      </div>
    `;
  }


  classified2026.innerHTML = html;
}

function renderOtherResults(
  payload,
  config,
  liveFocus
) {
  if (!liveResultsContainer) {
    return;
  }

  const sections = [];
  const availableCategories = [];

  /*
    FINAL GENERAL
  */
  if (
    isLiveAffirmative(
      config.mostrar_final_general
    )
  ) {
    const finalGeneral =
      (payload.general || []).filter(
        row =>
          normalizeLiveValue(row.fase) ===
            "FINAL" &&
          hasLiveParticipant(row)
      );

    if (finalGeneral.length) {
      availableCategories.push("general");

      sections.push(
        createScoreTable({
          title:
            "Gran Final - Danzas Nacionales",
          rows: finalGeneral,
          showDance: true,
          showClassification: false,
          category: "general",
          phase: "final",
          liveFocus
        })
      );
    }
  }


  /*
    INFANTIL
  */
  if (
    isLiveAffirmative(
      config.mostrar_infantil
    )
  ) {
    const infantil =
      (payload.infantil || [])
        .filter(hasLiveParticipant);

    if (infantil.length) {
      availableCategories.push("infantil");

      sections.push(
        createScoreTable({
          title:
            "Categoría Infantil",
          rows: infantil,
          showDance: true,
          showClassification: false,
          category: "infantil",
          phase: "final",
          liveFocus
        })
      );
    }
  }


  /*
    FINAL CAPORALES
  */
  if (
    isLiveAffirmative(
      config.mostrar_final_caporales
    )
  ) {
    const finalCaporales =
      (payload.caporales || []).filter(
        row =>
          normalizeLiveValue(row.fase) ===
            "FINAL" &&
          hasLiveParticipant(row)
      );

    if (finalCaporales.length) {
      availableCategories.push("caporales");

      sections.push(
        createScoreTable({
          title:
            "Gran Final - Caporales",
          rows: finalCaporales,
          showDance: false,
          showClassification: false,
          category: "caporales",
          phase: "final",
          liveFocus
        })
      );
    }
  }


  /*
    CAMPEÓN DE CAMPEONES
  */
  if (
    isLiveAffirmative(
      config.mostrar_campeones
    )
  ) {
    const campeones =
      (payload.campeones || [])
        .filter(hasLiveParticipant);

    if (campeones.length) {
      availableCategories.push("campeones");

      sections.push(
        createScoreTable({
          title:
            "Campeón de Campeones",
          rows: campeones,
          showDance: true,
          showClassification: false,
          category: "campeones",
          phase: "final",
          liveFocus
        })
      );
    }
  }


  if (!sections.length) {
    liveResultsContainer.innerHTML = "";

    if (liveResultsSection) {
      liveResultsSection.hidden = true;
    }

    if (liveResultsNavLink) {
      liveResultsNavLink.hidden = true;
    }

    return;
  }

  liveResultsContainer.innerHTML =
    createLiveCategoryFilters(
      availableCategories,
      "finals"
    ) + sections.join("");

  setupLiveCategoryFilters(
    liveResultsContainer,
    "finals"
  );

  setupLiveGroupToggles(
    liveResultsContainer
  );

  if (liveResultsSection) {
    liveResultsSection.hidden = false;
  }

  if (liveResultsNavLink) {
    liveResultsNavLink.hidden = false;
  }
}

function setLiveConnectionState(state) {
  if (!liveConnectionState) {
    return;
  }

  const labels = {
    connecting: "Conectando",
    connected: "Conectado",
    reconnecting: "Reconectando"
  };

  liveConnectionState.textContent =
    labels[state] || labels.connecting;

  liveConnectionState.className =
    `live-connection-state is-${state}`;
}

function groupRowsBy(rows, property) {
  return rows.reduce(
    (groups, row) => {
      const key =
        String(row[property] || "")
          .trim();

      if (!key) {
        return groups;
      }

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(row);

      return groups;
    },
    {}
  );
}


function normalizeLiveValue(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function hasLiveParticipant(row) {
  return Boolean(
    String(row?.agrupacion || "").trim()
  );
}

function resolveLiveCompetitionFocus(payload) {
  const status = payload.estado || {};
  const stage = normalizeLiveValue(status.etapa);
  const detail = normalizeLiveValue(status.detalle);

  let category = "";

  if (stage.includes("CAPORAL")) {
    category = "caporales";
  } else if (stage.includes("INFANTIL")) {
    category = "infantil";
  } else if (stage.includes("CAMPEON")) {
    category = "campeones";
  } else if (
    stage.includes("DANZA") ||
    stage.includes("NACIONAL")
  ) {
    category = "general";
  }

  let phase = "";

  if (stage.includes("CLASIFICATORIA")) {
    phase = "qualifying";
  } else if (
    stage.includes("FINAL") ||
    category === "infantil" ||
    category === "campeones"
  ) {
    phase = "final";
  }

  if (category && phase) {
    return {
      category,
      phase,
      detail,
      source: "status"
    };
  }

  const collections = [
    ["general", payload.general || []],
    ["caporales", payload.caporales || []],
    ["infantil", payload.infantil || []],
    ["campeones", payload.campeones || []]
  ];

  for (const [fallbackCategory, rows] of collections) {
    const evaluatingRow = rows.find(
      row =>
        hasLiveParticipant(row) &&
        isLiveRowEvaluating(row)
    );

    if (!evaluatingRow) {
      continue;
    }

    const fallbackPhase =
      fallbackCategory === "general" ||
      fallbackCategory === "caporales"
        ? normalizeLiveValue(evaluatingRow.fase) === "FINAL"
          ? "final"
          : "qualifying"
        : "final";

    return {
      category: fallbackCategory,
      phase: fallbackPhase,
      detail:
        fallbackPhase === "qualifying"
          ? normalizeLiveValue(
              `Grupo ${evaluatingRow.grupo || ""}`
            )
          : "",
      source: "row"
    };
  }

  return null;
}

function syncLiveCompetitionFocus(liveFocus) {
  const signature = liveFocus
    ? [
        liveFocus.phase,
        liveFocus.category,
        liveFocus.detail
      ].join("|")
    : "";

  if (signature === lastLiveFocusSignature) {
    return;
  }

  liveGroupOpenState.clear();
  lastLiveFocusSignature = signature;
}

function isLiveCompetitionGroupCurrent(
  liveFocus,
  phase,
  category,
  title
) {
  if (
    !liveFocus ||
    liveFocus.phase !== phase ||
    liveFocus.category !== category
  ) {
    return false;
  }

  if (phase === "final") {
    return true;
  }

  const normalizedTitle =
    normalizeLiveValue(title);

  return Boolean(
    liveFocus.detail &&
    (
      normalizedTitle === liveFocus.detail ||
      normalizedTitle.includes(liveFocus.detail) ||
      liveFocus.detail.includes(normalizedTitle)
    )
  );
}

function isLiveRowPublished(row) {
  return (
    isLiveAffirmative(row.publicar) ||
    normalizeLiveValue(row.estado) === "PUBLICADO"
  );
}

function isLiveAffirmative(value) {
  return ["SI", "TRUE", "1", "X"].includes(
    normalizeLiveValue(value)
  );
}

function isLiveRowEvaluating(row) {
  return (
    !isLiveRowPublished(row) &&
    normalizeLiveValue(row.estado) ===
      "EN_EVALUACION"
  );
}


function escapeLiveHtml(value) {
  const element =
    document.createElement("div");

  element.textContent =
    String(value ?? "");

  return element.innerHTML;
}

function escapeLiveAttribute(value) {
  return escapeLiveHtml(value)
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function detectChangedLiveRows(
  previousPayload,
  currentPayload
) {
  const changed = new Set();

  if (!previousPayload) {
    return changed;
  }

  const categories = [
    "general",
    "infantil",
    "caporales",
    "campeones"
  ];

  categories.forEach(category => {
    const previousRows =
      previousPayload[category] || [];

    const currentRows =
      currentPayload[category] || [];

    currentRows.forEach(currentRow => {
      const key =
        getLiveRowKey(
          category,
          currentRow
        );

      const previousRow =
        previousRows.find(row =>
          getLiveRowKey(
            category,
            row
          ) === key
        );

      if (!previousRow) {
        return;
      }

      const fieldsToCompare = [
        "j1",
        "j2",
        "j3",
        "j4",
        "j5",
        "subtotal",
        "penalizacion",
        "total",
        "estado",
        "clasificado",
        "descalificado",
        "publicar"
      ];

      const hasChanged =
        fieldsToCompare.some(field =>
          String(previousRow[field] || "") !==
          String(currentRow[field] || "")
        );

      if (hasChanged) {
        changed.add(key);
      }
    });
  });

  return changed;
}

function getLiveRowKey(
  category,
  row
) {
  return [
    category,
    row.fase || "",
    row.grupo || "",
    row.orden || "",
    row.agrupacion || ""
  ].join("|");
}

/* =========================================================
   ACTIVAR CONSULTAS EN VIVO SOLO EL DÍA DEL CONCURSO
========================================================= */

let liveCompetitionInterval = null;

const LIVE_RESULTS_START =
  new Date("2026-10-25T11:00:00-05:00");

const LIVE_RESULTS_REFRESH_MS = 15000;

if (liveRefreshSeconds) {
  liveRefreshSeconds.textContent =
    String(LIVE_RESULTS_REFRESH_MS / 1000);
}


function startLiveCompetitionUpdates() {
  if (
    !groups2026 &&
    !liveResultsContainer &&
    !contestLivePanel
  ) {
    return;
  }

  /*
    Evita crear más de un intervalo.
  */
  if (liveCompetitionInterval) {
    return;
  }

  /*
    El overlay solo aparece cuando el modo concurso está activo:
    desde la fecha programada o mediante ?preview=concurso2026.
  */
  if (liveLoadingOverlay) {
    liveLoadingOverlay.hidden = false;
  }

  /*
    Primera carga inmediata.
  */
  loadCompetition2026();

  /*
    Luego actualizamos cada 15 segundos. Es suficientemente rápido
    para el seguimiento en vivo y reduce la carga cuando hay muchas
    personas conectadas al mismo tiempo.
  */
  liveCompetitionInterval = setInterval(
    loadCompetition2026,
    LIVE_RESULTS_REFRESH_MS
  );
}


function stopLiveCompetitionUpdates() {
  if (liveLoadingOverlay) {
    liveLoadingOverlay.hidden = true;
  }

  if (!liveCompetitionInterval) {
    return;
  }

  clearInterval(
    liveCompetitionInterval
  );

  liveCompetitionInterval = null;
}


function checkLiveCompetitionTime() {
  const now = new Date();

  const params =
    new URLSearchParams(
      window.location.search
    );

  const testLiveMode =
    params.get("preview") === "concurso2026";

  if (
    now >= LIVE_RESULTS_START ||
    testLiveMode
  ) {
    startLiveCompetitionUpdates();
  } else {
    stopLiveCompetitionUpdates();
  }
}


/*
  Revisamos al cargar la página.
*/
checkLiveCompetitionTime();


/*
  Y luego cada 30 segundos por si
  el usuario tiene la página abierta
  justo cuando llegan las 11:00 a. m.
*/
setInterval(
  checkLiveCompetitionTime,
  30000
);

/* =========================================================
   MODO CONCURSO - 2026
========================================================= */

const LIVE_MODE_START =
  new Date("2026-10-25T11:00:00-05:00");


function updateCompetitionPageMode() {
  const now = new Date();

  const params =
    new URLSearchParams(
      window.location.search
    );

  const testLiveMode =
    params.get("preview") === "concurso2026";

  const isLiveMode =
    now >= LIVE_MODE_START ||
    testLiveMode;

  document.body.classList.toggle(
    "competition-live-mode",
    isLiveMode
  );

  /*
    SECCIONES PREVIAS
  */
  document
    .querySelectorAll(".pre-event-section")
    .forEach((section) => {
      section.hidden = isLiveMode;
    });


  /*
    AVISO DE RESULTADOS
  */
  const evaluationPreview =
    document.getElementById(
      "evaluation-preview"
    );

  if (evaluationPreview) {
    evaluationPreview.hidden =
      isLiveMode;
  }


  /*
    SECCIONES DEL DÍA DEL CONCURSO
  */
  document
    .querySelectorAll(".live-event-section")
    .forEach((section) => {
      /*
        Clasificados tiene su propia lógica,
        por eso no lo mostramos a la fuerza.
      */
      if (
        section.id === "clasificados" ||
        section.id === "resultados"
      ) {
        if (!isLiveMode) {
          section.hidden = true;
        }

        return;
      }

      section.hidden =
        !isLiveMode;
    });
}


updateCompetitionPageMode();

setInterval(
  updateCompetitionPageMode,
  30000
);


const editionButton =
  document.getElementById(
    "countdown-edition-button"
  );

if (editionButton) {

  const now = new Date();

  const contestDate =
    new Date(2026, 9, 25);

  const nextDay =
    new Date(2026, 9, 26);

  if (
    now >= contestDate &&
    now < nextDay
  ) {
    editionButton.innerHTML = `
      Ver puntajes en vivo
      <span class="countdown-live-dot"></span>
    `;

    editionButton.classList.add(
      "is-live"
    );
  }
}

const dropdownToggles =
  document.querySelectorAll(".dropdown-toggle");

dropdownToggles.forEach(toggle => {
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const dropdown =
      toggle.closest(".dropdown");

    if (!dropdown) return;

    const isOpen =
      dropdown.classList.toggle("is-open");

    toggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );
  });
});

const editionShareButton =
    document.getElementById(
        "edition-share-button"
    );

if (editionShareButton) {

    editionShareButton.addEventListener(
        "click",
        async () => {

            const shareData = {
                title:
                    "Catacaos, Color y Tradición 2026",

                text:
                    "Conoce toda la información de Catacaos, Color y Tradición 2026.",

                url:
                    "https://pedroyov.github.io/catacaos-color-tradicion/ediciones/2026-previas.html"
            };

            /*
             * Celulares y navegadores compatibles
             */
            if (navigator.share) {

                try {
                    await navigator.share(
                        shareData
                    );
                } catch (error) {

                    /*
                     * Si el usuario simplemente
                     * cerró el menú, no hacemos nada.
                     */
                    if (
                        error.name !==
                        "AbortError"
                    ) {
                        console.error(
                            "Error al compartir:",
                            error
                        );
                    }
                }

                return;
            }

            /*
             * PC o navegador sin Web Share API
             */
            try {

                await navigator.clipboard.writeText(
                    shareData.url
                );

                showShareCopied();

            } catch (error) {

                console.error(
                    "No se pudo copiar el enlace:",
                    error
                );

            }

        }
    );

}

function showShareCopied() {

    if (!editionShareButton) {
        return;
    }

    const originalContent =
        editionShareButton.innerHTML;

    editionShareButton.innerHTML =
        "<span>✓</span> Enlace copiado";

    editionShareButton.classList.add(
        "is-copied"
    );

    setTimeout(() => {

        editionShareButton.innerHTML =
            originalContent;

        editionShareButton.classList.remove(
            "is-copied"
        );

    }, 2000);
}
