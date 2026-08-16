"use client";

import { useLayoutEffect } from "react";
import "./anastasia-final-tweaks.css";

const BOOKING = "https://wa.me/79162862863?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D1%85%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C%D1%81%D1%8F.";

const galleryFiles = [
  "anastasia-photo1.webp",
  "anastasia-photo3.webp",
  "anastasia-photo4.webp",
  "anastasia-photo5.webp",
  "anastasia-photo6.webp",
  "anastasia-photo7.webp",
  "anastasia-photo8.webp",
  "anastasia-photo9.webp",
  "anastasia-photo10.webp",
  "anastasia-photo11.webp",
  "anastasia-photo12.webp",
  "anastasia-photo13.webp",
];

let lightboxUrls: string[] = [];
let lightboxIndex = 0;
let lightboxScale = 1;
let lightboxX = 0;
let lightboxY = 0;
let gestureMode: "idle" | "swipe" | "pinch" | "pan" = "idle";
let touchStartX = 0;
let touchStartY = 0;
let touchOriginX = 0;
let touchOriginY = 0;
let pinchStartDistance = 0;
let pinchStartScale = 1;
let mousePanActive = false;
let mouseStartX = 0;
let mouseStartY = 0;
let mouseOriginX = 0;
let mouseOriginY = 0;

function getLightbox() {
  return document.querySelector<HTMLElement>(".anastasia-lightbox");
}

