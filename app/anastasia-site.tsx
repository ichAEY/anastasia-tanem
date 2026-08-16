"use client";

import { useLayoutEffect } from "react";
import MobileClayTone from "./mobile-claytone";
import "./anastasia-overrides.css";

const PHONE = "+7 916 286-28-63";
const TEL = "tel:+79162862863";
const BOOKING = "https://wa.me/79162862863";
const MAP = "https://yandex.ru/maps/org/anastasiya/142517400350/?ll=37.591117%2C55.788965&z=17";
const REVIEWS = "https://yandex.ru/maps/org/anastasiya/142517400350/reviews/";
const ROUTE = "https://yandex.ru/maps/?mode=routes&rtext=~55.788965%2C37.591117&rtt=auto";
const MAP_EMBED = "https://yandex.ru/map-widget/v1/?ll=37.591117%2C55.788965&mode=search&oid=142517400350&ol=biz&z=17";

const WORK_PHOTOS = [
  "https://avatars.mds.yandex.net/get-altay/11400692/2a0000019107cf21104ea443ca7b239bc60f/XXL_height",
  "https://avatars.mds.yandex.net/get-altay/16874425/2a0000019cedd69b335ce820adeb59852bbd/XXL_height",
  "https://avatars.mds.yandex.net/get-altay/19541413/2a0000019cedd68954027780d4559697183e/XXL_height",
  "https://avatars.mds.yandex.net/get-altay/15223195/2a000001967c4576fe3c146b9303846e1f1e/XXL_height",
];

const reviews = [
  ["Елена Лукьянова", "Очень аккуратная работа, большой выбор оттенков и профессиональный подход."],
  ["Александра В.", "Комфортная атмосфера, качественный маникюр и внимание к пожеланиям клиента."],
  ["Татьяна Рыкова", "Маникюр носится больше месяца, в кабинете чисто и всё продумано для комфорта."],
  ["Анастасия Метелица", "Большой опыт мастера, комфортный сервис и результат, которому можно доверять."],
] as const;

const services = {
  manicure: [
    ["Комплекс маникюр с покрытием гель-лак", "3 000 ₽", "Снятие, маникюр и покрытие. Запись напрямую у мастера."],
    ["Маникюр с покрытием гель-лак", "1 900 ₽", "Аккуратная обработка и покрытие гель-лаком."],
    ["Коррекция наращённых ногтей без маникюра", "от 1 500 ₽", "Коррекция длины и формы наращённых ногтей."],
    ["Наращивание ногтей без маникюра", "от 2 500 ₽", "Моделирование длины и формы ногтей."],
    ["Укрепление акриловой пудрой", "300 ₽", "Дополнительное укрепление ногтевой пластины."],
    ["Укрепление гелем", "1 000 ₽", "Укрепление и выравнивание ногтевой пластины."],
    ["Снятие гель-лака", "300 ₽", "Аккуратное снятие покрытия."],
  ],
  pedicure: [
    ["Педикюр", "2 300 ₽", "SMART, классический, аппаратный или комбинированный педикюр."],
    ["Педикюр с покрытием гель-лак", "3 500 ₽", "Педикюр и покрытие гель-лаком."],
  ],
  extra: [
    ["Оформление бровей пинцет / нитка", "700 ₽", "Коррекция формы бровей."],
    ["Окрашивание бровей", "700 ₽", "Окрашивание краской или хной."],
  ],
} as const;

function patchText(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const value = node.nodeValue ?? "";
    const next = value
      .replaceAll("ClayTone", "Анастасия")
      .replaceAll("Нонна", "Анастасия")
      .replaceAll("+7 905 414-10-88", PHONE)
      .replaceAll("Кооперативная улица, 4, корп. 9", "Новослободская улица, 67/69")
      .replaceAll("м. Спортивная", "м. Савёловская")
      .replaceAll("более восьми лет", "10 лет")
      .replaceAll("Более восьми лет", "10 лет");
    if (next !== value) node.nodeValue = next;
  }
}

