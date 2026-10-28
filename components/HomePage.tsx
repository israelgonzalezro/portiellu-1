import Image from "next/image";
import BookApartmentButton from "./BookApartmentButton";
import BookingWidget from "./BookingWidget";
import HeroSearch from "./HeroSearch";
import Icon, { BrandIcon } from "./Icons";
import LightboxGallery from "./LightboxGallery";
import Preloader from "./Preloader";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { apartments } from "../lib/apartments";
import { content, type Lang } from "../lib/content";
import { photos } from "../lib/photos";
import { site } from "../lib/site";

export default function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const isEn = lang === "en";
  const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t.contact.whatsappText)}`;
  const instagramUrl = site.instagram ? `https://www.instagram.com/${site.instagram}/` : "";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: site.name,
    description: t.hero.subtitle,
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
    url: isEn ? `${site.url}/en` : site.url,
    image: [photos.hero, ...Object.values(photos.apartments).flat()].map((src) => `${site.url}${src}`),
    containsPlace: apartments.map((apt) => ({
      "@type": "Accommodation",
      name: apt.name,
      occupancy: { "@type": "QuantitativeValue", maxValue: apt.capacity }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Preloader label={t.loading} />
      <SiteHeader lang={lang} />

      <main>
        {/* Portada */}
        <section className="hero2">
          <Image
            src={photos.hero}
            alt={isEn ? "El Portiellu at dusk, with the traditional granary" : "El Portiellu al anochecer, con el hórreo"}
            fill
            priority
            sizes="100vw"
            className="hero2-img"
          />
          <div className="hero2-shade" />
          <div className="hero2-content">
            <p className="hero2-kicker">
              <span className="rule" /> {t.hero.kicker} <span className="rule" />
            </p>
            <h1>{t.hero.title}</h1>
            <p className="hero2-sub">{t.hero.subtitle}</p>
            <HeroSearch lang={lang} />
          </div>
        </section>

        {/* Ventajas con rombos */}
        <section className="wrap highlights">
          <p className="welcome">{t.hero.welcome}</p>
          <ul className="diamonds">
            {t.highlights.map((item, i) => (
              <li key={item.title}>
                <span className={`diamond tone-${i % 6}`}>
                  <Icon name={item.icon} size={26} />
                </span>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </li>
            ))}
          </ul>
        </section>

        {/* Apartamentos */}
        <section className="wrap section-block" id="apartamentos">
          <header className="section-title">
            <p className="eyebrow">{t.apartments.eyebrow}</p>
            <h2>{t.apartments.title}</h2>
            <HorreoRule />
            <p>{t.apartments.intro}</p>
          </header>

          <div className="apartments">
            {apartments.map((apt, index) => {
              const copy = t.apartments.items[apt.id];
              const images = photos.apartments[apt.id] ?? [];
              return (
                <article key={apt.id} className={`apt${index % 2 ? " flip" : ""}`} id={apt.id}>
                  <div className="apt-media">
                    <LightboxGallery title={apt.name} images={images} lang={lang} />
                  </div>
                  <div className="apt-text">
                    <p className="eyebrow">{copy.tagline}</p>
                    <h3>{apt.name}</h3>
                    <p className="apt-capacity">
                      <Icon name="users" size={18} /> {t.apartments.upTo(apt.capacity)}
                    </p>
                    <p>{copy.description}</p>
                    <ul className="chips">
                      {copy.features.map((feature) => (
                        <li key={feature}>
                          <Icon name="check" size={14} /> {feature}
                        </li>
                      ))}
                    </ul>
                    <BookApartmentButton apt={apt.id} label={`${t.apartments.book} ${apt.name}`} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Reserva */}
        <section className="booking-section" id="reservar">
          <div className="wrap">
            <header className="section-title light">
              <p className="eyebrow">{t.booking.eyebrow}</p>
              <h2>{t.booking.title}</h2>
              <HorreoRule />
              <p>{t.booking.intro}</p>
            </header>
            <div className="booking-card">
              <BookingWidget lang={lang} />
            </div>
          </div>
        </section>

        {/* Entorno */}
        <section className="wrap section-block" id="entorno">
          <header className="section-title">
            <p className="eyebrow">{t.surroundings.eyebrow}</p>
            <h2>{t.surroundings.title}</h2>
            <HorreoRule />
            <p>{t.surroundings.intro}</p>
          </header>
          <div className="places">
            {t.surroundings.items.map((place, i) => (
              <article key={place.title} className="place">
                <span className={`diamond small tone-${i % 6}`}>
                  <Icon name={place.icon} size={22} />
                </span>
                <div>
                  <h3>{place.title}</h3>
                  <p>{place.text}</p>
                </div>
                <span className="place-distance">{place.distance}</span>
              </article>
            ))}
          </div>

          <div className="plan">
            <div className="plan-photo">
              <LightboxGallery title={t.gallery.surroundings} images={photos.surroundings} lang={lang} />
            </div>
            <div className="plan-text">
              <p className="eyebrow">{t.plan.eyebrow}</p>
              <h3>{t.plan.title}</h3>
              <ol>
                {t.plan.days.map((day) => (
                  <li key={day.day}>
                    <span>{day.day}</span>
                    <strong>{day.title}</strong>
                    <p>{day.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Opiniones */}
        <section className="wrap section-block reviews" id="opiniones">
          <header className="section-title">
            <p className="eyebrow">{t.reviews.eyebrow}</p>
            <h2>{t.reviews.title}</h2>
            <HorreoRule />
            <p>{t.reviews.intro}</p>
          </header>
          <div className={`review-cards${instagramUrl ? "" : " single"}`}>
            <a className="review-card" href={site.googleMaps} target="_blank" rel="noopener noreferrer">
              <span className="review-logo google">
                <BrandIcon name="google" size={30} />
              </span>
              <span>
                <strong>{t.reviews.google}</strong>
                <small>{t.reviews.googleText}</small>
                <em>{t.reviews.googleLink} →</em>
              </span>
            </a>
            {instagramUrl ? (
              <a className="review-card" href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <span className="review-logo instagram">
                  <BrandIcon name="instagram" size={28} />
                </span>
                <span>
                  <strong>{t.reviews.instagram}</strong>
                  <small>{t.reviews.instagramText}</small>
                  <b>@{site.instagram}</b>
                  <em>{t.reviews.instagramLink} →</em>
                </span>
              </a>
            ) : null}
          </div>
          <div className="social-buttons">
            {instagramUrl ? (
              <a className="social-btn instagram" href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <BrandIcon name="instagram" size={18} /> {t.reviews.followInstagram}
              </a>
            ) : null}
            <a className="social-btn whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <BrandIcon name="whatsapp" size={18} /> {t.contact.whatsapp}
            </a>
            <a className="social-btn google" href={site.googleMaps} target="_blank" rel="noopener noreferrer">
              <BrandIcon name="google" size={18} /> {t.reviews.writeReview}
            </a>
          </div>
        </section>

        {/* Contacto */}
        <section className="contact-band" id="contacto">
          <div className="wrap contact-grid">
            <div>
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2>{t.contact.title}</h2>
              <p>{t.contact.text}</p>
              <div className="contact-actions">
                <a className="btn btn-gold" href={site.phoneHref}>
                  <Icon name="phone" size={18} /> {t.contact.call} · {site.phone}
                </a>
                <a className="btn btn-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <BrandIcon name="whatsapp" size={18} /> {t.contact.whatsapp}
                </a>
                <a className="btn btn-outline" href={`mailto:${site.email}`}>
                  <Icon name="mail" size={18} /> {t.contact.write}
                </a>
              </div>
            </div>
            <ul className="contact-facts">
              <li>
                <Icon name="pin" />
                <span>
                  <strong>{t.contact.address}</strong>
                  {site.locality}, {site.postalCode} {site.municipality} ({site.region})
                  <a href={site.googleMaps} target="_blank" rel="noopener noreferrer">
                    {t.contact.map}
                  </a>
                </span>
              </li>
              <li>
                <Icon name="clock" />
                <span>
                  <strong>{t.contact.checkIn}</strong>
                  {t.contact.checkOut}
                  <br />
                  {t.contact.rules}
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <div className="wrap">
        <SiteFooter lang={lang} />
      </div>
    </>
  );
}

// Separador decorativo con un pequeño hórreo entre dos líneas.
function HorreoRule() {
  return (
    <span className="horreo-rule" aria-hidden="true">
      <span />
      <svg width="22" height="18" viewBox="0 0 22 18">
        <path d="M11 1 1 8h20Z" fill="currentColor" />
        <rect x="4" y="9" width="14" height="4" fill="currentColor" />
        <path d="M6 13v4M16 13v4M11 13v4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span />
    </span>
  );
}
