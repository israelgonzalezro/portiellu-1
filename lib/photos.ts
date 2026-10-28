// Fotos de cada apartamento y del entorno.
// PROVISIONAL: repartidas con las fotos que ya había. Cuando estén las carpetas
// public/images/el-portiellu, la-caleya, el-horru y entorno, se cambian aquí.
const img = (name: string) => `/images/optimized/${name}.webp`;

export const photos = {
  hero: img("084CF6D9-8395-4FBA-92C4-5D6A275EE42D"),
  apartments: {
    "el-portiellu": [img("IMG_6209"), img("IMG_9036"), img("IMG_8571"), img("IMG_8847"), img("IMG_8936")],
    "la-caleya": [img("IMG_9045"), img("IMG_8825"), img("IMG_8566"), img("IMG_6234")],
    "el-horru": [img("IMG_8576"), img("IMG_8564"), img("IMG_8783"), img("IMG_8565")]
  } as Record<string, string[]>,
  surroundings: [
    img("084CF6D9-8395-4FBA-92C4-5D6A275EE42D"),
    img("IMG_8717"),
    img("IMG_8582"),
    img("IMG_8544")
  ]
};
