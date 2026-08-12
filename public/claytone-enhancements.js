(() => {
  const workMap = new Map([
    ["work-01.webp", ["/assets/gallery-new-01.webp", "Работа ClayTone — комбинированный дизайн ногтей"]],
    ["work-02.webp", ["/assets/gallery-new-02.webp", "Работа ClayTone — глубокий винный маникюр"]],
    ["work-03.webp", ["/assets/gallery-new-03.webp", "Работа ClayTone — розовый миндаль с деликатным дизайном"]],
    ["work-04.webp", ["/assets/gallery-new-04.webp", "Работа ClayTone — светло-голубой маникюр"]],
    ["work-05.webp", ["/assets/gallery-new-05.webp", "Работа ClayTone — натуральный нюдовый маникюр"]],
    ["work-06.webp", ["/assets/work-01.webp", "Работа Нонны — нежный маникюр с тонким френчем"]],
    ["work-07.webp", ["/assets/work-02.webp", "Работа Нонны — аккуратный нюдовый маникюр"]],
    ["mobile-work-french.webp", ["/assets/work-03.webp", "Работа Нонны — розовый маникюр мягкой формы"]],
    ["mobile-work-pearl.webp", ["/assets/work-04.webp", "Работа Нонны — молочный френч"]],
    ["mobile-work-wine.webp", ["/assets/work-05.webp", "Работа Нонны — натуральный розовый маникюр"]],
    ["portfolio-french.webp", ["/assets/work-06.webp", "Работа Нонны — маникюр винного оттенка"]],
    ["portfolio-pearl.webp", ["/assets/work-07.webp", "Работа Нонны — графичный тёмный дизайн"]],
    ["portfolio-wine.webp", ["/assets/mobile-work-french.webp", "Работа Нонны — чистый френч на мягком квадрате"]],
  ]);

  const basename = (src) => {
    try {
      return new URL(src, window.location.href).pathname.split("/").pop() || "";
    } catch {
      return src.split("/").pop() || "";
    }
  };

  const enhanceGalleryImages = () => {
    document.querySelectorAll("img").forEach((img) => {
      if (img.dataset.claytoneGalleryUpdated === "1") return;
      const replacement = workMap.get(basename(img.getAttribute("src") || img.src));
      if (!replacement) return;
      img.dataset.claytoneGalleryUpdated = "1";
      img.src = replacement[0];
      img.alt = replacement[1];
    });
  };

  const enhanceServices = () => {
    document.querySelectorAll(".mct-service-row").forEach((row) => {
      const title = row.querySelector(".mct-service-name strong");
      const action = row.querySelector(".mct-service-action a");
      if (!title || !action) return;
      title.classList.add("mct-service-title-link");
      title.setAttribute("role", "link");
      title.setAttribute("tabindex", "0");
      title.setAttribute("aria-label", `${title.textContent || "Услуга"}. Открыть запись`);
    });
  };

  const ensureLightbox = () => {
    let overlay = document.querySelector(".mct-custom-lightbox");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "mct-custom-lightbox";
    overlay.hidden = true;
    overlay.innerHTML = '<button type="button" aria-label="Закрыть фотографию">×</button><img alt="Работа ClayTone">';
    document.body.appendChild(overlay);
    const close = () => {
      overlay.hidden = true;
      document.body.style.overflow = "";
    };
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest("button")) close();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) close();
    });
    return overlay;
  };

  const openCustomLightbox = (img) => {
    const overlay = ensureLightbox();
    const target = overlay.querySelector("img");
    target.src = img.currentSrc || img.src;
    target.alt = img.alt || "Работа ClayTone";
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  };

  document.addEventListener("click", (event) => {
    const serviceTitle = event.target.closest?.(".mct-service-title-link");
    if (serviceTitle) {
      const action = serviceTitle.closest(".mct-service-row")?.querySelector(".mct-service-action a");
      if (action) {
        event.preventDefault();
        window.open(action.href, "_blank", "noopener,noreferrer");
      }
      return;
    }

    const galleryButton = event.target.closest?.(".mct-work-tile, .dct-film-frame, .mct-gallery-overlay button");
    const image = galleryButton?.querySelector?.("img");
    if (image && image.dataset.claytoneGalleryUpdated === "1") {
      event.preventDefault();
      event.stopPropagation();
      openCustomLightbox(image);
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    const title = event.target.closest?.(".mct-service-title-link");
    if (!title || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    title.click();
  });

  const run = () => {
    enhanceGalleryImages();
    enhanceServices();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();

  const observer = new MutationObserver(() => run());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
