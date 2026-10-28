import type { Metadata } from "next";
import SiteFooter from "../../components/SiteFooter";
import { site } from "../../lib/site";

export const metadata: Metadata = {
  title: `Aviso legal | ${site.name}`,
  robots: { index: false }
};

export default function AvisoLegalPage() {
  return (
    <main className="site">
      <header className="topbar">
        <a href="/" className="brand">
          {site.name}
        </a>
        <nav className="menu">
          <a href="/">Volver a la web</a>
        </nav>
      </header>

      <article className="section form-wrap legal">
        <p className="eyebrow">Información legal</p>
        <h1>Aviso legal</h1>

        <h2>Titular del sitio web</h2>
        <p>
          En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la
          Información y de Comercio Electrónico (LSSI-CE), se informa de los
          datos del titular de este sitio web:
        </p>
        <ul>
          <li>Titular: {site.owner}</li>
          <li>NIF: {site.ownerId}</li>
          <li>
            Domicilio del establecimiento: {site.locality}, {site.postalCode}{" "}
            {site.municipality} ({site.region})
          </li>
          <li>
            Teléfono: <a href={site.phoneHref}>{site.phone}</a>
          </li>
          <li>
            Email: <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            Establecimiento inscrito en el Registro de Empresas y Actividades
            Turísticas del Principado de Asturias con el código {site.registry}.
          </li>
        </ul>

        <h2>Objeto</h2>
        <p>
          Este sitio web informa sobre los apartamentos turísticos {site.name} y
          permite enviar solicitudes de disponibilidad y reserva. El envío de
          una solicitud no supone una reserva confirmada hasta que el titular la
          confirme expresamente.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Los textos, fotografías y demás contenidos de este sitio web son
          propiedad del titular o se usan con autorización. No está permitida
          su reproducción sin consentimiento previo.
        </p>

        <h2>Responsabilidad</h2>
        <p>
          El titular procura que la información publicada sea correcta y esté
          actualizada, pero no se responsabiliza de errores puntuales ni del
          uso que terceros hagan de ella. Los precios y la disponibilidad se
          confirman siempre de forma individual.
        </p>

        <h2>Legislación aplicable</h2>
        <p>
          Este aviso legal se rige por la legislación española.
        </p>
      </article>

      <SiteFooter lang="es" />
    </main>
  );
}
