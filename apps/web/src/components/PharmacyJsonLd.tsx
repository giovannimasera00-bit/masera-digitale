import { farmacia, farmaciaHours, type WeekDay } from "@masera/core";

const SCHEMA_DAY: Record<WeekDay, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
};

/** Dati strutturati per Google (Pharmacy): indirizzo, coordinate, orari. Tutto da data/farmacia.json. */
export function PharmacyJsonLd({ url }: { url: string }) {
  const a = farmacia.address;
  const data = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    name: farmacia.name,
    legalName: farmacia.legal_name,
    slogan: farmacia.claims[0],
    url,
    telephone: farmacia.whatsapp.replace(/\s/g, ""),
    address: { "@type": "PostalAddress", streetAddress: a.street, postalCode: a.zip, addressLocality: a.city, addressRegion: a.province, addressCountry: a.country },
    geo: { "@type": "GeoCoordinates", latitude: farmacia.geo.lat, longitude: farmacia.geo.lng },
    openingHoursSpecification: (Object.keys(farmaciaHours) as WeekDay[]).flatMap((d) =>
      farmaciaHours[d].map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: SCHEMA_DAY[d], opens, closes })),
    ),
    sameAs: farmacia.instagram.map((h) => `https://www.instagram.com/${h.replace("@", "")}/`),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
