import { Cinzel, Source_Sans_3 } from "next/font/google";

export const display = Cinzel({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap"
});

export const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

export const fontClasses = `${display.variable} ${body.variable}`;
