import type { Metadata } from "next";
import Image from "next/image";
import ReservaForm from "../../components/ReservaForm";
import LightboxGallery from "../../components/LightboxGallery";
import SiteFooter from "../../components/SiteFooter";
import { site } from "../../lib/site";

const img = (name: string) => `/images/optimized/${name}.webp`;

const heroImage = img("IMG_9045");

const spaceGalleries = [
  {
    space: "Living room and kitchen",
    summary: "Open-plan living area with equipped kitchen, dining table and natural light.",
    images: [img("IMG_6209"), img("IMG_9036"), img("IMG_8571"), img("IMG_8847")]
  },
  {
    space: "Bedroom",
    summary: "Main bedroom with a calm atmosphere and carefully prepared bedding.",
    images: [img("IMG_8936"), img("IMG_8825"), img("IMG_8566"), img("IMG_6234")]
  },
  {
    space: "Terrace and balcony",
    summary: "Outdoor areas to have breakfast, read or enjoy dinner with mountain views.",
    images: [img("IMG_8576"), img("IMG_8564"), img("IMG_8783"), img("IMG_8565")]
  },
  {
    space: "Facade and surroundings",
    summary: "Traditional rural architecture in a natural setting in Eastern Asturias.",
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
    title: "Self-contained apartments",
    text: "Each apartment is yours alone: no shared spaces and full privacy."
  },
  {
    title: "Easy access",
    text: "Ideal for short breaks and weekend trips at any time of the year."
  },
  {
    title: "Terrace with views",
    text: "A standout feature for breakfast, sunset time and slow evenings."
  },
  {
    title: "Great base for routes",
    text: "Well located for Covadonga, Cangas and nearby villages."
  }
];

const apartments = [
  {
    title: "2 two-bedroom apartments",
    text: "For 3 to 5 guests. Living room with TV, equipped kitchen and one bathroom."
  },
  {
    title: "1 apartment for 2 guests",
    text: "Ideal for couples. Availability depends on the season: ask us."
  }
];

const practicalInfo = [
  { label: "Check-in", value: `From ${site.checkIn}` },
  { label: "Check-out", value: `Until ${site.checkOut}` },
  {
    label: "Included",
    value: "Bed linen, towels, wifi and free parking"
  },
  {
    label: "Location",
    value: `${site.locality}, 3 km from Cangas de Onís and Covadonga`
  }
];

const planIdeas = [
  {
    day: "Day 1",
    title: "Cangas and local food",
    text: "Walk through town, visit the Roman bridge and enjoy Asturian cuisine."
  },
  {
    day: "Day 2",
    title: "Covadonga Lakes",
    text: "Scenic route in the morning and a relaxed afternoon at the house."
  },
  {
    day: "Day 3",
    title: "Eastern coast",
    text: "Day trip to Ribadesella or Llanes before heading back."
  }
];

export const metadata: Metadata = {
  title: "Rural House in Cangas de Onis | Direct Booking Request",
  description:
    "Rural accommodation in Cangas de Onis, Asturias. Check availability and send your booking request directly."
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description:
    "Rural apartments in Cabielles, Cangas de Onis (Asturias), with direct booking request form.",
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
  url: "https://elportiellu.com/en",
  image: spaceGalleries
    .flatMap((group) => group.images)
    .map((imagePath) => `https://elportiellu.com${imagePath}`)
};

export default function EnglishHomePage() {
  return (
    <main className="site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="topbar reveal">
        <p className="brand">Apartamentos Rurales El Portiellu</p>
        <nav className="menu">
          <a href="#accommodation">Accommodation</a>
          <a href="#gallery">Gallery</a>
          <a href="#plans">Plans</a>
          <a href="#booking">Book</a>
          <a href="/" className="lang-switch">
            ES
          </a>
        </nav>
      </header>

      <section className="hero reveal">
        <figure className="hero-image">
          <Image
            src={heroImage}
            alt="Exterior view of the rural accommodation in Cangas de Onis"
            width={1800}
            height={1200}
            sizes="100vw"
            quality={82}
            priority
          />
        </figure>
        <div className="hero-gradient" />
        <div className="hero-copy">
          <p className="kicker">Cangas de Onis, Asturias</p>
          <h1>Charming rural house to truly disconnect</h1>
          <p>
            Peace, nature and a perfect base to explore Eastern Asturias with 2 to
            7-day getaways.
          </p>
          <div className="hero-actions">
            <a href="#booking" className="cta">
              Check availability
            </a>
            <a href="#gallery" className="ghost">
              View spaces
            </a>
          </div>
        </div>
        <ul className="hero-metrics">
          <li>
            <strong>3 apartments</strong>
            <span>For 2 to 5 guests each</span>
          </li>
          <li>
            <strong>3 km from Cangas</strong>
            <span>And from the Covadonga sanctuary</span>
          </li>
          <li>
            <strong>Direct booking</strong>
            <span>
              Form or phone <a href={site.phoneHref}>+34 {site.phone}</a>
            </span>
          </li>
        </ul>
      </section>

      <section className="section reveal" id="accommodation">
        <div className="section-head">
          <p className="eyebrow">Accommodation</p>
          <h2>What stands out</h2>
          <p>
            Functional, warm and straightforward design. Everything is set up for
            a comfortable stay from day one.
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
            <h3>The apartments</h3>
            {apartments.map((item) => (
              <div key={item.title} className="fact">
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <div className="facts-col">
            <h3>Practical information</h3>
            {practicalInfo.map((item) => (
              <div key={item.label} className="fact">
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal" id="gallery">
        <div className="section-head">
          <p className="eyebrow">Gallery</p>
          <h2>House spaces</h2>
          <p>Photos organized by area to quickly understand the full property.</p>
        </div>
        {spaceGalleries.map((group) => (
          <article className="space-block" key={group.space}>
            <div className="space-head">
              <h3>{group.space}</h3>
              <p>{group.summary}</p>
            </div>
            <LightboxGallery title={group.space} images={group.images} lang="en" />
          </article>
        ))}
      </section>

      <section className="section split reveal" id="plans">
        <div className="stack">
          <p className="eyebrow">Surroundings</p>
          <h2>Suggested plan for your stay</h2>
          <p>
            If you stay only a few days, this sequence helps you see the essentials
            without rushing.
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
          <p className="eyebrow">Booking</p>
          <h3>Check dates with no commitment</h3>
          <p>
            Send your request and we will reply with availability, final price and
            stay conditions.
          </p>
          <a href="#booking" className="cta cta-inline">
            Go to form
          </a>
          <p className="callout-contact">
            Prefer to talk to us? Call{" "}
            <a href={site.phoneHref}>+34 {site.phone}</a> or email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </aside>
      </section>

      <section className="section form-wrap reveal" id="booking">
        <p className="eyebrow">Form</p>
        <h2>Booking request</h2>
        <p>
          Fill in the basic details and we will reply with availability and next
          steps to confirm.
        </p>
        <ReservaForm lang="en" />
      </section>

      <SiteFooter lang="en" />
    </main>
  );
}

