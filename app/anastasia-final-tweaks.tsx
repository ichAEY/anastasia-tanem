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

const SERVICE_POLISH: Record<string, { title: string; description: string }> = {
  "Маникюр": {
    title: "Маникюр",
    description: "Обработка ногтей и кутикулы",
  },
  "Маникюр с покрытием гель-лак": {
    title: "Маникюр с гель-лаком",
    description: "Маникюр · стойкое покрытие",
  },
  "Комплекс маникюр с покрытием гель-лак": {
    title: "Комплекс с гель-лаком",
    description: "Маникюр · покрытие · снятие в подарок",
  },
  "Маникюр: классический / европейский / аппаратный / комбинированный": {
    title: "Маникюр без покрытия",
    description: "Классический · европейский · аппаратный · комбинированный",
  },
  "Укрепление акриловой пудрой": {
    title: "Укрепление акриловой пудрой",
    description: "Дополнительное укрепление ногтевой пластины",
  },
  "Укрепление гелем": {
    title: "Укрепление гелем",
    description: "Укрепление · выравнивание ногтей",
  },
  "Коррекция наращённых ногтей без маникюра": {
    title: "Коррекция наращённых ногтей",
    description: "Без маникюра · коррекция длины и формы",
  },
  "Наращивание ногтей без маникюра": {
    title: "Наращивание ногтей",
    description: "Без маникюра · моделирование длины и формы",
  },
  "Снятие гель-лака": {
    title: "Снятие гель-лака",
    description: "Аккуратное снятие старого покрытия",
  },
  "Педикюр: SMART / классический / аппаратный / комбинированный": {
    title: "Педикюр без покрытия",
    description: "SMART · классический · аппаратный · комбинированный",
  },
  "Педикюр с покрытием гель-лак": {
    title: "Педикюр с гель-лаком",
    description: "Педикюр · покрытие · снятие в подарок",
  },
  "Наращивание ресниц — классический объём": {
    title: "Наращивание ресниц",
    description: "Классический объём",
  },
  "Наращивание ресниц — 2D": {
    title: "Наращивание ресниц · 2D",
    description: "Двойной объём",
  },
  "Наращивание ресниц — 3D": {
    title: "Наращивание ресниц · 3D",
    description: "Тройной объём",
  },
  "Наращивание ресниц — Hollywood 4D–5D": {
    title: "Наращивание ресниц · 4D–5D",
    description: "Hollywood объём",
  },
  "Ламинирование ресниц": {
    title: "Ламинирование ресниц",
    description: "Изгиб · визуальная длина · ухоженный вид",
  },
  "Оформление бровей пинцет / нитка": {
    title: "Оформление бровей",
    description: "Пинцет или нить · коррекция формы",
  },
  "Окрашивание бровей краской / хной": {
    title: "Окрашивание бровей",
    description: "Краска или хна · подбор оттенка",
  },
  "Ламинирование бровей": {
    title: "Ламинирование бровей",
    description: "Укладка · фиксация формы",
  },
};

let lightboxUrls: string[] = [];
let lightboxIndex = 0;
let lightboxScale = 1;

function getLightbox() {
  return document.querySelector<HTMLElement>(".anastasia-lightbox");
}

function renderLightbox() {
  const lightbox = getLightbox();
  const image = lightbox?.querySelector<HTMLImageElement>(".anastasia-lightbox-image");
  const counter = lightbox?.querySelector<HTMLElement>(".anastasia-lightbox-counter");
  if (!lightbox || !image || !lightboxUrls.length) return;

  lightboxIndex = (lightboxIndex + lightboxUrls.length) % lightboxUrls.length;
  image.src = lightboxUrls[lightboxIndex];
  image.alt = `Работа Анастасии ${lightboxIndex + 1}`;
  image.style.transform = `scale(${lightboxScale})`;
  image.classList.toggle("is-zoomed", lightboxScale > 1.01);
  if (counter) counter.textContent = `${lightboxIndex + 1} / ${lightboxUrls.length}`;
}

function closeLightbox() {
  const lightbox = getLightbox();
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  document.body.classList.remove("anastasia-lightbox-open");
  lightboxScale = 1;
}

function stepLightbox(direction: -1 | 1) {
  lightboxIndex += direction;
  lightboxScale = 1;
  renderLightbox();
}

