export type Apartment = {
  id: string;
  name: string;
  nameEn: string;
  capacity: number;
  summary: string;
  summaryEn: string;
  // Variable de entorno con el enlace iCal de exportación de Booking
  icalEnv: string;
};

export const apartments: Apartment[] = [
  {
    id: "apto-1",
    name: "Apartamento 1",
    nameEn: "Apartment 1",
    capacity: 5,
    summary: "2 dormitorios · hasta 5 personas",
    summaryEn: "2 bedrooms · up to 5 guests",
    icalEnv: "BOOKING_ICAL_APTO_1"
  },
  {
    id: "apto-2",
    name: "Apartamento 2",
    nameEn: "Apartment 2",
    capacity: 5,
    summary: "2 dormitorios · hasta 5 personas",
    summaryEn: "2 bedrooms · up to 5 guests",
    icalEnv: "BOOKING_ICAL_APTO_2"
  },
  {
    id: "apto-3",
    name: "Apartamento 3",
    nameEn: "Apartment 3",
    capacity: 2,
    summary: "Para 2 personas",
    summaryEn: "For 2 guests",
    icalEnv: "BOOKING_ICAL_APTO_3"
  }
];

export function findApartment(id: string) {
  return apartments.find((apt) => apt.id === id);
}
