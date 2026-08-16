import type { Metadata } from "next";
import AnastasiaSite from "./anastasia-site";
import AnastasiaFinalTweaks from "./anastasia-final-tweaks";

export const metadata: Metadata = {
  title: "Анастасия — мастер маникюра и педикюра в Москве",
  description: "Маникюр, педикюр, покрытие, укрепление и наращивание. 10 лет опыта. Москва, Новослободская улица, 67/69.",
};

export default function Page() {
  return (
    <div className="site-root">
      <AnastasiaSite />
      <AnastasiaFinalTweaks />
    </div>
  );
}