function setLightboxScale(next: number) {
  lightboxScale = Math.max(1, Math.min(4, next));
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
    <div class="anastasia-lightbox-tools" aria-label="Масштаб фотографии">
      <button type="button" data-zoom="out" aria-label="Уменьшить">−</button>
      <span class="anastasia-lightbox-counter"></span>
      <button type="button" data-zoom="in" aria-label="Увеличить">+</button>
    </div>
  `;

  document.body.appendChild(lightbox);

  lightbox.querySelector<HTMLButtonElement>(".anastasia-lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox.querySelector<HTMLButtonElement>(".is-prev")?.addEventListener("click", () => stepLightbox(-1));
  lightbox.querySelector<HTMLButtonElement>(".is-next")?.addEventListener("click", () => stepLightbox(1));
  lightbox.querySelector<HTMLButtonElement>('[data-zoom="out"]')?.addEventListener("click", () => setLightboxScale(lightboxScale - 0.5));
  lightbox.querySelector<HTMLButtonElement>('[data-zoom="in"]')?.addEventListener("click", () => setLightboxScale(lightboxScale + 0.5));

  const image = lightbox.querySelector<HTMLImageElement>(".anastasia-lightbox-image");
  image?.addEventListener("dblclick", () => setLightboxScale(lightboxScale > 1.01 ? 1 : 2));
  image?.addEventListener("wheel", (event) => {
    event.preventDefault();
    setLightboxScale(lightboxScale + (event.deltaY < 0 ? 0.25 : -0.25));
  }, { passive: false });

  let pointerStartX: number | null = null;
  const stage = lightbox.querySelector<HTMLElement>(".anastasia-lightbox-stage");
  stage?.addEventListener("pointerdown", (event) => {
    if (lightboxScale > 1.01) return;
    pointerStartX = event.clientX;
  });
  stage?.addEventListener("pointerup", (event) => {
    if (pointerStartX === null || lightboxScale > 1.01) return;
    const delta = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(delta) > 55) stepLightbox(delta > 0 ? -1 : 1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
    if (event.key === "+" || event.key === "=") setLightboxScale(lightboxScale + 0.5);
    if (event.key === "-") setLightboxScale(lightboxScale - 0.5);
  });
}

function openLightbox(index: number, urls: string[]) {
  ensureLightbox();
  lightboxUrls = urls;
  lightboxIndex = index;
  lightboxScale = 1;
  const lightbox = getLightbox();
  if (!lightbox) return;
  lightbox.classList.add("is-open");
  document.body.classList.add("anastasia-lightbox-open");
  renderLightbox();
  lightbox.focus({ preventScroll: true });
}

function polishServiceRows(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>(".anastasia-service-list");
  if (!list) return;

  list.querySelectorAll<HTMLElement>(".anastasia-service-group").forEach((group) => group.remove());

  const rows = Array.from(list.querySelectorAll<HTMLElement>(".mct-service-row"));
  rows.forEach((row) => {
    const strong = row.querySelector<HTMLElement>(".mct-service-name strong");
    const description = row.querySelector<HTMLElement>(".dct-service-description");
    if (!strong) return;

    const original = strong.dataset.originalTitle || strong.textContent?.trim() || "";
    strong.dataset.originalTitle = original;
    const polished = SERVICE_POLISH[original];
    if (!polished) return;
    strong.textContent = polished.title;
    if (description) description.textContent = polished.description;
  });

  const activeCategory = root.querySelector<HTMLButtonElement>(".anastasia-tabs .mct-tab.is-active")?.dataset.category;
  const expanded = root.querySelector<HTMLButtonElement>(".anastasia-more-services")?.getAttribute("aria-expanded") === "true";
  if (activeCategory !== "all" || !expanded) return;

  const freshRows = Array.from(list.querySelectorAll<HTMLElement>(".mct-service-row"));
  const insertGroup = (label: string, matcher: (original: string) => boolean) => {
    const row = freshRows.find((item) => {
      const original = item.querySelector<HTMLElement>("strong")?.dataset.originalTitle || "";
      return matcher(original);
    });
    if (!row) return;
    const group = document.createElement("div");
    group.className = "anastasia-service-group";
    group.textContent = label;
    list.insertBefore(group, row);
  };

  insertGroup("Маникюр", (title) => !title.startsWith("Педикюр") && !title.includes("ресниц") && !title.includes("бровей"));
  insertGroup("Педикюр", (title) => title.startsWith("Педикюр"));
  insertGroup("Ресницы и брови", (title) => title.includes("ресниц") || title.includes("бровей"));
}

function bindServicePolish(root: HTMLElement) {
  const controls = root.querySelectorAll<HTMLElement>(".anastasia-tabs .mct-tab, .anastasia-more-services");
  controls.forEach((control) => {
    if (control.dataset.polishBound === "true") return;
    control.dataset.polishBound = "true";
    control.addEventListener("click", () => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => polishServiceRows(root)));
    });
  });
  polishServiceRows(root);
}

function applyFinalTweaks() {
  const root = document.querySelector<HTMLElement>(".anastasia-site");
  if (!root) return;

  const assetBase = window.location.hostname.endsWith("github.io") ? "/anastasia-tanem" : "";
  const optimizedBase = `${assetBase}/assets/anastasia-optimized`;
  const galleryUrls = galleryFiles.map((filename) => `${optimizedBase}/${filename}`);

  bindServicePolish(root);
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
