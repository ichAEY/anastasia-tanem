"use client";

import { useLayoutEffect } from "react";
import MobileClayTone from "./mobile-claytone";
import "./anastasia-overrides.css";

const PHONE = "+7 916 286-28-63";
const TEL = "tel:+79162862863";
const BOOKING = "https://wa.me/79162862863?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D1%85%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C%D1%81%D1%8F.";
const MAP = "https://yandex.ru/maps/org/anastasiya/142517400350/?ll=37.591117%2C55.788965&z=17";
const REVIEWS = "https://yandex.ru/maps/org/anastasiya/142517400350/reviews/";
const ROUTE = "https://yandex.ru/maps/?mode=routes&rtext=~55.788965%2C37.591117&rtt=auto";
const MAP_EMBED = "https://yandex.ru/map-widget/v1/?ll=37.591117%2C55.788965&mode=search&oid=142517400350&ol=biz&z=17";

type ServiceCategory = "manicure" | "pedicure" | "lashes_brows";
type Service = {
  name: string;
  price: string;
  description: string;
  category: ServiceCategory;
};

const services: Service[] = [
  { name: "Маникюр", price: "1 000 ₽", description: "Базовая обработка ногтей и кутикулы.", category: "manicure" },
  { name: "Маникюр с покрытием гель-лак", price: "1 900 ₽", description: "Маникюр и стойкое покрытие гель-лаком.", category: "manicure" },
  { name: "Комплекс маникюр с покрытием гель-лак", price: "2 500 ₽", description: "Маникюр на выбор, покрытие гель-лаком; снятие — в подарок.", category: "manicure" },
  { name: "Маникюр: классический / европейский / аппаратный / комбинированный", price: "1 200 ₽", description: "Выбор техники обработки в зависимости от состояния ногтей и кожи.", category: "manicure" },
  { name: "Укрепление акриловой пудрой", price: "300 ₽", description: "Дополнительное укрепление ногтевой пластины.", category: "manicure" },
  { name: "Укрепление гелем", price: "1 000 ₽", description: "Укрепление и выравнивание ногтей гелем.", category: "manicure" },
  { name: "Коррекция наращённых ногтей без маникюра", price: "от 1 500 ₽", description: "Коррекция длины и формы наращённых ногтей.", category: "manicure" },
  { name: "Наращивание ногтей без маникюра", price: "от 2 500 ₽", description: "Моделирование желаемой длины и формы.", category: "manicure" },
  { name: "Снятие гель-лака", price: "300 ₽", description: "Аккуратное снятие старого покрытия.", category: "manicure" },

  { name: "Педикюр: SMART / классический / аппаратный / комбинированный", price: "2 300 ₽", description: "Обработка ногтей и стоп выбранной техникой.", category: "pedicure" },
  { name: "Педикюр с покрытием гель-лак", price: "3 500 ₽", description: "Педикюр и покрытие гель-лаком; снятие — в подарок.", category: "pedicure" },

  { name: "Наращивание ресниц — классический объём", price: "2 500 ₽", description: "Классическое поресничное наращивание.", category: "lashes_brows" },
  { name: "Наращивание ресниц — 2D", price: "3 000 ₽", description: "Двойной объём с аккуратным распределением ресниц.", category: "lashes_brows" },
  { name: "Наращивание ресниц — 3D", price: "3 500 ₽", description: "Тройной объём для более выразительного взгляда.", category: "lashes_brows" },
  { name: "Наращивание ресниц — Hollywood 4D–5D", price: "4 500 ₽", description: "Выразительный объём 4D–5D.", category: "lashes_brows" },
  { name: "Ламинирование ресниц", price: "1 500 ₽", description: "Изгиб, визуальная длина и ухоженный вид натуральных ресниц.", category: "lashes_brows" },
  { name: "Оформление бровей пинцет / нитка", price: "700 ₽", description: "Коррекция и оформление формы бровей.", category: "lashes_brows" },
  { name: "Окрашивание бровей краской / хной", price: "700 ₽", description: "Окрашивание с подбором подходящего оттенка.", category: "lashes_brows" },
  { name: "Ламинирование бровей", price: "1 500 ₽", description: "Укладка и фиксация формы бровей.", category: "lashes_brows" },
];

