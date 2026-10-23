import type { LooseTranslator } from "@/i18n/loose";
import type { PublicProperty } from "@/lib/api/offers";
import type { Labels } from "@/lib/properties-labels";

// What a property page shows about the property, shared by the agency site and the offer's view.
// `t` is scoped to "site.facts".

/** The key figures, only the ones the agency filled in. */
export function propertyFacts(property: PublicProperty, t: LooseTranslator, number: (value: number) => string) {
  return [
    property.bedrooms != null && {
      label: t("bedrooms"),
      value: number(property.bedrooms),
    },
    property.bathrooms != null && {
      label: t("bathrooms"),
      value: number(property.bathrooms),
    },
    property.areaSqm != null && {
      label: t("area"),
      value: `${number(property.areaSqm)} m²`,
    },
    property.plotArea != null && {
      label: t("plot"),
      value: `${number(property.plotArea)} m²`,
    },
    property.guests && { label: t("guests"), value: property.guests },
    property.constructionYear != null && {
      label: t("year"),
      value: String(property.constructionYear),
    },
  ].filter(Boolean) as { label: string; value: string }[];
}

export function propertyFeatureGroups(property: PublicProperty, t: LooseTranslator, labels: Labels) {
  return [
    {
      title: t("amenities"),
      items: [
        ...new Set([
          ...property.amenities,
          ...property.outdoorAmenities,
          ...property.indoorAmenities,
        ]),
      ].map(labels.amenity),
    },
    { title: t("views"), items: property.view.map(labels.view) },
    {
      title: t("location"),
      items: property.locationFeatures.map(labels.locationFeature),
    },
  ].filter((group) => group.items.length > 0);
}
