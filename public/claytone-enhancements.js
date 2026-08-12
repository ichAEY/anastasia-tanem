(() => {
  const scriptUrl = document.currentScript?.src || window.location.href;
  const siteBase = new URL("./", scriptUrl);
  const assetUrl = (name) => new URL(`assets/${name}`, siteBase).href;

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
    enhancePromotions();
    enhanceDesktopGallery();
    pauseMovingRowsOffscreen();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();
})();
