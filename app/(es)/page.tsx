import Image from "next/image";
import ReservaForm from "../../components/ReservaForm";
import LightboxGallery from "../../components/LightboxGallery";
import SiteFooter from "../../components/SiteFooter";
import { site } from "../../lib/site";

const img = (name: string) => `/images/optimized/${name}.webp`;

const heroImage = img("IMG_9045");

const spaceGalleries = [
  {
    space: "Salón y cocina",
    summary: "Zona de estar abierta con cocina equipada, mesa y luz natural.",
    images: [img("IMG_6209"), img("IMG_9036"), img("IMG_8571"), img("IMG_8847")]
  },
  {
    space: "Dormitorio",
    summary: "Habitación principal con ropa de cama cuidada y ambiente tranquilo.",
    images: [img("IMG_8936"), img("IMG_8825"), img("IMG_8566"), img("IMG_6234")]
  },
  {
    space: "Terraza y balcón",
    summary: "Espacios exteriores para desayunar, leer o cenar con vistas.",
    images: [img("IMG_8576"), img("IMG_8564"), img("IMG_8783"), img("IMG_8565")]
  },
  {
    space: "Fachada y entorno",
    summary: "Arquitectura rural y ambiente natural en pleno oriente asturiano.",
    images: [
      img("084CF6D9-8395-4FBA-92C4-5D6A275EE42D"),
      img("IMG_8717"),
      img("IMG_8582"),
      img("IMG_8544")
    ]
  }
];

const amenities = [
  {
    title: "Apartamentos independientes",
    text: "Cada apartamento es solo para ti: sin compartir espacios y con total privacidad."
  },
  {
    title: "Acceso cómodo",
    text: "Perfecta para escapadas cortas en cualquier época del año."
  },
  {
    title: "Terraza con vistas",
    text: "Un extra diferencial para desayunar o descansar al atardecer."
  },
  {
    title: "Base para rutas",
    text: "Buena ubicación para Covadonga, Cangas y pueblos cercanos."
  }
];

const apartments = [
  {
    title: "El Portiellu y La Caleya",
    text: "2 dormitorios, para 3 a 5 personas. Salón con TV, cocina equipada y un baño. El Portiellu está en la planta baja."
  },
  {
    title: "El Horru",
    text: "1 dormitorio para 2 personas, ideal para parejas. Disponibilidad según temporada: consúltanos."
  }
];

const practicalInfo = [
  { label: "Entrada", value: `A partir de las ${site.checkIn}` },
  { label: "Salida", value: `Hasta las ${site.checkOut}` },
  {
    label: "Incluido",
    value: "Ropa de cama, toallas, wifi y aparcamiento gratuito"
  },
  {
    label: "Ubicación",
    value: `${site.locality}, a 3 km de Cangas de Onís y de Covadonga`
  }
];

const planIdeas = [
  {
    day: "Día 1",
    title: "Cangas y gastronomía",
    text: "Paseo por el centro, puente romano y cena de cocina asturiana."
  },
  {
    day: "Día 2",
    title: "Lagos de Covadonga",
    text: "Ruta panorámica por la mañana y tarde de descanso en la casa."
  },
  {
    day: "Día 3",
    title: "Costa oriental",
    text: "Excursión a Ribadesella o Llanes antes de volver."
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description:
    "Apartamentos rurales en Cabielles, Cangas de Onís (Asturias), con solicitud de reserva directa.",
  telephone: "+34 616 924 075",
  email: site.email,
  checkinTime: site.checkIn,
  checkoutTime: site.checkOut,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.locality,
    postalCode: site.postalCode,
    addressRegion: site.region,
    addressCountry: "ES"
  },
  areaServed: "Asturias",
  url: "https://elportiellu.com",
  image: spaceGalleries
    .flatMap((group) => group.images)
    .map((img) => `https://elportiellu.com${img}`)
};

