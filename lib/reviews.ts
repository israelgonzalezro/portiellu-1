// Nota de Google Maps (revisada a mano; actualízala de vez en cuando).
export const googleRating = {
  rating: 5.0,
  count: 37,
  checked: "2026-10-28"
};

export type Testimonial = {
  name: string;
  text: string;
  stars: number;
  date?: string;
  lang?: "es" | "en";
};

// Reseñas destacadas que se muestran en la web. Copiadas de Google con el nombre que
// aparece allí. Si está vacío, la sección solo muestra la nota y los enlaces.
export const testimonials: Testimonial[] = [];
