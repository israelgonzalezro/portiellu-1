# El Portiellu · Apartamentos rurales

Web de [elportiellu.com](https://elportiellu.com): tres apartamentos rurales (El Portiellu, La Caleya y El Horru) en Cabielles, Cangas de Onís (Asturias).

Hecha con Next.js y publicada en **Netlify**: cada cambio que se sube a la rama `main` de GitHub se publica solo en un par de minutos.

## Qué incluye

- Portada con buscador de fechas, sección por apartamento, entorno y contacto (español e inglés).
- Calendario de disponibilidad sincronizado con **Booking** por iCal.
- Solicitudes de reserva guardadas en Netlify (Blobs) con aviso por email (Resend).
- Panel privado en `/admin`: aceptar o rechazar solicitudes, bloquear fechas y poner precios por noche.
- Calendarios iCal de la web para que Booking los importe: `/api/ical/el-portiellu.ics`, `/la-caleya.ics`, `/el-horru.ics`.

## Ajustes en Netlify (variables de entorno)

| Variable | Para qué |
|---|---|
| `BOOKING_ICAL_EL_PORTIELLU`, `BOOKING_ICAL_LA_CALEYA`, `BOOKING_ICAL_EL_HORRU` | Enlaces de exportación iCal de Booking |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin` |
| `RESEND_API_KEY` | Envío de los emails de aviso |
| `RESERVAS_EMAIL` (opcional) | Email que recibe los avisos (por defecto apartamentoselportiellu@gmail.com) |

En local se ponen en `.env.local` (no se sube a GitHub).

## Ejecutar en local

```bash
npm install
npm run dev
```

## Añadir fotos

Prepara una carpeta con estas subcarpetas (las que tengas): `portada`, `el-portiellu`, `la-caleya`, `el-horru`, `entorno`. Las fotos se ordenan por nombre (pon `01-`, `02-`… delante); la primera de cada apartamento es la principal. Valen JPG, PNG y HEIC del iPhone.

```bash
npm run fotos -- "/ruta/a/fotos-elportiellu"
```

Comprime las fotos en `public/images/<carpeta>/` y actualiza `lib/photos-manifest.json`.
