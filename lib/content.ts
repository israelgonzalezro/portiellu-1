import { site } from "./site";

export type Lang = "es" | "en";

type ApartmentCopy = {
  tagline: string;
  description: string;
  features: string[];
};

const es = {
  nav: {
    apartments: "Apartamentos",
    surroundings: "Entorno",
    location: "Cómo llegar",
    contact: "Contacto",
    book: "Reservar",
    otherLang: "EN",
    otherLangHref: "/en",
    menu: "Menú",
    close: "Cerrar"
  },
  hero: {
    kicker: "Cabielles · Cangas de Onís · Asturias",
    title: "Apartamentos rurales El Portiellu",
    subtitle:
      "Tres apartamentos con alma de aldea, a 3 km de Cangas de Onís y Covadonga, a las puertas de los Picos de Europa.",
    welcome: "¡Bienveníos!"
  },
  highlights: [
    { icon: "mountain", title: "Picos de Europa", text: "A las puertas del parque nacional" },
    { icon: "church", title: "Covadonga", text: "Santuario a 3 km" },
    { icon: "parking", title: "Aparcamiento", text: "Gratis, junto a los apartamentos" },
    { icon: "wifi", title: "Wifi", text: "En todos los apartamentos" },
    { icon: "linen", title: "Ropa de casa", text: "Sábanas y toallas incluidas" },
    { icon: "key", title: "Reserva directa", text: "Sin comisiones" }
  ],
  apartments: {
    eyebrow: "Nuestros apartamentos",
    title: "Elige tu rincón",
    intro:
      "Tres apartamentos independientes en una casa tradicional de piedra y madera. Cada uno con su cocina equipada, salón y todo lo necesario para sentirte en casa.",
    upTo: (n: number) => `Hasta ${n} personas`,
    from: "Desde",
    perNight: "/noche",
    photos: "Ver fotos",
    book: "Reservar",
    items: {
      "el-portiellu": {
        tagline: "Planta baja · 2 dormitorios",
        description:
          "El apartamento de la planta baja, cómodo y sin escaleras. Dos dormitorios, salón con TV y cocina equipada: perfecto para familias o grupos de amigos. Es el único que admite mascotas.",
        features: ["2 dormitorios", "1 baño", "Hasta 4 personas", "Planta baja", "Cocina equipada", "Wifi", "Admite mascotas (+10 €/noche)"]
      },
      "la-caleya": {
        tagline: "2 dormitorios",
        description:
          "Amplio y luminoso, con dos dormitorios, salón con TV y cocina equipada. Ideal para familias que buscan descansar después de un día de rutas.",
        features: ["2 dormitorios", "1 baño", "Hasta 4 personas", "Cocina equipada", "Wifi", "Sin mascotas"]
      },
      "el-horru": {
        tagline: "1 dormitorio · Para parejas",
        description:
          "Nuestro apartamento más pequeño, pensado para dos. Un refugio tranquilo para una escapada en pareja. Abre según temporada: consulta disponibilidad.",
        features: ["1 dormitorio", "2 personas", "Ideal parejas", "Wifi", "Según temporada", "Sin mascotas"]
      }
    } as Record<string, ApartmentCopy>
  },
  booking: {
    eyebrow: "Reserva directa",
    title: "Consulta disponibilidad",
    intro:
      "Elige tus fechas y te mostramos qué apartamentos están libres. Sin comisiones: te respondemos para confirmar la reserva.",
    checkIn: "Llegada",
    checkOut: "Salida",
    guests: "Huéspedes",
    datesPlaceholder: "Elige fechas",
    search: "Buscar",
    results: "Apartamentos para tus fechas",
    available: "Disponible",
    unavailable: "No disponible en esas fechas",
    tooSmall: (n: number) => `Máximo ${n} personas`,
    total: "Total estancia",
    nights: (n: number) => `${n} noche${n === 1 ? "" : "s"}`,
    select: "Reservar este",
    selected: "Seleccionado",
    pickDatesFirst: "Elige fechas de llegada y salida para ver la disponibilidad.",
    showCalendar: "Ver calendario por apartamento",
    hideCalendar: "Ocultar calendario",
    yourDetails: "Tus datos",
    loading: "Cargando disponibilidad...",
    error: `No se pudo cargar la disponibilidad. Recarga la página o llámanos al ${site.phone}.`,
    priceNote: "Precio orientativo; te confirmamos el precio final al responder.",
    nothingAvailable: "No hay apartamentos libres para esas fechas. Prueba con otras o llámanos.",
    clear: "Cambiar fechas"
  },
  surroundings: {
    eyebrow: "El entorno",
    title: "Qué hacer cerca",
    intro: "Cabielles es el punto de partida perfecto para descubrir el oriente de Asturias.",
    items: [
      { icon: "church", title: "Santuario de Covadonga", text: "La Santina y la Santa Cueva.", distance: "3 km" },
      { icon: "bridge", title: "Cangas de Onís", text: "Puente romano, mercado y sidrerías.", distance: "3 km" },
      { icon: "lake", title: "Lagos de Covadonga", text: "Enol y La Ercina, en pleno Picos.", distance: "35 min" },
      { icon: "boat", title: "Descenso del Sella", text: "En canoa desde Arriondas.", distance: "20 min" },
      { icon: "wave", title: "Ribadesella y Llanes", text: "Playas y pueblos marineros.", distance: "25–35 min" },
      { icon: "hike", title: "Ruta del Cares", text: "La garganta divina, desde Poncebos.", distance: "50 min" }
    ]
  },
  plan: {
    eyebrow: "Plan sugerido",
    title: "Tres días en el oriente asturiano",
    days: [
      { day: "Día 1", title: "Cangas y sidra", text: "Paseo por el centro, el puente romano y cena en una sidrería." },
      { day: "Día 2", title: "Covadonga y los Lagos", text: "Santuario por la mañana y subida a los Lagos." },
      { day: "Día 3", title: "Costa oriental", text: "Ribadesella o Llanes antes de volver a casa." }
    ]
  },
  contact: {
    eyebrow: "Contacto",
    title: "¿Hablamos?",
    text: "Llámanos o escríbenos para cualquier duda. Estaremos encantados de ayudarte a preparar tu escapada.",
    call: "Llamar",
    whatsapp: "WhatsApp",
    whatsappText: "Hola, me gustaría información sobre los apartamentos El Portiellu.",
    write: "Escribir email",
    address: "Dirección",
    checkIn: `Entrada desde las ${site.checkIn}`,
    checkOut: `Salida hasta las ${site.checkOut}`,
    rules: `Estancia mínima de ${site.minNights} noches · Mascotas solo en El Portiellu (+${site.petFee} €/noche)`,
    map: "Ver en Google Maps"
  },
  gallery: {
    surroundings: "Fachada y entorno"
  },
  reviews: {
    eyebrow: "Lo que dicen nuestros huéspedes",
    title: "Opiniones reales",
    intro: "Nuestros huéspedes comparten su experiencia en Google e Instagram. ¡Gracias por recomendarnos!",
    google: "Google",
    googleText: "Opiniones verificadas de huéspedes en Google Maps",
    googleLink: "Ver opiniones",
    instagram: "Instagram",
    instagramText: "Fotos y momentos de nuestros huéspedes",
    instagramLink: "Ver fotos",
    followInstagram: "Síguenos en Instagram",
    writeReview: "Opiniones en Google",
    count: (n: number) => `${n} opiniones`
  },
  loading: "Cargando"
};