export default function HomePage() {
  return (
    <main className="site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="topbar reveal">
        <p className="brand">Apartamentos Rurales El Portiellu</p>
        <nav className="menu">
          <a href="#alojamiento">Alojamiento</a>
          <a href="#galeria">Galería</a>
          <a href="#entorno">Planes</a>
          <a href="#reserva">Reservar</a>
          <a href="/en" className="lang-switch">
            EN
          </a>
        </nav>
      </header>

      <section className="hero reveal">
        <figure className="hero-image">
          <Image
            src={heroImage}
            alt="Salón de uno de los apartamentos rurales El Portiellu en Cangas de Onís"
            width={1800}
            height={1200}
            sizes="100vw"
            quality={82}
            priority
          />
        </figure>
        <div className="hero-gradient" />
        <div className="hero-copy">
          <p className="kicker">El Portiellu · Cabielles, Cangas de Onís</p>
          <h1>Apartamentos rurales en Cangas de Onís, junto a Covadonga y los Picos de Europa</h1>
          <p>
            Tranquilidad, naturaleza y una base perfecta para disfrutar del
            oriente asturiano con escapadas de 2 a 7 días.
          </p>
          <div className="hero-actions">
            <a href="#reserva" className="cta">
              Pedir disponibilidad
            </a>
            <a href="#galeria" className="ghost">
              Ver espacios
            </a>
          </div>
        </div>
        <ul className="hero-metrics">
          <li>
            <strong>3 apartamentos</strong>
            <span>De 2 a 5 personas cada uno</span>
          </li>
          <li>
            <strong>A 3 km de Cangas</strong>
            <span>Y del santuario de Covadonga</span>
          </li>
          <li>
            <strong>Reserva directa</strong>
            <span>
              Formulario o teléfono <a href={site.phoneHref}>{site.phone}</a>
            </span>
          </li>
        </ul>
      </section>

      <section className="section reveal" id="alojamiento">
        <div className="section-head">
          <p className="eyebrow">Alojamiento</p>
          <h2>Lo mejor de la casa</h2>
          <p>
            Diseño sencillo, funcional y acogedor. Todo pensado para una
            estancia cómoda desde el primer día.
          </p>
        </div>
        <div className="amenities">
          {amenities.map((item) => (
            <article key={item.title} className="amenity">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="facts">
          <div className="facts-col">
            <h3>Los apartamentos</h3>
            {apartments.map((item) => (
              <div key={item.title} className="fact">
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <div className="facts-col">
            <h3>Información práctica</h3>
            {practicalInfo.map((item) => (
              <div key={item.label} className="fact">
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal" id="galeria">
        <div className="section-head">
          <p className="eyebrow">Galería</p>
          <h2>Espacios de la casa</h2>
          <p>Fotos organizadas por zonas para ver rápido todo el alojamiento.</p>
        </div>
        {spaceGalleries.map((group) => (
          <article className="space-block" key={group.space}>
            <div className="space-head">
              <h3>{group.space}</h3>
              <p>{group.summary}</p>
            </div>
            <LightboxGallery title={group.space} images={group.images} lang="es" />
          </article>
        ))}
      </section>

      <section className="section split reveal" id="entorno">
        <div className="stack">
          <p className="eyebrow">Entorno</p>
          <h2>Plan sugerido para tu escapada</h2>
          <p>
            Si vienes pocos días, este orden te permite ver lo esencial sin ir
            con prisas.
          </p>
          <div className="timeline">
            {planIdeas.map((item) => (
              <article key={item.day} className="stop">
                <p className="day">{item.day}</p>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="stack callout">
          <p className="eyebrow">Reserva</p>
          <h3>Consulta fechas sin compromiso</h3>
          <p>
            Envía tu solicitud y te respondemos con disponibilidad, precio final
            y condiciones de estancia.
          </p>
          <a href="#reserva" className="cta cta-inline">
            Ir al formulario
          </a>
          <p className="callout-contact">
            ¿Prefieres hablar con nosotros? Llama al{" "}
            <a href={site.phoneHref}>{site.phone}</a> o escribe a{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </aside>
      </section>

      <section className="section form-wrap reveal" id="reserva">
        <p className="eyebrow">Formulario</p>
        <h2>Solicitud de reserva</h2>
        <p>
          Completa los datos básicos. Te responderemos con disponibilidad y los
          siguientes pasos para confirmar.
        </p>
        <ReservaForm lang="es" />
      </section>

      <SiteFooter lang="es" />
    </main>
  );
}