const COLLAPSED_ALL_COUNT = services.findIndex((service) => service.name === "Снятие гель-лака") + 1;

const reviews = [
  ["Елена Лукьянова", "Очень аккуратная работа, большой выбор оттенков и профессиональный подход."],
  ["Александра В.", "Комфортная атмосфера, качественный маникюр и внимание к пожеланиям клиента."],
  ["Татьяна Рыкова", "Маникюр носится больше месяца, в кабинете чисто и всё продумано для комфорта."],
  ["Анастасия Метелица", "Большой опыт мастера, комфортный сервис и результат, которому можно доверять."],
] as const;

function patchText(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const value = node.nodeValue ?? "";
    const next = value
      .replaceAll("ClayTone", "Анастасия")
      .replaceAll("Нонне", "Анастасии")
      .replaceAll("Нонны", "Анастасии")
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
      el.setAttribute(attr, value.replaceAll("ClayTone", "Анастасия").replaceAll("Нонна", "Анастасия"));
    }
  });

  root.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    if (href.startsWith("tel:")) {
      a.href = TEL;
      if (a.textContent?.includes("905 414")) a.textContent = PHONE;
    }
    if (href.includes("yclients.com")) a.href = BOOKING;
    if (href.includes("132613437697") || href.includes("/maps/org/claytone")) {
      a.href = href.includes("reviews") ? REVIEWS : MAP;
    }
    if (href.includes("mode=routes")) a.href = ROUTE;
    if (href.includes("t.me/")) a.classList.add("anastasia-hide");
  });

  root.querySelectorAll<HTMLIFrameElement>("iframe").forEach((frame) => {
    if (frame.src.includes("yandex")) frame.src = MAP_EMBED;
  });
}

function injectServices() {
  const shell = document.querySelector<HTMLElement>("#mobile-prices .mct-shell");
  if (!shell || shell.querySelector(".anastasia-services")) return;

  const host = document.createElement("div");
  host.className = "anastasia-services";
  host.innerHTML = `
    <div class="anastasia-tabs" role="tablist" aria-label="Категории услуг">
      <button class="mct-tab is-active" type="button" data-category="all">Все</button>
      <button class="mct-tab" type="button" data-category="manicure">Маникюр</button>
      <button class="mct-tab" type="button" data-category="pedicure">Педикюр</button>
      <button class="mct-tab" type="button" data-category="lashes_brows">Ресницы и брови</button>
    </div>
    <div class="anastasia-service-list"></div>
    <button class="mct-more-services anastasia-more-services" type="button" aria-expanded="false">
      <span>Посмотреть всё меню</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
  `;

  shell.appendChild(host);

  const list = host.querySelector<HTMLElement>(".anastasia-service-list");
  const more = host.querySelector<HTMLButtonElement>(".anastasia-more-services");
  const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>("[data-category]"));
  if (!list || !more) return;

  let category: "all" | ServiceCategory = "all";
  let expanded = false;

  const render = () => {
    const filtered = category === "all" ? services : services.filter((service) => service.category === category);
    const visible = category === "all" && !expanded ? filtered.slice(0, COLLAPSED_ALL_COUNT) : filtered;

    list.innerHTML = visible.map((service) => `
      <article class="mct-service-row">
        <div class="mct-service-name">
          <strong>${service.name}</strong>
          <p class="dct-service-description">${service.description}</p>
        </div>
        <div class="mct-service-action">
          <b>${service.price}</b>
          <a href="${BOOKING}" target="_blank" rel="noopener noreferrer">Записаться →</a>
        </div>
      </article>
    `).join("");

    const canExpand = category === "all" && filtered.length > COLLAPSED_ALL_COUNT;
    more.hidden = !canExpand;
    more.classList.toggle("is-open", expanded);
    more.setAttribute("aria-expanded", String(expanded));
    const label = more.querySelector("span");
    if (label) label.textContent = expanded ? "Свернуть меню" : "Посмотреть всё меню";

    tabs.forEach((tab) => {
      const active = tab.dataset.category === category;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      category = (tab.dataset.category ?? "all") as typeof category;
      expanded = false;
      render();
      tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  });

  more.addEventListener("click", () => {
    expanded = !expanded;
    render();
  });

  render();
}

