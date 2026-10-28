// Importa las fotos desde una carpeta con subcarpetas por apartamento,
// las comprime a WebP y actualiza lib/photos-manifest.json.
//
// Uso: npm run fotos -- "/Users/<usuario>/Desktop/fotos-elportiellu"
//
// Subcarpetas reconocidas: portada, el-portiellu, la-caleya, el-horru, entorno.
// Las fotos se ordenan por nombre de archivo (pon 01-, 02-... delante para elegir el orden).
// La primera foto de cada apartamento es la principal.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const FOLDERS = ["portada", "el-portiellu", "la-caleya", "el-horru", "entorno"];
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"]);

const root = process.cwd();
const source = path.resolve(process.argv[2] ?? path.join(os.homedir(), "Desktop", "fotos-elportiellu"));
const manifestPath = path.join(root, "lib", "photos-manifest.json");

if (!fs.existsSync(source)) {
  console.error(`No existe la carpeta ${source}`);
  process.exit(1);
}

const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fotos-"));

// sharp no lee HEIC (fotos de iPhone): las pasamos antes a JPG con sips de macOS.
function readable(file) {
  if (![".heic", ".heif"].includes(path.extname(file).toLowerCase())) return file;
  const out = path.join(tmp, `${path.parse(file).name}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", file, "--out", out], { stdio: "ignore" });
  return out;
}

for (const folder of FOLDERS) {
  const dir = path.join(source, folder);
  if (!fs.existsSync(dir)) continue;

  const files = fs
    .readdirSync(dir)
    .filter((name) => EXTENSIONS.has(path.extname(name).toLowerCase()) && !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  if (!files.length) continue;

  const outDir = path.join(root, "public", "images", folder);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const urls = [];
  for (const [index, name] of files.entries()) {
    const outName = `${String(index + 1).padStart(2, "0")}.webp`;
    await sharp(readable(path.join(dir, name)))
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 74, effort: 5 })
      .toFile(path.join(outDir, outName));
    urls.push(`/images/${folder}/${outName}`);
  }

  manifest[folder] = urls;
  console.log(`${folder}: ${urls.length} fotos`);
}

fs.rmSync(tmp, { recursive: true, force: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Listo. Actualizado ${path.relative(root, manifestPath)}`);
