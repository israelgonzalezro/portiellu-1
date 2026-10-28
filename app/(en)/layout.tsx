import type { Metadata } from "next";
import "../globals.css";
import DevBadge from "../../components/DevBadge";
import { fontClasses } from "../../lib/fonts";
import { site } from "../../lib/site";
import { languageAlternates, ogImage } from "../../lib/seo";

export { viewport } from "../../lib/seo";

const description =
  "El Portiellu rural apartments in Cabielles, 3 km from Cangas de Onís and Covadonga (Asturias, Spain). 3 apartments for 2 to 5 guests. Book direct, no fees.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "El Portiellu | Rural apartments in Cangas de Onís, Asturias",
  description,
  applicationName: site.name,
  alternates: {
    canonical: "/en",
    languages: languageAlternates
  },
  openGraph: {
    title: "El Portiellu · Rural apartments in Cangas de Onís",
    description,
    url: "/en",
    siteName: site.name,
    locale: "en_GB",
    alternateLocale: ["es_ES"],
    type: "website",
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage.url]
  }
};

export default function EnglishRootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontClasses}>
      <body>
        {children}
        <DevBadge />
      </body>
    </html>
  );
}