function distanceBetween(first: Touch, second: Touch) {
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

function clampPan(x: number, y: number, scale: number) {
  if (scale <= 1.01) return { x: 0, y: 0 };
  const maxX = Math.max(0, (window.innerWidth * (scale - 1)) / 2);
  const maxY = Math.max(0, (window.innerHeight * 0.72 * (scale - 1)) / 2);
  return {
    x: Math.max(-maxX, Math.min(maxX, x)),
    y: Math.max(-maxY, Math.min(maxY, y)),
  };
}

function renderLightbox() {
  const lightbox = getLightbox();
  const image = lightbox?.querySelector<HTMLImageElement>(".anastasia-lightbox-image");
  const counter = lightbox?.querySelector<HTMLElement>(".anastasia-lightbox-counter");
  if (!lightbox || !image || !lightboxUrls.length) return;

  lightboxIndex = (lightboxIndex + lightboxUrls.length) % lightboxUrls.length;
  image.src = lightboxUrls[lightboxIndex];
  image.alt = `Работа Анастасии ${lightboxIndex + 1}`;
  image.style.transform = `translate3d(${lightboxX}px, ${lightboxY}px, 0) scale(${lightboxScale})`;
  image.classList.toggle("is-zoomed", lightboxScale > 1.01);
  if (counter) counter.textContent = `${lightboxIndex + 1} / ${lightboxUrls.length}`;
}

function resetLightboxTransform() {
  lightboxScale = 1;
  lightboxX = 0;
  lightboxY = 0;
  mousePanActive = false;
}

function closeLightbox() {
  const lightbox = getLightbox();
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  document.body.classList.remove("anastasia-lightbox-open");
  resetLightboxTransform();
  gestureMode = "idle";
}

function stepLightbox(direction: -1 | 1) {
  lightboxIndex += direction;
  resetLightboxTransform();
  renderLightbox();
}

function setDesktopScale(nextScale: number) {
  lightboxScale = Math.max(1, Math.min(4, nextScale));
  if (lightboxScale <= 1.01) {
    lightboxX = 0;
    lightboxY = 0;
  } else {
    const clamped = clampPan(lightboxX, lightboxY, lightboxScale);
    lightboxX = clamped.x;
    lightboxY = clamped.y;
  }
  renderLightbox();
}

function ensureLightbox() {
  if (getLightbox()) return;

  const lightbox = document.createElement("div");
  lightbox.className = "anastasia-lightbox";
  lightbox.tabIndex = -1;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Просмотр работ Анастасии");
  lightbox.innerHTML = `
    <button class="anastasia-lightbox-close" type="button" aria-label="Закрыть">×</button>
    <button class="anastasia-lightbox-nav is-prev" type="button" aria-label="Предыдущее фото">‹</button>
    <div class="anastasia-lightbox-stage">
      <img class="anastasia-lightbox-image" alt="" draggable="false" />
    </div>
    <button class="anastasia-lightbox-nav is-next" type="button" aria-label="Следующее фото">›</button>
    <div class="anastasia-lightbox-counter" aria-live="polite"></div>
  `;

  document.body.appendChild(lightbox);

  lightbox.querySelector<HTMLButtonElement>(".anastasia-lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox.querySelector<HTMLButtonElement>(".is-prev")?.addEventListener("click", () => stepLightbox(-1));
  lightbox.querySelector<HTMLButtonElement>(".is-next")?.addEventListener("click", () => stepLightbox(1));

  const stage = lightbox.querySelector<HTMLElement>(".anastasia-lightbox-stage");

  stage?.addEventListener("wheel", (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    event.preventDefault();
    const sensitivity = event.ctrlKey ? 0.008 : 0.0025;
    const factor = Math.exp(-event.deltaY * sensitivity);
    setDesktopScale(lightboxScale * factor);
  }, { passive: false });

  stage?.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" || lightboxScale <= 1.01) return;
    mousePanActive = true;
    mouseStartX = event.clientX;
    mouseStartY = event.clientY;
    mouseOriginX = lightboxX;
    mouseOriginY = lightboxY;
    stage.classList.add("is-panning");
    if (!stage.hasPointerCapture(event.pointerId)) stage.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  stage?.addEventListener("pointermove", (event) => {
    if (!mousePanActive || event.pointerType === "touch" || lightboxScale <= 1.01) return;
    const clamped = clampPan(
      mouseOriginX + event.clientX - mouseStartX,
      mouseOriginY + event.clientY - mouseStartY,
      lightboxScale,
    );
    lightboxX = clamped.x;
    lightboxY = clamped.y;
    renderLightbox();
  });

  const stopMousePan = (event?: PointerEvent) => {
    mousePanActive = false;
    stage?.classList.remove("is-panning");
    if (event && stage?.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  };

  stage?.addEventListener("pointerup", stopMousePan);
  stage?.addEventListener("pointercancel", stopMousePan);
  stage?.addEventListener("pointerleave", (event) => {
    if (event.buttons === 0) stopMousePan(event);
  });

  stage?.addEventListener("touchstart", (event) => {
    if (event.touches.length >= 2) {
      const first = event.touches[0];
      const second = event.touches[1];
      if (!first || !second) return;
      gestureMode = "pinch";
      pinchStartDistance = distanceBetween(first, second);
      pinchStartScale = lightboxScale;
      return;
    }

    const touch = event.touches[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchOriginX = lightboxX;
    touchOriginY = lightboxY;
    gestureMode = lightboxScale > 1.01 ? "pan" : "swipe";
  }, { passive: true });

  stage?.addEventListener("touchmove", (event) => {
    if (event.touches.length >= 2) {
      const first = event.touches[0];
      const second = event.touches[1];
      if (!first || !second) return;
      event.preventDefault();
      if (gestureMode !== "pinch" || !pinchStartDistance) {
        gestureMode = "pinch";
        pinchStartDistance = distanceBetween(first, second);
        pinchStartScale = lightboxScale;
        return;
      }
      lightboxScale = Math.max(1, Math.min(4, pinchStartScale * (distanceBetween(first, second) / pinchStartDistance)));
      const clamped = clampPan(lightboxX, lightboxY, lightboxScale);
      lightboxX = clamped.x;
      lightboxY = clamped.y;
      renderLightbox();
      return;
    }

    const touch = event.touches[0];
    if (!touch || gestureMode !== "pan" || lightboxScale <= 1.01) return;
    event.preventDefault();
    const clamped = clampPan(
      touchOriginX + touch.clientX - touchStartX,
      touchOriginY + touch.clientY - touchStartY,
      lightboxScale,
    );
    lightboxX = clamped.x;
    lightboxY = clamped.y;
    renderLightbox();
  }, { passive: false });

  stage?.addEventListener("touchend", (event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchOriginX = lightboxX;
      touchOriginY = lightboxY;
      gestureMode = lightboxScale > 1.01 ? "pan" : "idle";
      return;
    }

    if (gestureMode === "swipe" && lightboxScale <= 1.01) {
      const touch = event.changedTouches[0];
      if (touch) {
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
          stepLightbox(deltaX > 0 ? -1 : 1);
        }
      }
    }

    if (lightboxScale < 1.04) {
      resetLightboxTransform();
      renderLightbox();
    }
    gestureMode = "idle";
  });

  stage?.addEventListener("touchcancel", () => {
    gestureMode = "idle";
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft" && lightboxScale <= 1.01) stepLightbox(-1);
    if (event.key === "ArrowRight" && lightboxScale <= 1.01) stepLightbox(1);
  });
}

function openLightbox(index: number, urls: string[]) {
  ensureLightbox();
  lightboxUrls = urls;
  lightboxIndex = index;
  resetLightboxTransform();
  const lightbox = getLightbox();
  if (!lightbox) return;
  lightbox.classList.add("is-open");
  document.body.classList.add("anastasia-lightbox-open");
  renderLightbox();
  lightbox.focus({ preventScroll: true });
}

function decorateServiceDigits(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>(".anastasia-service-list");
  if (!list) return;

  list.querySelectorAll<HTMLElement>(".mct-service-name strong").forEach((strong) => {
    if (strong.dataset.digitsReady === "true") return;
    const text = strong.textContent ?? "";
    const parts = text.split(/(\d+(?:[–-]\d+)?)/g);
    if (parts.length <= 1) {
      strong.dataset.digitsReady = "true";
      return;
    }
    strong.replaceChildren(...parts.filter(Boolean).map((part) => {
      if (!/^\d/.test(part)) return document.createTextNode(part);
      const span = document.createElement("span");
      span.className = "anastasia-service-digit";
      span.textContent = part;
      return span;
    }));
    strong.dataset.digitsReady = "true";
  });
}

function bindServiceDigits(root: HTMLElement) {
  const services = root.querySelector<HTMLElement>(".anastasia-services");
  if (!services || services.dataset.digitBinding === "true") return;
  services.dataset.digitBinding = "true";
  services.addEventListener("click", () => queueMicrotask(() => decorateServiceDigits(root)));
  decorateServiceDigits(root);
}

function applyFinalTweaks() {
  const root = document.querySelector<HTMLElement>(".anastasia-site");
  if (!root) return;

  const assetBase = window.location.hostname.endsWith("github.io") ? "/anastasia-tanem" : "";
  const optimizedBase = `${assetBase}/assets/anastasia-optimized`;
  const galleryUrls = galleryFiles.map((filename) => `${optimizedBase}/${filename}`);

  bindServiceDigits(root);
  ensureLightbox();

  const portfolioButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("#mobile-portfolio .mct-work-tile, #mobile-portfolio .dct-film-frame"));
  portfolioButtons.forEach((button, index) => {
    const image = button.querySelector<HTMLImageElement>("img");
    const imageIndex = index % galleryUrls.length;
    const src = galleryUrls[imageIndex];
    if (image) {
      image.src = src;
      image.alt = `Работа Анастасии ${imageIndex + 1}`;
      image.loading = imageIndex < 4 ? "eager" : "lazy";
      image.decoding = "async";
      if (imageIndex < 2) image.fetchPriority = "high";
    }
    if (!button.dataset.anastasiaBound) {
      button.dataset.anastasiaBound = "true";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openLightbox(imageIndex, galleryUrls);
      }, true);
    }
  });

  const galleryContent = root.querySelector<HTMLElement>(".mct-gallery-content");
  if (galleryContent) {
    galleryContent.querySelectorAll<HTMLElement>(".mct-gallery-ba").forEach((el) => el.remove());
    Array.from(galleryContent.querySelectorAll<HTMLElement>("h3")).forEach((heading) => {
      if (heading.textContent?.toLowerCase().includes("до / после")) heading.remove();
    });
    const works = galleryContent.querySelector<HTMLElement>(".mct-gallery-works");
    if (works && works.dataset.anastasiaGallery !== "true") {
      works.dataset.anastasiaGallery = "true";
      works.innerHTML = galleryUrls.map((src, index) => `
        <button class="mct-gallery-image anastasia-gallery-image" type="button" data-anastasia-index="${index}" aria-label="Открыть фотографию: Работа Анастасии ${index + 1}">
          <img src="${src}" alt="Работа Анастасии ${index + 1}" loading="lazy" decoding="async" />
        </button>
      `).join("");
      works.querySelectorAll<HTMLButtonElement>("[data-anastasia-index]").forEach((button) => {
        button.addEventListener("click", () => openLightbox(Number(button.dataset.anastasiaIndex || 0), galleryUrls));
      });
    }
  }

  const aboutImage = root.querySelector<HTMLImageElement>("#mobile-about .mct-about-portrait img");
  if (aboutImage) {
    aboutImage.src = `${optimizedBase}/anastasia-omastere.webp`;
    aboutImage.alt = "Анастасия — мастер бьюти-сервиса";
    aboutImage.loading = "lazy";
    aboutImage.decoding = "async";
  }

  const desktopHero = root.querySelector<HTMLImageElement>(".dct-hero-portrait img");
  if (desktopHero) {
    desktopHero.src = `${optimizedBase}/anastasia-omastere.webp`;
    desktopHero.alt = "Анастасия — мастер бьюти-сервиса";
    desktopHero.loading = "eager";
    desktopHero.fetchPriority = "high";
    desktopHero.decoding = "async";
  }
  const desktopCaption = root.querySelector<HTMLElement>(".dct-hero-portrait figcaption");
  if (desktopCaption) desktopCaption.innerHTML = "<span>Анастасия</span><small>10 лет опыта</small>";

  const firstPromoImage = root.querySelector<HTMLImageElement>("#mobile-promotions .mct-promotion-card:first-child figure img");
  if (firstPromoImage) {
    firstPromoImage.src = `${optimizedBase}/anastasia-actia1.webp`;
    firstPromoImage.alt = "Первое посещение — скидка 10 процентов на любую процедуру";
    firstPromoImage.loading = "lazy";
    firstPromoImage.decoding = "async";
  }

  const booking = root.querySelector<HTMLElement>("#mobile-booking");
  const bookingTitle = booking?.querySelector<HTMLElement>("h3");
  if (bookingTitle) bookingTitle.innerHTML = "Запись через WhatsApp<br /><em>напрямую у мастера</em>";
  const bookingCopy = booking?.querySelector<HTMLElement>(":scope > p");
  if (bookingCopy) bookingCopy.textContent = "Нажмите кнопку — откроется чат с Анастасией и готовым сообщением «Здравствуйте, хочу записаться».";

  const finalCta = booking?.querySelector<HTMLAnchorElement>(".mct-final-cta");
  if (finalCta) {
    finalCta.href = BOOKING;
    finalCta.target = "_blank";
    finalCta.rel = "noopener noreferrer";
    const label = finalCta.querySelector<HTMLElement>("span");
    if (label) label.textContent = "Запись через WhatsApp";
  }

  const heroCta = root.querySelector<HTMLAnchorElement>(".mct-main-cta");
  if (heroCta) {
    heroCta.href = BOOKING;
    heroCta.target = "_blank";
    heroCta.rel = "noopener noreferrer";
    heroCta.textContent = "Записаться в WhatsApp  →";
  }

  const sticky = root.querySelector<HTMLAnchorElement>(".mct-sticky");
  if (sticky) {
    sticky.href = BOOKING;
    sticky.target = "_blank";
    sticky.rel = "noopener noreferrer";
    const strong = sticky.querySelector<HTMLElement>(".mct-sticky-copy strong");
    const small = sticky.querySelector<HTMLElement>(".mct-sticky-copy small");
    if (strong) strong.textContent = "Запись через WhatsApp";
    if (small) small.textContent = "Написать Анастасии";
  }

  const serviceHint = root.querySelector<HTMLElement>("#mobile-prices .mct-price-head > span");
  if (serviceHint) serviceHint.textContent = "Выберите услугу — запись откроется в WhatsApp в новой вкладке.";

  root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    if (/^https?:\/\//i.test(href)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });
}

export default function AnastasiaFinalTweaks() {
  useLayoutEffect(() => {
    applyFinalTweaks();
    const initialFrame = window.requestAnimationFrame(applyFinalTweaks);
    const galleryButton = document.querySelector<HTMLButtonElement>(".anastasia-site .mct-gallery-button");
    let galleryFrame1: number | null = null;
    let galleryFrame2: number | null = null;

    const refreshGallery = () => {
      galleryFrame1 = window.requestAnimationFrame(() => {
        galleryFrame2 = window.requestAnimationFrame(applyFinalTweaks);
      });
    };

    galleryButton?.addEventListener("click", refreshGallery);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      if (galleryFrame1 !== null) window.cancelAnimationFrame(galleryFrame1);
      if (galleryFrame2 !== null) window.cancelAnimationFrame(galleryFrame2);
      galleryButton?.removeEventListener("click", refreshGallery);
      getLightbox()?.remove();
      document.body.classList.remove("anastasia-lightbox-open");
    };
  }, []);
  return null;
}
