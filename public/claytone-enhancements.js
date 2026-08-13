(() => {
  const scriptUrl = document.currentScript?.src || window.location.href;
  const siteBase = new URL("./", scriptUrl);
  const assetUrl = (name) => new URL(`assets/${name}`, siteBase).href;

  const mobileGalleryReplacements = new Map([
    ["work-01.webp", ["photo1.jpg", "Работа ClayTone — новое фото 1"]],
    ["work-02.webp", ["photo2.jpg", "Работа ClayTone — новое фото 2"]],
    ["work-03.webp", ["photo3.jpg", "Работа ClayTone — новое фото 3"]],
    ["work-04.webp", ["photo4.jpg", "Работа ClayTone — новое фото 4"]],
    ["work-05.webp", ["photo5.jpg", "Работа ClayTone — новое фото 5"]],
    ["portfolio-wine.webp", ["photo6.jpg", "Работа ClayTone — новое фото 6"]],
  ]);

  const basename = (src) => {
    try {
      return new URL(src, window.location.href).pathname.split("/").pop() || "";
    } catch {
      return src.split("/").pop() || "";
    }
  };

  const replaceMobileGalleryImage = (img) => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const replacement = mobileGalleryReplacements.get(
      basename(img.getAttribute("src") || img.src)
    );
    if (!replacement) return;
    img.src = assetUrl(replacement[0]);
    img.alt = replacement[1];
  };

  const enhanceGalleryPhotos = () => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    document.querySelectorAll("img").forEach(replaceMobileGalleryImage);
  };

  const observeGalleryPhotos = () => {
    if (!window.matchMedia("(max-width: 767px)").matches || !("MutationObserver" in window)) return;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("img")) replaceMobileGalleryImage(node);
          node.querySelectorAll?.("img").forEach(replaceMobileGalleryImage);
        });
        if (mutation.type === "attributes" && mutation.target instanceof HTMLImageElement) {
          replaceMobileGalleryImage(mutation.target);
        }
      });
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });
  };

  const enhancePromotions = () => {
    const cards = document.querySelectorAll(".mct-promotion-card");
    const firstImage = cards[0]?.querySelector("img");
    const secondImage = cards[1]?.querySelector("img");

    if (firstImage) {
      firstImage.src = assetUrl("promotion-loyalty-2026.webp");
      firstImage.alt = "Карточки благодарности и лояльности ClayTone";
    }

    if (secondImage) {
      secondImage.src = assetUrl("promotion-combo-2026.webp");
      secondImage.alt = "Маникюр и педикюр ClayTone в одной записи";
    }
  };

  const dispatchPointer = (viewport, type, clientX = 0) => {
    if (typeof PointerEvent !== "function") return;
    viewport.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 77,
      pointerType: "touch",
      isPrimary: true,
      clientX,
      clientY: 0,
    }));
  };

  const enhanceDesktopGallery = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const viewport = document.querySelector(".dct-gallery-viewport");
    if (!viewport || viewport.dataset.claytoneTrackpad === "1") return;
    viewport.dataset.claytoneTrackpad = "1";

    const blockHoverDelegation = (event) => event.stopPropagation();
    viewport.addEventListener("mouseover", blockHoverDelegation, true);
    viewport.addEventListener("mouseout", blockHoverDelegation, true);
    window.setTimeout(() => dispatchPointer(viewport, "pointerup"), 0);

    let gestureActive = false;
    let virtualX = 0;
    let releaseTimer = 0;

    viewport.addEventListener("wheel", (event) => {
      const horizontalDelta = Math.abs(event.deltaX) > 0.6
        ? event.deltaX
        : event.shiftKey ? event.deltaY : 0;
      if (!horizontalDelta) return;

      event.preventDefault();
      if (!gestureActive) {
        gestureActive = true;
        virtualX = 0;
        dispatchPointer(viewport, "pointerdown", virtualX);
      }

      virtualX -= horizontalDelta * 1.08;
      dispatchPointer(viewport, "pointermove", virtualX);

      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        dispatchPointer(viewport, "pointerup", virtualX);
        gestureActive = false;
        virtualX = 0;
      }, 170);
    }, { passive: false });
  };

  const pauseMovingRowsOffscreen = () => {
    if (!window.matchMedia("(min-width: 768px)").matches || !("IntersectionObserver" in window)) return;
    const rows = document.querySelectorAll(".dct-gallery-viewport, .mct-review-viewport");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;
        dispatchPointer(target, entry.isIntersecting ? "pointerup" : "pointerdown");
      });
    }, { rootMargin: "220px 0px", threshold: 0.01 });
    rows.forEach((row) => observer.observe(row));
  };

  document.addEventListener("click", (event) => {
    const title = event.target.closest?.(".mct-service-name strong");
    if (!title) return;
    const action = title.closest(".mct-service-row")?.querySelector(".mct-service-action a");
    if (!action) return;
    event.preventDefault();
    window.open(action.href, "_blank", "noopener,noreferrer");
  });

  document.addEventListener("keydown", (event) => {
    const title = event.target.closest?.(".mct-service-name strong");
    if (!title || (event.key !== "Enter" && event.key !== " ")) return;
    const action = title.closest(".mct-service-row")?.querySelector(".mct-service-action a");
    if (!action) return;
    event.preventDefault();
    window.open(action.href, "_blank", "noopener,noreferrer");
  });

  const run = () => {
    enhanceGalleryPhotos();
    observeGalleryPhotos();
    enhancePromotions();
    enhanceDesktopGallery();
    pauseMovingRowsOffscreen();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();
})();
