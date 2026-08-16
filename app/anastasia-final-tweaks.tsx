"use client";

import { useLayoutEffect } from "react";
import "./anastasia-final-tweaks.css";

const BOOKING = "https://wa.me/79162862863?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D1%85%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C%D1%81%D1%8F.";

function applyFinalTweaks() {
  const root = document.querySelector<HTMLElement>(".anastasia-site");
  if (!root) return;

  const assetBase = window.location.hostname.endsWith("github.io") ? "/anastasia-tanem" : "";

  // About block: use the neutral AI still life until Anastasia sends her portrait.
  const about = root.querySelector<HTMLElement>("#mobile-about");
  const aboutFigure = about?.querySelector<HTMLElement>(".mct-about-portrait");
  const aboutImage = aboutFigure?.querySelector<HTMLImageElement>("img");
  if (aboutFigure && aboutImage) {
    aboutFigure.classList.remove("anastasia-hide");
    aboutImage.src = `${assetBase}/assets/anastasia-about-ai.webp`;
    aboutImage.alt = "Маникюрные инструменты и лаки — оформление блока о мастере";
    aboutImage.loading = "lazy";
  }

  // First promotion: calm welcome visual matching the site palette.
  const firstPromoImage = root.querySelector<HTMLImageElement>("#mobile-promotions .mct-promotion-card:first-child figure img");
  if (firstPromoImage) {
    firstPromoImage.src = `${assetBase}/assets/anastasia-promo-first-ai.webp`;
    firstPromoImage.alt = "Первое посещение — скидка 10 процентов на любую процедуру";
    firstPromoImage.loading = "lazy";
  }

  // Make the booking language match the real flow: direct WhatsApp contact.
  const booking = root.querySelector<HTMLElement>("#mobile-booking");
  const bookingTitle = booking?.querySelector<HTMLElement>("h3");
  if (bookingTitle) bookingTitle.innerHTML = "Запись через WhatsApp<br /><em>напрямую у мастера</em>";

  const bookingCopy = booking?.querySelector<HTMLElement>(":scope > p");
  if (bookingCopy) {
    bookingCopy.textContent = "Нажмите кнопку — откроется чат с Анастасией и готовым сообщением «Здравствуйте, хочу записаться».";
  }

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

  // Any link that leaves this site must open in a separate tab.
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