function patchAttributes(root: ParentNode) {
  root.querySelectorAll<HTMLElement>("[aria-label], [title]").forEach((el) => {
    for (const attr of ["aria-label", "title"] as const) {
      const value = el.getAttribute(attr);
      if (!value) continue;
      const next = value.replaceAll("ClayTone", "Анастасия").replaceAll("Нонна", "Анастасия");
      if (next !== value) el.setAttribute(attr, next);
    }
  });

  root.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    if (href.startsWith("tel:")) {
      a.href = TEL;
      if (a.textContent?.includes("905 414")) a.textContent = PHONE;
    }
    if (href.includes("yclients.com")) a.href = BOOKING;
    if (href.includes("132613437697") || href.includes("/maps/org/claytone")) a.href = href.includes("reviews") ? REVIEWS : MAP;
    if (href.includes("mode=routes")) a.href = ROUTE;
    if (href.includes("t.me/")) a.classList.add("anastasia-hide");
  });

  root.querySelectorAll<HTMLIFrameElement>("iframe").forEach((frame) => {
    if (frame.src.includes("yandex")) frame.src = MAP_EMBED;
  });
}

function patchImages(root: ParentNode) {
  let workIndex = 0;
  root.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    const src = img.getAttribute("src") ?? "";
    if (src.includes("nonna-about")) {
      img.closest("figure")?.classList.add("anastasia-hide");
      return;
    }
    if (src.includes("nonna-portrait")) {
      img.src = WORK_PHOTOS[0];
      img.alt = "Работа Анастасии — мастер маникюра и педикюра";
      return;
    }
    if (
      src.includes("before-after") ||
      src.includes("/assets/work-") ||
      src.includes("mobile-work-") ||
      src.includes("portfolio-")
    ) {
      img.src = WORK_PHOTOS[workIndex % WORK_PHOTOS.length];
      img.alt = "Работа Анастасии — маникюр и ногтевой сервис";
      workIndex += 1;
    }
  });
}

function injectServices(root: HTMLElement) {
  const shell = root.querySelector<HTMLElement>("#mobile-prices .mct-shell");
  if (!shell || shell.querySelector(".anastasia-services")) return;

  const host = document.createElement("div");
  host.className = "anastasia-services";

  const group = (title: string, items: readonly (readonly [string, string, string])[]) => `
    <section class="anastasia-service-group">
      <h3>${title}</h3>
      <div class="anastasia-service-list">
        ${items.map(([name, price, description]) => `
          <article class="mct-service-row">
            <div class="mct-service-name"><strong>${name}</strong><p class="dct-service-description">${description}</p></div>
            <div class="mct-service-action"><b>${price}</b><a href="${BOOKING}" target="_blank" rel="noopener noreferrer">Записаться →</a></div>
          </article>`).join("")}
      </div>
    </section>`;

  host.innerHTML = group("Маникюр", services.manicure) + group("Педикюр", services.pedicure) + group("Дополнительно", services.extra);
  shell.appendChild(host);
}

