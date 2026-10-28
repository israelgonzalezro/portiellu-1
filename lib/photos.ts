import manifest from "./photos-manifest.json";

// Fotos importadas con `npm run fotos` (lib/photos-manifest.json).
// Mientras una carpeta no tenga fotos propias, se usan las provisionales de abajo.
const imported = manifest as Record<string, string[] | undefined>;
const img = (name: string) => `/images/optimized/${name}.webp`;

function pick(folder: string, fallback: string[]) {
  const list = imported[folder];
  return list && list.length ? list : fallback;
}

export const photos = {
  hero: pick("portada", [img("084CF6D9-8395-4FBA-92C4-5D6A275EE42D")])[0],
  apartments: {
    "el-portiellu": pick("el-portiellu", [img("IMG_6209"), img("IMG_9036"), img("IMG_8571"), img("IMG_8847"), img("IMG_8936")]),
    "la-caleya": pick("la-caleya", [img("IMG_9045"), img("IMG_8825"), img("IMG_8566"), img("IMG_6234")]),
    "el-horru": pick("el-horru", [img("IMG_8576"), img("IMG_8564"), img("IMG_8783"), img("IMG_8565")])
  } as Record<string, string[]>,
  surroundings: pick("entorno", [
    img("084CF6D9-8395-4FBA-92C4-5D6A275EE42D"),
    img("IMG_8717"),
    img("IMG_8582"),
    img("IMG_8544")
  ])
};
