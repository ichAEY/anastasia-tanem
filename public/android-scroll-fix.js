(() => {
  if (!window.matchMedia("(max-width: 767px)").matches) return;

  const unlockScroll = () => {
    const overlayOpen = document.querySelector(".mct-gallery-overlay, .mct-lightbox");
    if (overlayOpen) return;

    document.documentElement.style.overflowY = "auto";
    document.body.style.overflow = "";
    document.body.style.overflowY = "auto";
    document.body.style.touchAction = "pan-y";
  };

  // Android browsers and in-app WebViews can occasionally keep the intro scroll lock.
  window.setTimeout(unlockScroll, 1900);
  window.setTimeout(unlockScroll, 2600);
  window.addEventListener("pageshow", () => window.setTimeout(unlockScroll, 80));
})();
