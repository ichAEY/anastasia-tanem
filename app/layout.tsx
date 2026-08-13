import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "./globals.css";
import "./desktop-claytone.css";
import "./desktop-performance.css";
import "./claytone-refinement.css";
import "./site-tuning.css";

export const metadata: Metadata = {
  title: "Нонна | ClayTone Nail Studio",
  description: "Маникюр и педикюр в Москве — ClayTone Nail Studio.",
  keywords: [
    "маникюр Спортивная",
    "педикюр Спортивная",
    "мастер маникюра Москва",
    "ClayTone",
    "Нонна маникюр",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Нонна | ClayTone Nail Studio",
    description: "Маникюр и педикюр в Москве — ClayTone Nail Studio.",
    type: "website",
    locale: "ru_RU",
    images: ["/assets/nonna-portrait.jpeg"],
  },
  icons: {
    icon: "/assets/favicon.png",
    shortcut: "/assets/favicon.png",
  },
  other: { "codex-preview": "development" },
};

const yandexMetrikaCode = `
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111558185', 'ym');

ym(111558185, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: yandexMetrikaCode }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/111558185"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        <a
          id="yclients-booking-proxy"
          className="ms_booking yclients-booking-proxy"
          data-url="https://n962951.yclients.com/company/894717/personal/select-time"
          aria-hidden="true"
          tabIndex={-1}
        />
        <script src="claytone-enhancements.js?v=20260813-8" defer />
        <script
          type="text/javascript"
          src="//w962951.yclients.com/widgetJS"
          charSet="UTF-8"
          defer
        />
      </body>
    </html>
  );
}
