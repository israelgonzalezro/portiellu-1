import { site } from "../lib/site";

type SiteFooterProps = {
  lang?: "es" | "en";
};

export default function SiteFooter({ lang = "es" }: SiteFooterProps) {
  const isEn = lang === "en";

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">{site.name}</p>
          <p>
            {site.locality}, {site.postalCode} {site.municipality} ({site.region})
          </p>
          <p>
            {isEn ? "Tourism registry no." : "Registro de Turismo del Principado de Asturias"}:{" "}
            <strong>{site.registry}</strong>
          </p>
        </div>
        <div>
          <p className="footer-title">{isEn ? "Contact" : "Contacto"}</p>
          <p>
            <a href={site.phoneHref}>{site.phone}</a>
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div>
          <p className="footer-title">{isEn ? "Legal" : "Información legal"}</p>
          <p>
            <a href="/aviso-legal">{isEn ? "Legal notice (Spanish)" : "Aviso legal"}</a>
          </p>
          <p>
            <a href="/privacidad">{isEn ? "Privacy policy (Spanish)" : "Política de privacidad"}</a>
          </p>
        </div>
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
