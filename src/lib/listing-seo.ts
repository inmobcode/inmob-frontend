import type { PublicProperty } from "@/lib/api/offers";
import { compact } from "@/components/seo/json-ld";
import { coverPhoto, placeOf } from "@/components/public/property-card";
import { CATEGORY_LABELS, LISTING_TYPE_LABELS, categoryLabel } from "@/lib/properties-labels";

/** Roughly what Google and WhatsApp show before cutting a description off. */
const DESCRIPTION_LIMIT = 165;

function clamp(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= DESCRIPTION_LIMIT) return clean;
  // Cut on a word, not mid-word.
  return `${clean.slice(0, DESCRIPTION_LIMIT - 1).replace(/[\s,;.]+\S*$/, "")}…`;
}

/**
 * What a listing says when it is shared or shows up in results: the agency's
 * own summary when it wrote one, otherwise the facts it did fill in — never an
 * empty "Casa en venta." for a listing that has bedrooms, size and a price.
 */
export function listingDescription(property: PublicProperty) {
  if (property.content?.summary) return clamp(property.content.summary);

  const place = placeOf(property);
  const operation = LISTING_TYPE_LABELS[property.listingType].toLowerCase();
  const opening = [`${categoryLabel(property.category)} en ${operation}`, place].filter(Boolean).join(" en ");

  const facts = [
    property.bedrooms != null && `${property.bedrooms} dorm.`,
    property.bathrooms != null && `${property.bathrooms} ${property.bathrooms === 1 ? "baño" : "baños"}`,
    property.areaSqm != null && `${property.areaSqm.toLocaleString("es-AR")} m²`,
    property.guests && `${property.guests} huéspedes`,
  ].filter(Boolean) as string[];

  const price =
    property.price != null
      ? `${property.currency} ${property.price.toLocaleString("es-AR")}${
          property.listingType === "RENT" ? " por noche" : ""
        }`
      : null;

  const sentences = [opening, facts.join(" · "), price].filter(Boolean);
  return clamp(`${sentences.join(". ")}.`);
}

/**
 * The photos a share card can use, cover first. Dimensions are left out on
 * purpose: the records don't store them, and a wrong `og:image:width` is worse
 * than none — the platforms read the real size off the file.
 */
export function listingImages(property: PublicProperty) {
  const cover = coverPhoto(property);
  if (!cover) return undefined;
  const rest = property.photos.filter((photo) => photo.url !== cover.url).slice(0, 3);
  return [cover, ...rest].map((photo) => ({ url: photo.url, alt: property.title }));
}

const SCHEMA_TYPES: Record<string, string> = {
  HOUSE: "SingleFamilyResidence",
  TOWNHOUSE: "SingleFamilyResidence",
  CHALET: "SingleFamilyResidence",
  DETACHED_VILLA: "SingleFamilyResidence",
  VILLA: "House",
  SEMI_DETACHED_VILLA: "House",
  APARTMENT: "Apartment",
  PENTHOUSE: "Apartment",
  CONDO: "Apartment",
  MAISONETTE: "Apartment",
  BUILDING: "ApartmentComplex",
  HOTEL: "Hotel",
  LAND: "Place",
  COMMERCIAL: "LocalBusiness",
  OFFICE: "Place",
};

/** schema.org's closest match for what is being listed; `Residence` covers the rest. */
function schemaType(category: string) {
  return SCHEMA_TYPES[category] ?? "Residence";
}

/**
 * schema.org/RealEstateListing: lets a listing show up as a result with its
 * price, place and photos instead of a bare link. Only fields the agency
 * actually filled in are sent.
 */
export function listingJsonLd({
  property,
  agency,
  url,
  description,
}: {
  property: PublicProperty;
  agency: { name: string; url: string };
  url: string;
  description: string;
}) {
  const place = placeOf(property);
  const address = compact({
    "@type": "PostalAddress",
    streetAddress: property.address,
    addressLocality: property.area,
    addressRegion: property.region,
    addressCountry: property.country,
  });

  return compact({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    url,
    description,
    image: property.photos.map((photo) => photo.url).slice(0, 6),
    about: compact({
      "@type": schemaType(property.category),
      name: property.title,
      additionalType: CATEGORY_LABELS[property.category] ? undefined : property.category,
      numberOfBedrooms: property.bedrooms ?? undefined,
      numberOfBathroomsTotal: property.bathrooms ?? undefined,
      floorSize:
        property.areaSqm != null
          ? { "@type": "QuantitativeValue", value: property.areaSqm, unitCode: "MTK" }
          : undefined,
      yearBuilt: property.constructionYear ?? undefined,
      address: Object.keys(address).length > 1 ? address : undefined,
      geo:
        property.lat != null && property.lng != null
          ? { "@type": "GeoCoordinates", latitude: property.lat, longitude: property.lng }
          : undefined,
      amenityFeature: property.amenities.length
        ? property.amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true }))
        : undefined,
    }),
    // Rentals are priced per night, sales as a total: say which, so the number isn't read as the wrong thing.
    offers:
      property.price != null
        ? compact({
            "@type": "Offer",
            price: property.price,
            priceCurrency: property.currency,
            availability: "https://schema.org/InStock",
            businessFunction:
              property.listingType === "RENT"
                ? "http://purl.org/goodrelations/v1#LeaseOut"
                : "http://purl.org/goodrelations/v1#Sell",
            unitCode: property.listingType === "RENT" ? "DAY" : undefined,
            seller: { "@type": "RealEstateAgent", name: agency.name, url: agency.url },
          })
        : undefined,
    areaServed: place || undefined,
    provider: { "@type": "RealEstateAgent", name: agency.name, url: agency.url },
  });
}

/** The trail search engines print under a result: agency → listing. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
