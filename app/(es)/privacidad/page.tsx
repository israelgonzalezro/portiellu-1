import type { Metadata } from "next";
import SiteFooter from "../../../components/SiteFooter";
import { site } from "../../../lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  alternates: { canonical: "/privacidad" },
  robots: { index: false }
};

export default function PrivacidadPage() {
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
        <h1>Política de privacidad</h1>

        <h2>Responsable del tratamiento</h2>
        <ul>
          <li>Responsable: {site.owner}</li>
          <li>NIF: {site.ownerId}</li>
          <li>
            Dirección: {site.locality}, {site.postalCode} {site.municipality} (
            {site.region})
          </li>
          <li>
            Email: <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
        </ul>

        <h2>Qué datos recogemos y para qué</h2>
        <p>
          A través del formulario de reserva recogemos tu nombre, email,
          teléfono, fechas de estancia, número de huéspedes y el mensaje que
          quieras añadir. Usamos estos datos únicamente para responder a tu
          solicitud, informarte de la disponibilidad y el precio y, en su caso,
          gestionar tu estancia.
        </p>

        <h2>Base legal</h2>
        <p>
          Tratamos tus datos porque nos los facilitas voluntariamente y das tu
          consentimiento al enviar el formulario, y porque son necesarios para
          aplicar medidas precontractuales a petición tuya (art. 6.1.a y 6.1.b
          del Reglamento General de Protección de Datos).
        </p>

        <h2>Cuánto tiempo los conservamos</h2>
        <p>
          Conservamos los datos mientras sea necesario para atender tu
          solicitud y, si se formaliza la reserva, durante los plazos que
          exijan las obligaciones legales aplicables (por ejemplo, el registro
          de viajeros o la normativa fiscal).
        </p>

        <h2>Quién más accede a los datos</h2>
        <p>
          No cedemos tus datos a terceros salvo obligación legal. Para que la
          web funcione usamos estos proveedores, que tratan los datos solo por
          cuenta nuestra:
        </p>
        <ul>
          <li>Netlify, Inc.: alojamiento de la web.</li>
          <li>
            FormSubmit: envío de las solicitudes del formulario a nuestro
            correo electrónico.
          </li>
          <li>Google (Gmail): recepción y gestión del correo electrónico.</li>
        </ul>
        <p>
          Algunos de estos proveedores pueden tratar los datos fuera del
          Espacio Económico Europeo, con las garantías previstas en el RGPD.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes solicitar el acceso, rectificación, supresión, oposición,
          limitación del tratamiento y portabilidad de tus datos, así como
          retirar tu consentimiento, escribiendo a{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. Si consideras que
          no hemos atendido correctamente tu solicitud, puedes reclamar ante la
          Agencia Española de Protección de Datos (
          <a href="https://www.aepd.es" rel="noopener noreferrer" target="_blank">
            www.aepd.es
          </a>
          ).
        </p>

        <h2>Cookies</h2>
        <p>
          Esta web no utiliza cookies de publicidad ni de analítica.
        </p>
      </article>

      <SiteFooter lang="es" />
    </main>
  );
}