function patchStaticContent() {
  const root = document.querySelector<HTMLElement>(".anastasia-site");
  if (!root) return;

  patchText(root);
  patchAttributes(root);
  injectServices();

  root.querySelectorAll<HTMLElement>(".mct-brand").forEach((el) => { el.textContent = "Анастасия"; });

  const heroTitle = root.querySelector<HTMLElement>(".mct-hero h1");
  if (heroTitle) heroTitle.innerHTML = "Анастасия — мастер <em>маникюра и педикюра</em>";
  const heroCopy = root.querySelector<HTMLElement>(".mct-hero-copy");
  if (heroCopy) heroCopy.textContent = "10 лет опыта. Маникюр, педикюр, ресницы и брови — аккуратно, с вниманием к пожеланиям и результату.";

  const stats = root.querySelectorAll<HTMLElement>(".mct-stats .mct-stat");
  if (stats[0]?.querySelector("strong")) stats[0].querySelector("strong")!.textContent = "10";
  if (stats[1]?.querySelector("strong")) stats[1].querySelector("strong")!.innerHTML = '4,9 <i class="mct-stat-star">★</i>';
  if (stats[2]?.querySelector("strong")) stats[2].querySelector("strong")!.textContent = "58";

  const portfolio = root.querySelector<HTMLElement>("#mobile-portfolio");
  const portfolioHeading = portfolio?.querySelector<HTMLElement>("h2");
  if (portfolioHeading) portfolioHeading.textContent = "Работы";
  const portfolioNote = portfolio?.querySelector<HTMLElement>(".mct-section-note");
  if (portfolioNote) portfolioNote.textContent = "Галерея работ мастера";

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
  const monogram = about?.querySelector<HTMLElement>(".mct-about-monogram");
  if (monogram) monogram.textContent = "A";
  const aboutTitle = about?.querySelector<HTMLElement>("h2");
  if (aboutTitle) aboutTitle.innerHTML = "Анастасия — мастер<br />бьюти-сервиса";
  const aboutExperience = about?.querySelector<HTMLElement>(".mct-about-experience strong");
  if (aboutExperience) aboutExperience.textContent = "10";
  const aboutLead = about?.querySelector<HTMLElement>(".mct-about-lead");
  if (aboutLead) aboutLead.textContent = "Анастасия — мастер с 10-летним опытом.";
  const aboutParagraphs = about?.querySelectorAll<HTMLElement>(".mct-about-copy > p");
  if (aboutParagraphs?.[1]) aboutParagraphs[1].textContent = "Маникюр, педикюр, наращивание и укрепление ногтей, а также процедуры для ресниц и бровей.";
  if (aboutParagraphs?.[2]) aboutParagraphs[2].textContent = "Кабинет находится рядом с метро Савёловская. Запись ведётся напрямую у мастера.";
  const aboutItems = about?.querySelectorAll<HTMLElement>(".mct-about-list li");
  ["Маникюр и педикюр", "Ресницы и брови", "10 лет опыта"].forEach((text, index) => {
    if (aboutItems?.[index]) aboutItems[index].textContent = text;
  });

  const reviewSummary = root.querySelector<HTMLElement>(".mct-review-summary");
  const reviewRating = reviewSummary?.querySelector<HTMLElement>("strong");
  const reviewMeta = reviewSummary?.querySelector<HTMLElement>("span");
  if (reviewRating) reviewRating.textContent = "4,9";
  if (reviewMeta) reviewMeta.innerHTML = "58 оценок<br />Все отзывы на Яндексе →";

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

  const footer = root.querySelector<HTMLElement>(".dct-footer span");
  if (footer) footer.textContent = "Маникюр, педикюр, ресницы и брови · Москва";

  root.querySelectorAll<HTMLAnchorElement>('a[href*="t.me/"]').forEach((a) => a.classList.add("anastasia-hide"));
  root.querySelectorAll<HTMLAnchorElement>('a[href*="yclients.com"]').forEach((a) => { a.href = BOOKING; });
  root.querySelectorAll<HTMLAnchorElement>('a[href*="132613437697"]').forEach((a) => {
    a.href = a.href.includes("reviews") ? REVIEWS : MAP;
  });
}

export default function AnastasiaSite() {
  useLayoutEffect(() => {
    patchStaticContent();
  }, []);

  return (
    <div className="anastasia-site">
      <MobileClayTone />
    </div>
  );
}
