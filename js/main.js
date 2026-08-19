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


function renderContestLiveStatus(data) {
  if (!contestLivePanel) {
    return;
  }

  if (
    data.mostrar !== "SI" ||
    data.estado !== "EN_VIVO"
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


let lastLivePayload = null;
let changedLiveRows = new Set();


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

  try {
    const response = await fetch(
      `${CCYT_API_URL}?_=${Date.now()}`,
      {
        cache: "no-store"
      }
    );

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

  renderContestLiveStatus(estado);

  renderQualifyingCompetition(
    payload,
    config
  );

  renderOtherResults(
    payload,
    config
  );

  renderClassifiedCompetition(
    payload
  );
}

function renderQualifyingCompetition(
  payload,
  config
) {
  if (!groups2026) {
    return;
  }

  const sections = [];


  /* ==========================================
     DANZAS NACIONALES
  ========================================== */

  if (
    normalizeLiveValue(
      config.mostrar_general
    ) === "SI"
  ) {
    const generalRows =
      (payload.general || []).filter(
        row =>
          normalizeLiveValue(row.fase) ===
          "CLASIFICATORIA"
      );

    const generalGroups =
      groupRowsBy(
        generalRows,
        "grupo"
      );

    if (
      Object.keys(generalGroups).length
    ) {
      sections.push(`
        <div class="qualifying-category-title">
          <span>Danzas Nacionales</span>
          <h3>Grupos clasificatorios</h3>
        </div>
      `);

      Object.entries(generalGroups)
        .sort(([a], [b]) =>
          a.localeCompare(b)
        )
        .forEach(
          ([groupName, rows]) => {
            sections.push(
              createScoreTable({
                title:
                  `Grupo ${groupName}`,
                rows,
                showDance: true,
                showClassification: true,
                category: "general"
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
    normalizeLiveValue(
      config.mostrar_caporales
    ) === "SI"
  ) {
    const caporalesRows =
      (payload.caporales || []).filter(
        row =>
          normalizeLiveValue(row.fase) ===
          "CLASIFICATORIA"
      );

    const caporalesGroups =
      groupRowsBy(
        caporalesRows,
        "grupo"
      );

    if (
      Object.keys(caporalesGroups).length
    ) {
      sections.push(`
        <div class="
          qualifying-category-title
          qualifying-category-caporales
        ">
          <span>Caporales</span>
          <h3>Grupos clasificatorios</h3>
        </div>
      `);

      Object.entries(caporalesGroups)
        .sort(([a], [b]) =>
          a.localeCompare(b)
        )
        .forEach(
          ([groupName, rows]) => {
            sections.push(
              createScoreTable({
                title:
                  `Grupo ${groupName}`,
                rows,
                showDance: false,
                showClassification: true,
                category: "caporales"
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
    sections.join("");
}

function createScoreTable(options) {
  const {
    title,
    rows,
    showDance,
    showClassification,
    category = ""
  } = options;

  const sortedRows = [...rows].sort(
    (a, b) =>
      Number(a.orden || 999) -
      Number(b.orden || 999)
  );

  const jurors =
    getVisibleJurors(sortedRows);

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
    <div class="group-block live-group-block">

      <div class="live-table-heading">
        <h3>${escapeLiveHtml(title)}</h3>

        <span>
          Actualización automática
        </span>
      </div>

      <div class="scores-table-wrapper">

        <table class="scores-table live-scores-table">

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

    </div>
  `;
}

function createScoreRow(
  row,
  jurors,
  showDance,
  showClassification,
  category
) {
  const published =
    normalizeLiveValue(row.publicar) ===
    "SI";

  const disqualified =
    published &&
    normalizeLiveValue(
      row.descalificado
    ) === "SI";

  const classified =
    published &&
    showClassification &&
    normalizeLiveValue(
      row.clasificado
    ) === "SI";

  let rowClass = "";

  if (disqualified) {
    rowClass = "live-disqualified-row";
  } else if (classified) {
    rowClass = "classified-row";
  }

  const jurorCells =
    jurors
      .map(juror => {
        if (!published) {
          return `<td class="score-pending">—</td>`;
        }

        return `
          <td>
            ${escapeLiveHtml(
          row[juror] || "—"
        )}
          </td>
        `;
      })
      .join("");

  let resultCell;

  if (!published) {
    const state =
      normalizeLiveValue(row.estado);

    resultCell = `
      <td>
        <span class="live-result-state ${state === "EN_EVALUACION"
        ? "is-evaluating"
        : ""
      }">
          ${state === "EN_EVALUACION"
        ? "En evaluación"
        : "Pendiente"
      }
        </span>
      </td>
    `;
  } else if (disqualified) {
    resultCell = `
      <td>
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
      </td>
    `;
  } else {
    resultCell = `
      <td>
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
      </td>
    `;
  }

  const rowKey =
    getLiveRowKey(
      category,
      row
    );

  if (
    changedLiveRows.has(rowKey)
  ) {
    rowClass +=
      " live-row-updated";
  }

  return `
    <tr class="${rowClass}">
      <td>
        ${escapeLiveHtml(
    row.orden || "—"
  )}
      </td>

      <td>
        <strong>
          ${escapeLiveHtml(
    row.agrupacion || ""
  )}
        </strong>
      </td>

      ${showDance
      ? `
            <td>
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
        normalizeLiveValue(
          row.publicar
        ) === "SI" &&
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
        normalizeLiveValue(row.publicar) ===
          "SI" &&
        normalizeLiveValue(row.clasificado) ===
          "SI" &&
        normalizeLiveValue(row.descalificado) !==
          "SI"
      );

  const caporales =
    (payload.caporales || [])
      .filter(row =>
        normalizeLiveValue(row.fase) ===
          "CLASIFICATORIA" &&
        normalizeLiveValue(row.publicar) ===
          "SI" &&
        normalizeLiveValue(row.clasificado) ===
          "SI" &&
        normalizeLiveValue(row.descalificado) !==
          "SI"
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

          <h3>
            Clasificados a la Gran Final
          </h3>
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

                <span>
                  Grupo ${escapeLiveHtml(
                    row.grupo
                  )}
                </span>

                <h3>
                  ${escapeLiveHtml(
                    row.agrupacion
                  )}
                </h3>

                <p>
                  ${escapeLiveHtml(
                    row.danza || ""
                  )}
                </p>

                <strong>
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

          <h3>
            Clasificados a la Gran Final
          </h3>
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

                <span>
                  Grupo ${escapeLiveHtml(
                    row.grupo
                  )}
                </span>

                <h3>
                  ${escapeLiveHtml(
                    row.agrupacion
                  )}
                </h3>

                <strong>
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
  config
) {
  if (!liveResultsContainer) {
    return;
  }

  const sections = [];

  /*
    FINAL GENERAL
  */
  if (
    normalizeLiveValue(
      config.mostrar_final_general
    ) === "SI"
  ) {
    const finalGeneral =
      (payload.general || []).filter(
        row =>
          normalizeLiveValue(row.fase) ===
          "FINAL"
      );

    if (finalGeneral.length) {
      sections.push(
        createScoreTable({
          title:
            "Gran Final - Danzas Nacionales",
          rows: finalGeneral,
          showDance: true,
          showClassification: false,
          category: "general"
        })
      );
    }
  }


  /*
    INFANTIL
  */
  if (
    normalizeLiveValue(
      config.mostrar_infantil
    ) === "SI"
  ) {
    const infantil =
      payload.infantil || [];

    if (infantil.length) {
      sections.push(
        createScoreTable({
          title:
            "Categoría Infantil",
          rows: infantil,
          showDance: true,
          showClassification: false,
          category: "infantil"
        })
      );
    }
  }


  /*
    FINAL CAPORALES
  */
  if (
    normalizeLiveValue(
      config.mostrar_final_caporales
    ) === "SI"
  ) {
    const finalCaporales =
      (payload.caporales || []).filter(
        row =>
          normalizeLiveValue(row.fase) ===
          "FINAL"
      );

    if (finalCaporales.length) {
      sections.push(
        createScoreTable({
          title:
            "Gran Final - Caporales",
          rows: finalCaporales,
          showDance: false,
          showClassification: false,
          category: "caporales"
        })
      );
    }
  }


  /*
    CAMPEÓN DE CAMPEONES
  */
  if (
    normalizeLiveValue(
      config.mostrar_campeones
    ) === "SI"
  ) {
    const campeones =
      payload.campeones || [];

    if (campeones.length) {
      sections.push(
        createScoreTable({
          title:
            "Campeón de Campeones",
          rows: campeones,
          showDance: true,
          showClassification: false,
          category: "campeones"
        })
      );
    }
  }


  if (!sections.length) {
    renderResultsWaiting();
    return;
  }

  liveResultsContainer.innerHTML =
    sections.join("");
}

function renderResultsWaiting() {
  liveResultsContainer.innerHTML = `
    <div class="results-waiting">

      <div class="results-waiting-icon">
        🏆
      </div>

      <span class="results-waiting-status">
        Aún no disponible
      </span>

      <h3>
        Resultados próximamente
      </h3>

      <p>
        Los puntajes se publicarán aquí
        durante el desarrollo del concurso.
      </p>

      <div class="results-waiting-live">
        <i></i>
        Actualización en vivo durante el concurso
      </div>

    </div>
  `;
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
    .toUpperCase();
}


function escapeLiveHtml(value) {
  const element =
    document.createElement("div");

  element.textContent =
    String(value ?? "");

  return element.innerHTML;
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
    Primera carga inmediata.
  */
  loadCompetition2026();

  /*
    Luego actualizamos cada 5 segundos.
  */
  liveCompetitionInterval = setInterval(
    loadCompetition2026,
    5000
  );
}


function stopLiveCompetitionUpdates() {
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
        section.id === "clasificados"
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