const en: typeof es = {
  nav: {
    apartments: "Apartments",
    surroundings: "Surroundings",
    location: "Getting here",
    contact: "Contact",
    book: "Book",
    otherLang: "ES",
    otherLangHref: "/",
    menu: "Menu",
    close: "Close"
  },
  hero: {
    kicker: "Cabielles · Cangas de Onís · Asturias",
    title: "El Portiellu rural apartments",
    subtitle:
      "Three village-style apartments, 3 km from Cangas de Onís and Covadonga, at the gateway to the Picos de Europa.",
    welcome: "Welcome!"
  },
  highlights: [
    { icon: "mountain", title: "Picos de Europa", text: "At the gateway to the national park" },
    { icon: "church", title: "Covadonga", text: "Sanctuary 3 km away" },
    { icon: "parking", title: "Parking", text: "Free, next to the apartments" },
    { icon: "wifi", title: "Wifi", text: "In every apartment" },
    { icon: "linen", title: "Linen", text: "Bed linen and towels included" },
    { icon: "key", title: "Book direct", text: "No booking fees" }
  ],
  apartments: {
    eyebrow: "Our apartments",
    title: "Choose your spot",
    intro:
      "Three self-contained apartments in a traditional stone and timber house. Each one has an equipped kitchen, a living room and everything you need to feel at home.",
    upTo: (n: number) => `Up to ${n} guests`,
    from: "From",
    perNight: "/night",
    photos: "View photos",
    book: "Book",
    items: {
      "el-portiellu": {
        tagline: "Ground floor · 2 bedrooms",
        description:
          "Our ground-floor apartment, comfortable and step-free. Two bedrooms, living room with TV and equipped kitchen: perfect for families or groups of friends. It is the only one that welcomes pets.",
        features: ["2 bedrooms", "1 bathroom", "Up to 4 guests", "Ground floor", "Equipped kitchen", "Wifi", "Pets welcome (+10 €/night)"]
      },
      "la-caleya": {
        tagline: "2 bedrooms",
        description:
          "Spacious and bright, with two bedrooms, living room with TV and equipped kitchen. Ideal for families looking to rest after a day on the trails.",
        features: ["2 bedrooms", "1 bathroom", "Up to 4 guests", "Equipped kitchen", "Wifi", "No pets"]
      },
      "el-horru": {
        tagline: "1 bedroom · For couples",
        description:
          "Our smallest apartment, made for two. A quiet hideaway for a couple's getaway. Open seasonally: check availability.",
        features: ["1 bedroom", "2 guests", "Ideal for couples", "Wifi", "Seasonal", "No pets"]
      }
    }
  },
  booking: {
    eyebrow: "Book direct",
    title: "Check availability",
    intro:
      "Choose your dates and we'll show you which apartments are free. No fees: we reply to confirm your booking.",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    datesPlaceholder: "Choose dates",
    search: "Search",
    results: "Apartments for your dates",
    available: "Available",
    unavailable: "Not available on these dates",
    tooSmall: (n: number) => `Up to ${n} guests`,
    total: "Total stay",
    nights: (n: number) => `${n} night${n === 1 ? "" : "s"}`,
    select: "Book this one",
    selected: "Selected",
    pickDatesFirst: "Choose check-in and check-out dates to see availability.",
    showCalendar: "View calendar by apartment",
    hideCalendar: "Hide calendar",
    yourDetails: "Your details",
    loading: "Loading availability...",
    error: `Availability could not be loaded. Please reload the page or call us on +34 ${site.phone}.`,
    priceNote: "Estimated price; we confirm the final price when we reply.",
    nothingAvailable: "No apartments are free on those dates. Try others or give us a call.",
    clear: "Change dates"
  },
  surroundings: {
    eyebrow: "Surroundings",
    title: "Things to do nearby",
    intro: "Cabielles is the perfect base to discover Eastern Asturias.",
    items: [
      { icon: "church", title: "Covadonga Sanctuary", text: "La Santina and the Holy Cave.", distance: "3 km" },
      { icon: "bridge", title: "Cangas de Onís", text: "Roman bridge, market and cider houses.", distance: "3 km" },
      { icon: "lake", title: "Covadonga Lakes", text: "Enol and La Ercina, in the heart of the Picos.", distance: "35 min" },
      { icon: "boat", title: "Sella river descent", text: "By canoe from Arriondas.", distance: "20 min" },
      { icon: "wave", title: "Ribadesella and Llanes", text: "Beaches and fishing villages.", distance: "25–35 min" },
      { icon: "hike", title: "Cares Trail", text: "The divine gorge, from Poncebos.", distance: "50 min" }
    ]
  },
  plan: {
    eyebrow: "Suggested plan",
    title: "Three days in Eastern Asturias",
    days: [
      { day: "Day 1", title: "Cangas and cider", text: "Stroll through town, the Roman bridge and dinner at a cider house." },
      { day: "Day 2", title: "Covadonga and the Lakes", text: "The sanctuary in the morning and up to the Lakes." },
      { day: "Day 3", title: "Eastern coast", text: "Ribadesella or Llanes before heading home." }
    ]
  },
  contact: {
    eyebrow: "Contact",
    title: "Get in touch",
    text: "Call or email us with any questions. We'll be happy to help you plan your stay.",
    call: "Call",
    whatsapp: "WhatsApp",
    whatsappText: "Hello, I'd like some information about El Portiellu apartments.",
    write: "Send email",
    address: "Address",
    checkIn: `Check-in from ${site.checkIn}`,
    checkOut: `Check-out until ${site.checkOut}`,
    rules: `Minimum stay ${site.minNights} nights · Pets only in El Portiellu (+${site.petFee} €/night)`,
    map: "Open in Google Maps"
  },
  gallery: {
    surroundings: "Facade and surroundings"
  },
  reviews: {
    eyebrow: "What our guests say",
    title: "Real reviews",
    intro: "Our guests share their experience on Google and Instagram. Thank you for recommending us!",
    google: "Google",
    googleText: "Verified guest reviews on Google Maps",
    googleLink: "Read reviews",
    instagram: "Instagram",
    instagramText: "Photos and moments from our guests",
    instagramLink: "View photos",
    followInstagram: "Follow us on Instagram",
    writeReview: "Google reviews",
    count: (n: number) => `${n} reviews`
  },
  loading: "Loading"
};

export const content = { es, en };
export type Content = typeof es;