function patchStaticContent(root: HTMLElement) {
  patchText(root);
  patchAttributes(root);
  patchImages(root);
  injectServices(root);

  root.querySelectorAll<HTMLElement>(".mct-brand").forEach((el) => { el.textContent = "Анастасия"; });

  const heroTitle = root.querySelector<HTMLElement>(".mct-hero h1");
  if (heroTitle) heroTitle.innerHTML = "Анастасия — мастер <em>маникюра и педикюра</em>";
  const heroCopy = root.querySelector<HTMLElement>(".mct-hero-copy");
  if (heroCopy) heroCopy.textContent = "10 лет опыта. Маникюр, педикюр, покрытие, укрепление и наращивание с аккуратной обработкой и стерильными инструментами.";

  const stats = root.querySelectorAll<HTMLElement>(".mct-stats .mct-stat");
  if (stats[0]?.querySelector("strong")) stats[0].querySelector("strong")!.textContent = "10";
  if (stats[1]?.querySelector("strong")) stats[1].querySelector("strong")!.innerHTML = '4,9 <i class="mct-stat-star">★</i>';
  if (stats[2]?.querySelector("strong")) stats[2].querySelector("strong")!.textContent = "65";

  const portfolio = root.querySelector<HTMLElement>("#mobile-portfolio");
  const portfolioHeading = portfolio?.querySelector<HTMLElement>("h2");
  if (portfolioHeading) portfolioHeading.textContent = "Работы";
  const portfolioNote = portfolio?.querySelector<HTMLElement>(".mct-section-note");
  if (portfolioNote) portfolioNote.textContent = "Примеры работ Анастасии";
  portfolio?.querySelectorAll<HTMLElement>(".mct-ba-labels").forEach((el) => el.classList.add("anastasia-hide"));

  const promoHead = root.querySelector<HTMLElement>("#mobile-promotions .mct-promotions-head .mct-section-kicker");
  if (promoHead) promoHead.textContent = "Акции Анастасии";
  const promoCards = root.querySelectorAll<HTMLElement>("#mobile-promotions .mct-promotion-card");
  const promoData = [
    ["Первое посещение", "−10% на любую процедуру", "Скидка при первом посещении", "При первом визите действует скидка 10% на любую процедуру."],
    ["Комплекс", "Маникюр + педикюр с покрытием", "SPA в подарок", "При записи на комплекс маникюр и педикюр с покрытием — SPA в подарок."],
  ] as const;
  promoCards.forEach((card, index) => {
    const data = promoData[index % promoData.length];
    const span = card.querySelector<HTMLElement>(".mct-promotion-copy > span");
    const h3 = card.querySelector<HTMLElement>("h3");
    const benefit = card.querySelector<HTMLElement>(".mct-promotion-benefit");
    const p = card.querySelector<HTMLElement>(".mct-promotion-copy > p");
    if (span) span.textContent = data[0];
    if (h3) h3.textContent = data[1];
    if (benefit) benefit.textContent = data[2];
    if (p) p.textContent = data[3];
  });

  const about = root.querySelector<HTMLElement>("#mobile-about");
  const aboutTitle = about?.querySelector<HTMLElement>("h2");
  if (aboutTitle) aboutTitle.innerHTML = "Анастасия — мастер<br />ногтевого сервиса";
  const aboutExperience = about?.querySelector<HTMLElement>(".mct-about-experience strong");
  if (aboutExperience) aboutExperience.textContent = "10";
  const aboutLead = about?.querySelector<HTMLElement>(".mct-about-lead");
  if (aboutLead) aboutLead.textContent = "Анастасия — мастер маникюра и педикюра с 10-летним опытом.";
  const aboutParagraphs = about?.querySelectorAll<HTMLElement>(".mct-about-copy > p");
  if (aboutParagraphs?.[1]) aboutParagraphs[1].textContent = "Работает с маникюром, педикюром, покрытием, укреплением и наращиванием ногтей. Перед процедурой уточняет пожелания по форме и результату.";
  if (aboutParagraphs?.[2]) aboutParagraphs[2].textContent = "Кабинет находится рядом с метро Савёловская. Инструменты проходят стерилизацию, запись ведётся напрямую у мастера.";
  const aboutItems = about?.querySelectorAll<HTMLElement>(".mct-about-list li");
  ["Маникюр и педикюр", "Наращивание и укрепление", "Стерильные инструменты"].forEach((text, i) => {
    if (aboutItems?.[i]) aboutItems[i].textContent = text;
  });

  const reviewCards = root.querySelectorAll<HTMLAnchorElement>("#mobile-reviews .mct-review-card");
  reviewCards.forEach((card, index) => {
    const [author, text] = reviews[index % reviews.length];
    card.href = REVIEWS;
    const quote = card.querySelector<HTMLElement>("blockquote");
    const small = card.querySelector<HTMLElement>("small");
    if (quote) quote.textContent = `«${text}»`;
    if (small) small.textContent = `${author} · Яндекс Карты`;
  });

  const visitAddress = root.querySelector<HTMLElement>(".mct-visit-address");
  if (visitAddress) visitAddress.innerHTML = "Москва, Новослободская улица, 67/69<span>м. Савёловская · ежедневно 10:00–22:00</span>";

  root.querySelectorAll<HTMLAnchorElement>('a[href*="t.me/"]').forEach((a) => a.classList.add("anastasia-hide"));
  root.querySelectorAll<HTMLAnchorElement>('a[href*="yclients.com"]').forEach((a) => { a.href = BOOKING; });
  root.querySelectorAll<HTMLAnchorElement>('a[href*="132613437697"]').forEach((a) => { a.href = a.href.includes("reviews") ? REVIEWS : MAP; });
}

export default function AnastasiaSite() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".anastasia-site");
    if (!root) return;
    patchStaticContent(root);
  }, []);

  return (
    <div className="anastasia-site">
      <MobileClayTone />
    </div>
  );
}
