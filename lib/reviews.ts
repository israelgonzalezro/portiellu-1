// Nota de Google Maps (revisada a mano; actualízala de vez en cuando).
export const googleRating = {
  rating: 5.0,
  count: 37,
  checked: "2026-10-28"
};

export type Testimonial = {
  name: string;
  stars: number;
  // Enlace a la reseña original en Google
  url: string;
  // Texto opcional: se muestra entre comillas si se rellena
  text?: string;
};

// Reseñas destacadas. Si está vacío, la sección solo muestra la nota y los enlaces.
export const testimonials: Testimonial[] = [];
