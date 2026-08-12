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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <a
          id="yclients-booking-proxy"
          className="ms_booking yclients-booking-proxy"
          data-url="https://n962951.yclients.com/company/894717/personal/select-time"
          aria-hidden="true"
          tabIndex={-1}
        />
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
