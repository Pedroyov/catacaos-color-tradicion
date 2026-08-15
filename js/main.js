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