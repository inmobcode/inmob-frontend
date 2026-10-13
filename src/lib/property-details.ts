import type { PublicProperty } from "@/lib/api/offers";
import {
  INDOOR_AMENITY_LABELS,
  LOCATION_FEATURE_LABELS,
  OUTDOOR_AMENITY_LABELS,
  VIEW_LABELS,
} from "@/lib/properties-labels";

// What a property page shows about the property, shared by the agency site and the offer's view.

/** The key figures, only the ones the agency filled in. */
export function propertyFacts(property: PublicProperty) {
  const number = (value: number) => value.toLocaleString("es-AR");
  return [
    property.bedrooms != null && {
      label: "Dormitorios",
      value: number(property.bedrooms),
    },
    property.bathrooms != null && {
      label: "Baños",
      value: number(property.bathrooms),
    },
    property.areaSqm != null && {
      label: "Superficie",
      value: `${number(property.areaSqm)} m²`,
    },
    property.plotArea != null && {
      label: "Terreno",
      value: `${number(property.plotArea)} m²`,
    },
    property.guests && { label: "Huéspedes", value: property.guests },
    property.constructionYear != null && {
      label: "Año",
      value: String(property.constructionYear),
    },
  ].filter(Boolean) as { label: string; value: string }[];
}

const AMENITY_LABELS = { ...OUTDOOR_AMENITY_LABELS, ...INDOOR_AMENITY_LABELS };

export function propertyFeatureGroups(property: PublicProperty) {
  const label = (map: Record<string, string>) => (code: string) =>
    map[code] ?? code;
  return [
    {
      title: "Comodidades",
      items: [
        ...new Set([
          ...property.amenities,
          ...property.outdoorAmenities,
          ...property.indoorAmenities,
        ]),
      ].map(label(AMENITY_LABELS)),
    },
    { title: "Vistas", items: property.view.map(label(VIEW_LABELS)) },
    {
      title: "Ubicación",
      items: property.locationFeatures.map(label(LOCATION_FEATURE_LABELS)),
    },
  ].filter((group) => group.items.length > 0);
}
