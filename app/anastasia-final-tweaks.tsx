"use client";

import { useLayoutEffect } from "react";
import "./anastasia-final-tweaks.css";

const BOOKING = "https://wa.me/79162862863?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D1%85%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C%D1%81%D1%8F.";

const galleryOriginals = [
  "anastasia-photo1.png",
  "anastasia-photo3.png",
  "anastasia-photo4.png",
  "anastasia-photo5.png",
  "anastasia-photo6.png",
  "anastasia-photo7.png",
  "anastasia-photo8.png",
  "anastasia-photo9.png",
  "anastasia-photo10.png",
  "anastasia-photo11.png",
  "anastasia-photo12.png",
  "anastasia-photo13.png",
];

function applyFinalTweaks() {
  const root = document.querySelector<HTMLElement>(".anastasia-site");
  if (!root) return;
  const assetBase = window.location.hostname.endsWith("github.io") ? "/anastasia-tanem" : "";
  const originalsBase = `${assetBase}/assets/anastasia-originals/anastasia-originals`;
  const galleryUrls = galleryOriginals.map((filename) => `${originalsBase}/${filename}`);

  const portfolioButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("#mobile-portfolio .mct-work-tile, #mobile-portfolio .dct-film-frame"));
  portfolioButtons.forEach((button, index) => {
    const image = button.querySelector<HTMLImageElement>("img");
    const src = galleryUrls[index % galleryUrls.length];
    if (image) {
      image.src = src;
      image.alt = `Работа Анастасии ${index % galleryUrls.length + 1}`;
      image.loading = "lazy";
      image.decoding = "async";
    }
    if (!button.dataset.anastasiaBound) {
      button.dataset.anastasiaBound = "true";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const currentImage = button.querySelector<HTMLImageElement>("img");
        if (currentImage?.src) window.open(currentImage.src, "_blank", "noopener,noreferrer");
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
        <a class="mct-gallery-image" href="${src}" target="_blank" rel="noopener noreferrer" aria-label="Открыть фотографию: Работа Анастасии ${index + 1}">
          <img src="${src}" alt="Работа Анастасии ${index + 1}" loading="lazy" decoding="async" />
        </a>
      `).join("");
    }
  }

  const about = root.querySelector<HTMLElement>("#mobile-about");
  const aboutFigure = about?.querySelector<HTMLElement>(".mct-about-portrait");
  const aboutImage = aboutFigure?.querySelector<HTMLImageElement>("img");
  if (aboutFigure && aboutImage) {
    aboutFigure.classList.remove("anastasia-hide");
    aboutImage.src = `${originalsBase}/anastasia-omastere.png`;
    aboutImage.alt = "Анастасия — мастер ногтевого сервиса";
    aboutImage.loading = "lazy";
    aboutImage.decoding = "async";
  }

  const firstPromoImage = root.querySelector<HTMLImageElement>("#mobile-promotions .mct-promotion-card:first-child figure img");
  if (firstPromoImage) {
    firstPromoImage.src = `${originalsBase}/anastasia-actia1.png`;
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
    const frame = window.requestAnimationFrame(applyFinalTweaks);
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return null;
}
