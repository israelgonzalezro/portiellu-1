import type { Metadata } from "next";
import "../globals.css";
import DevBadge from "../../components/DevBadge";
import { fontClasses } from "../../lib/fonts";
import { site } from "../../lib/site";
import { languageAlternates, ogImage } from "../../lib/seo";

export { viewport } from "../../lib/seo";

const description =
  "Apartamentos rurales El Portiellu en Cabielles, a 3 km de Cangas de Onís y Covadonga (Asturias). 3 apartamentos para 2 a 4 personas. Reserva directa sin comisiones.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "El Portiellu | Apartamentos rurales en Cangas de Onís, Asturias",
    template: `%s | ${site.name}`
  },
  description,
  applicationName: site.name,
  alternates: {
    canonical: "/",
    languages: languageAlternates
  },
  openGraph: {
    title: "El Portiellu · Apartamentos rurales en Cangas de Onís",
    description,
    url: "/",
    siteName: site.name,
    locale: "es_ES",
    alternateLocale: ["en_GB"],
    type: "website",
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage.url]
  }
};

export default function SpanishRootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={fontClasses}>
      <body>
        {children}
        <DevBadge />
      </body>
    </html>
  );
}
