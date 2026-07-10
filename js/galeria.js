
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("galleryMasonry");
  const filterContainer = document.getElementById("galleryFilter");
  const emptyMessage = document.getElementById("galleryEmpty");

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImg");
  const closeLightboxButton = document.getElementById("closeLightbox");

  if (!gallery) {
    return;
  }

  /*
   * Cantidad de fotografías disponibles por edición.
   *
   * Ejemplo:
   * 2017: 37
   *
   * genera automáticamente:
   * 2017-1.jpg
   * 2017-2.jpg
   * ...
   * 2017-37.jpg
   */
  const galleryYears = {
    2024: 12,
    2023: 165,
    2020: 3,
    2019: 4,
    2018: 150,
    2017: 37
  };

  /**
   * Crea una fotografía dentro de la galería.
   */
  function createGalleryImage(year, number) {
    const image = document.createElement("img");

    image.src = `img/galeria/${year}-${number}.jpg`;
    image.alt = `Galería de la edición ${year}, fotografía ${number}`;
    image.dataset.year = String(year);

    image.loading = "lazy";
    image.decoding = "async";

    /*
     * Si algún número no existe, por ejemplo:
     * 2023-13.jpg
     *
     * la imagen se elimina automáticamente y no aparece rota.
     */
    image.addEventListener("error", () => {
      image.remove();
      updateEmptyMessage();
    });

    return image;
  }

  /**
   * Genera todas las fotografías configuradas.
   */
  function generateGallery() {
    const fragment = document.createDocumentFragment();

    Object.entries(galleryYears).forEach(([year, total]) => {
      for (let number = 1; number <= total; number += 1) {
        const image = createGalleryImage(year, number);
        fragment.appendChild(image);
      }
    });

    gallery.appendChild(fragment);
  }

  /**
   * Filtra las fotografías por año.
   */
  function filterGallery(selectedYear) {
    const images = gallery.querySelectorAll("img");

    images.forEach((image) => {
      const shouldShow =
        selectedYear === "all" ||
        image.dataset.year === selectedYear;

      image.hidden = !shouldShow;
    });

    updateEmptyMessage();
  }

  /**
   * Muestra un mensaje cuando el filtro no contiene imágenes.
   */
  function updateEmptyMessage() {
    if (!emptyMessage) {
      return;
    }

    const visibleImages = Array.from(
      gallery.querySelectorAll("img")
    ).filter((image) => !image.hidden);

    emptyMessage.hidden = visibleImages.length > 0;
  }

  /**
   * Abre el visor de imagen.
   */
  function openLightbox(image) {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightbox.classList.add("active");
    document.body.classList.add("lightbox-open");

    closeLightboxButton?.focus();
  }

  /**
   * Cierra el visor.
   */
  function closeLightbox() {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightbox.classList.remove("active");
    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";
    lightboxImage.alt = "Imagen ampliada";
  }

  /*
   * Se generan las imágenes antes de configurar
   * los filtros y el lightbox.
   */
  generateGallery();

  /*
   * Filtros por año.
   */
  filterContainer?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");

    if (!button) {
      return;
    }

    filterContainer
      .querySelectorAll("button[data-filter]")
      .forEach((filterButton) => {
        filterButton.classList.remove("active");
      });

    button.classList.add("active");

    const selectedYear = button.dataset.filter;
    filterGallery(selectedYear);
  });

  /*
   * Lightbox mediante delegación de eventos.
   * Funciona también con imágenes creadas dinámicamente.
   */
  gallery.addEventListener("click", (event) => {
    const image = event.target.closest("img");

    if (!image || image.hidden) {
      return;
    }

    openLightbox(image);
  });

  closeLightboxButton?.addEventListener("click", closeLightbox);

  /*
   * Cierra el lightbox al tocar el fondo oscuro.
   */
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  /*
   * Cierra el lightbox con la tecla Escape.
   */
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      lightbox?.classList.contains("active")
    ) {
      closeLightbox();
    }
  });

  updateEmptyMessage();
});
