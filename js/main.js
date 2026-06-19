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
  const targetDate = new Date("October 15, 2026 18:00:00").getTime();

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