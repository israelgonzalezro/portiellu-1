export type Apartment = {
  id: string;
  name: string;
  nameEn: string;
  capacity: number;
  pets: boolean;
  summary: string;
  summaryEn: string;
  // Variable de entorno con el enlace iCal de exportación de Booking
  icalEnv: string;
};

export const apartments: Apartment[] = [
  {
    id: "el-portiellu",
    name: "El Portiellu",
    nameEn: "El Portiellu",
    capacity: 4,
    pets: true,
    summary: "Planta baja · 2 dormitorios · hasta 4 personas",
    summaryEn: "Ground floor · 2 bedrooms · up to 4 guests",
    icalEnv: "BOOKING_ICAL_EL_PORTIELLU"
  },
  {
    id: "la-caleya",
    name: "La Caleya",
    nameEn: "La Caleya",
    capacity: 4,
    pets: false,
    summary: "2 dormitorios · hasta 4 personas",
    summaryEn: "2 bedrooms · up to 4 guests",
    icalEnv: "BOOKING_ICAL_LA_CALEYA"
  },
  {
    id: "el-horru",
    name: "El Horru",
    nameEn: "El Horru",
    capacity: 2,
    pets: false,
    summary: "1 dormitorio · 2 personas",
    summaryEn: "1 bedroom · 2 guests",
    icalEnv: "BOOKING_ICAL_EL_HORRU"
  }
];

export function findApartment(id: string) {
  return apartments.find((apt) => apt.id === id);
}
