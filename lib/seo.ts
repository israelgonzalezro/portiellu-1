import type { Viewport } from "next";
import { site } from "./site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f4034"
};

export const languageAlternates = {
  "es-ES": "/",
  "en-GB": "/en",
  "x-default": "/"
};

export const ogImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${site.name}, Cabielles (Cangas de Onís)`
};
