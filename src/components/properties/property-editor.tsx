"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  Compass,
  DoorOpen,
  FileText,
  Images,
  Lightbulb,
  ListChecks,
  MapPin,
  Percent,
  Settings,
  User,
  Waves,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SectionNavbar } from "@/components/properties/editor-shell";
import { BasicTab } from "@/components/properties/basic-tab";
import { AvailabilityTab } from "@/components/properties/availability-tab";
import { CheckboxGroup } from "@/components/properties/checkbox-group";
import { EssentialsTab } from "@/components/properties/essentials-tab";
import { ExperiencesTab } from "@/components/properties/experiences-tab";
import { OwnerTab } from "@/components/properties/owner-tab";
import { PhotosTab } from "@/components/properties/photos-tab";
import { PoolsTab } from "@/components/properties/pools-tab";
import { RatesTab } from "@/components/properties/rates-tab";
import { RecommendationsTab } from "@/components/properties/recommendations-tab";
import { RoomsTab } from "@/components/properties/rooms-tab";
import { VillaPageTab } from "@/components/properties/villa-page-tab";
import { ApiError } from "@/lib/api/client";
import {
  getProperty,
  publishProperty,
  updateProperty,
  type Property,
  type UpdatePropertyPayload,
} from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media } from "@/lib/motion";
import { useActionBarStore } from "@/lib/store/action-bar-store";
import {
  INCLUDED_SERVICES,
  INDOOR_AMENITIES,
  LOCATION_FEATURES,
  OUTDOOR_AMENITIES,
  PROPERTY_STATUS_RENT,
  PROPERTY_STATUS_SALE,
  VIEW_OPTIONS,
} from "@/lib/property-catalogs";

const schema = z.object({
  title: z.string().min(2, "Ingresá un título"),
  listingType: z.enum(["SALE", "RENT"]),
  category: z.string().min(1, "Elegí una categoría"),
  price: z.string(),
  currency: z.string(),
  bedrooms: z.string(),
  bathrooms: z.string(),
  areaSqm: z.string(),
  amenitiesText: z.string(),
  ownerId: z.string(),

  agentFriendlyName: z.string(),
  visibleLocation: z.string(),
  guests: z.string(),
  stars: z.string(),
  plotArea: z.string(),
  staffRoom: z.string(),
  floorNumbersText: z.string(),
  parkingSpaces: z.string(),
  storageSpaces: z.string(),
  constructionYear: z.string(),
  renovationYear: z.string(),
  energyCertificate: z.string(),
  locationCategory: z.string(),

  country: z.string(),
  region: z.string(),
  area: z.string(),
  address: z.string(),
  lat: z.string(),
  lng: z.string(),
  googleMapUrl: z.string(),
  brochureUrl: z.string(),
  websiteUrl: z.string(),
  locationFeatures: z.array(z.string()),
  view: z.array(z.string()),

  outdoorAmenities: z.array(z.string()),
  indoorAmenities: z.array(z.string()),
  customFacilitiesText: z.string(),
  propertyStatus: z.array(z.string()),
  enjoy: z.string(),
  outdoorShower: z.string(),
  masterBedroomQty: z.string(),
  doubleBedroomQty: z.string(),
  twinBedroomQty: z.string(),
  singleBedroomQty: z.string(),
  bedroomWithBunkBedsQty: z.string(),
  guestBedroomQty: z.string(),

  layoutKitchensCount: z.string(),
  layoutKitchensDescription: z.string(),
  layoutLivingRoomsCount: z.string(),
  layoutLivingRoomsDescription: z.string(),
  layoutGuestWCCount: z.string(),
  layoutGuestWCDescription: z.string(),
  layoutStaffQuartersCount: z.string(),
  layoutStaffQuartersDescription: z.string(),
  layoutGardenAvailable: z.boolean(),
  layoutGardenDescription: z.string(),
  layoutStorageAvailable: z.boolean(),
  layoutStorageDescription: z.string(),

  summary: z.string(),
  description: z.string(),
  extraInfo: z.string(),
  includedServices: z.array(z.string()),
  additionalNotes: z.string(),
  ourNote: z.string(),
});

export type FormValues = z.infer<typeof schema>;

interface TabDef {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabGroup {
  label: string;
  tabs: TabDef[];
}

function buildGroups(listingType: "SALE" | "RENT", category: string): TabGroup[] {
  const general: TabGroup = {
    label: "Información general",
    tabs: [
      { value: "basico", label: "Básico", icon: Building2 },
      { value: "ubicacion", label: "Ubicación", icon: MapPin },
      { value: "amenities", label: "Amenities & Facilities", icon: ListChecks },
      { value: "content", label: "Content & Services", icon: FileText },
      { value: "precios", label: "Precios", icon: Percent },
    ],
  };
  const media: TabGroup = {
    label: "Multimedia",
    tabs: [{ value: "fotos", label: "Fotos", icon: Images }],
  };
  const management: TabGroup = {
    label: "Gestión",
    tabs: [
      { value: "essentials", label: "Essentials", icon: Settings },
      { value: "recomendaciones", label: "Recomendaciones", icon: Lightbulb },
    ],
  };
  const contact: TabGroup = {
    label: "Contacto",
    tabs: [{ value: "propietario", label: "Propietario", icon: User }],
  };

  if (listingType === "RENT") {
    const rental: TabGroup = {
      label: "Alquiler",
      tabs: [
        { value: "disponibilidad", label: "Disponibilidad", icon: Calendar },
        { value: "villa-page", label: "Villa Page", icon: Waves },
        { value: "experiences", label: "Experiences", icon: Compass },
        { value: "rates", label: "Rates", icon: Percent },
      ],
    };
    if (category === "HOTEL") {
      management.tabs.push({ value: "rooms", label: "Rooms", icon: DoorOpen });
    }
    return [general, media, rental, management, contact];
  }

  return [general, media, management, contact];
}

function findTabMeta(groups: TabGroup[], value: string): TabDef | undefined {
  for (const group of groups) {
    const tab = group.tabs.find((t) => t.value === value);
    if (tab) return tab;
  }
  return undefined;
}

function toFormValues(property: Property): FormValues {
  const c = property.classification;
  const d = property.content;
  const layout = c?.layoutAndLivingSpaces;
  return {
    title: property.title,
    listingType: property.listingType,
    category: property.category,
    price: property.price?.toString() ?? "",
    currency: property.currency,
    bedrooms: property.bedrooms?.toString() ?? "",
    bathrooms: property.bathrooms?.toString() ?? "",
    areaSqm: property.areaSqm?.toString() ?? "",
    amenitiesText: property.amenities.join(", "),
    ownerId: property.ownerId ?? "",

    agentFriendlyName: property.agentFriendlyName ?? "",
    visibleLocation: property.visibleLocation ?? "",
    guests: property.guests ?? "",
    stars: property.stars?.toString() ?? "",
    plotArea: property.plotArea?.toString() ?? "",
    staffRoom: c?.staffRoom?.toString() ?? "",
    floorNumbersText: (c?.floorNumbers ?? []).join(", "),
    parkingSpaces: c?.parkingSpaces?.toString() ?? "",
    storageSpaces: c?.storageSpaces?.toString() ?? "",
    constructionYear: property.constructionYear?.toString() ?? "",
    renovationYear: property.renovationYear?.toString() ?? "",
    energyCertificate: property.energyCertificate ?? "",
    locationCategory: c?.locationCategory ?? "",

    country: property.country ?? "",
    region: property.region ?? "",
    area: property.area ?? "",
    address: property.address ?? "",
    lat: property.lat?.toString() ?? "",
    lng: property.lng?.toString() ?? "",
    googleMapUrl: property.googleMapUrl ?? "",
    brochureUrl: property.brochureUrl ?? "",
    websiteUrl: property.websiteUrl ?? "",
    locationFeatures: property.locationFeatures ?? [],
    view: property.view ?? [],

    outdoorAmenities: property.outdoorAmenities ?? [],
    indoorAmenities: property.indoorAmenities ?? [],
    customFacilitiesText: (property.customFacilities ?? []).join(", "),
    propertyStatus: property.propertyStatus ?? [],
    enjoy: property.enjoy ?? "",
    outdoorShower: property.outdoorShower?.toString() ?? "",
    masterBedroomQty: c?.masterBedroomQty?.toString() ?? "",
    doubleBedroomQty: c?.doubleBedroomQty?.toString() ?? "",
    twinBedroomQty: c?.twinBedroomQty?.toString() ?? "",
    singleBedroomQty: c?.singleBedroomQty?.toString() ?? "",
    bedroomWithBunkBedsQty: c?.bedroomWithBunkBedsQty?.toString() ?? "",
    guestBedroomQty: c?.guestBedroomQty?.toString() ?? "",

    layoutKitchensCount: layout?.kitchens?.count?.toString() ?? "",
    layoutKitchensDescription: layout?.kitchens?.description ?? "",
    layoutLivingRoomsCount: layout?.livingRooms?.count?.toString() ?? "",
    layoutLivingRoomsDescription: layout?.livingRooms?.description ?? "",
    layoutGuestWCCount: layout?.guestWC?.count?.toString() ?? "",
    layoutGuestWCDescription: layout?.guestWC?.description ?? "",
    layoutStaffQuartersCount: layout?.staffQuarters?.count?.toString() ?? "",
    layoutStaffQuartersDescription: layout?.staffQuarters?.description ?? "",
    layoutGardenAvailable: layout?.garden?.available ?? false,
    layoutGardenDescription: layout?.garden?.description ?? "",
    layoutStorageAvailable: layout?.storage?.available ?? false,
    layoutStorageDescription: layout?.storage?.description ?? "",

    summary: d?.summary ?? "",
    description: d?.description ?? "",
    extraInfo: d?.extraInfo ?? "",
    includedServices: d?.includedServices ?? [],
    additionalNotes: d?.additionalNotes ?? "",
    ourNote: d?.ourNote ?? "",
  };
}

function toNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toIntList(value: string): number[] {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((n) => !Number.isNaN(n));
}

function toStringList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toPayload(values: FormValues): UpdatePropertyPayload {
  return {
    title: values.title,
    listingType: values.listingType,
    category: values.category,
    price: toNumber(values.price),
    currency: values.currency || "USD",
    bedrooms: toNumber(values.bedrooms),
    bathrooms: toNumber(values.bathrooms),
    areaSqm: toNumber(values.areaSqm),
    amenities: toStringList(values.amenitiesText),
    ...(values.ownerId ? { ownerId: values.ownerId } : {}),

    agentFriendlyName: values.agentFriendlyName || undefined,
    visibleLocation: values.visibleLocation || undefined,
    guests: values.guests || undefined,
    stars: toNumber(values.stars),
    plotArea: toNumber(values.plotArea),
    constructionYear: toNumber(values.constructionYear),
    renovationYear: toNumber(values.renovationYear),
    energyCertificate: values.energyCertificate || undefined,

    country: values.country || undefined,
    region: values.region || undefined,
    area: values.area || undefined,
    address: values.address || undefined,
    lat: toNumber(values.lat),
    lng: toNumber(values.lng),
    googleMapUrl: values.googleMapUrl || undefined,
    brochureUrl: values.brochureUrl || undefined,
    websiteUrl: values.websiteUrl || undefined,
    locationFeatures: values.locationFeatures,
    view: values.view,

    outdoorAmenities: values.outdoorAmenities,
    indoorAmenities: values.indoorAmenities,
    customFacilities: toStringList(values.customFacilitiesText),
    propertyStatus: values.propertyStatus,
    enjoy: values.enjoy || undefined,
    outdoorShower: toNumber(values.outdoorShower),

    classification: {
      staffRoom: toNumber(values.staffRoom),
      floorNumbers: toIntList(values.floorNumbersText),
      parkingSpaces: toNumber(values.parkingSpaces),
      storageSpaces: toNumber(values.storageSpaces),
      locationCategory: values.locationCategory || undefined,
      masterBedroomQty: toNumber(values.masterBedroomQty),
      doubleBedroomQty: toNumber(values.doubleBedroomQty),
      twinBedroomQty: toNumber(values.twinBedroomQty),
      singleBedroomQty: toNumber(values.singleBedroomQty),
      bedroomWithBunkBedsQty: toNumber(values.bedroomWithBunkBedsQty),
      guestBedroomQty: toNumber(values.guestBedroomQty),
      layoutAndLivingSpaces: {
        kitchens: {
          count: toNumber(values.layoutKitchensCount),
          description: values.layoutKitchensDescription || undefined,
        },
        livingRooms: {
          count: toNumber(values.layoutLivingRoomsCount),
          description: values.layoutLivingRoomsDescription || undefined,
        },
        guestWC: {
          count: toNumber(values.layoutGuestWCCount),
          description: values.layoutGuestWCDescription || undefined,
        },
        staffQuarters: {
          count: toNumber(values.layoutStaffQuartersCount),
          description: values.layoutStaffQuartersDescription || undefined,
        },
        garden: {
          available: values.layoutGardenAvailable,
          description: values.layoutGardenDescription || undefined,
        },
        storage: {
          available: values.layoutStorageAvailable,
          description: values.layoutStorageDescription || undefined,
        },
      },
    },
    content: {
      summary: values.summary || undefined,
      description: values.description || undefined,
      extraInfo: values.extraInfo || undefined,
      includedServices: values.includedServices,
      additionalNotes: values.additionalNotes || undefined,
      ourNote: values.ourNote || undefined,
    },
  };
}

export function PropertyEditor({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "basico";
  const queryClient = useQueryClient();
  const setActions = useActionBarStore((state) => state.setActions);
  const resetActions = useActionBarStore((state) => state.reset);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return getProperty(token, propertyId);
    },
  });

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const listingType = useWatch({ control: form.control, name: "listingType" });
  const category = useWatch({ control: form.control, name: "category" });
  const isDirty = form.formState.isDirty;

  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  if (property && property.updatedAt !== syncedAt) {
    setSyncedAt(property.updatedAt);
    form.reset(toFormValues(property));
  }

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateProperty(token, propertyId, toPayload(values));
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["property", propertyId], updated);
      toast.success("Cambios guardados");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar"),
  });

  const publishMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      await updateProperty(token, propertyId, toPayload(values));
      return publishProperty(token, propertyId);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["property", propertyId], updated);
      toast.success("Propiedad publicada");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo publicar"),
  });

  useEffect(() => {
    const navGroups = property ? buildGroups(property.listingType, property.category) : [];
    setActions({
      title: findTabMeta(navGroups, activeTab)?.label ?? "Propiedad",
      navigation: property ? (
        <SectionNavbar groups={navGroups} active={activeTab} onChange={setTab} />
      ) : null,
      isSubmitting: saveMutation.isPending || publishMutation.isPending,
      isDirty,
      canSubmit: true,
      onSave: form.handleSubmit((values) => saveMutation.mutate(values)),
      onPublish: form.handleSubmit((values) => publishMutation.mutate(values)),
      onCancel: () => router.push("/properties"),
    });
    return resetActions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property, activeTab, isDirty, saveMutation.isPending, publishMutation.isPending]);

  const contentRef = useRef<HTMLDivElement>(null);
  const shownTab = useRef(activeTab);

  // The section content eases in whenever you switch sections.
  useGSAP(
    () => {
      // Only animate when the section actually changed (not on mount or Strict Mode re-runs).
      if (shownTab.current === activeTab) return;
      shownTab.current = activeTab;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(contentRef.current, { opacity: 0, y: distance.sm, duration: duration.base, ease: ease.out });
      });
      return () => mm.revert();
    },
    { dependencies: [activeTab] },
  );

  if (isLoading || !property) {
    return (
      <div className="flex animate-pulse flex-col gap-8">
        <div className="flex items-center gap-5">
          <div className="size-24 rounded-2xl bg-secondary" />
          <div className="flex flex-1 flex-col gap-3">
            <div className="h-3 w-28 rounded-full bg-muted" />
            <div className="h-8 w-2/3 rounded-full bg-muted" />
            <div className="h-4 w-1/2 rounded-full bg-muted" />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="hidden h-96 w-56 rounded-2xl bg-muted md:block" />
          <div className="h-96 flex-1 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  function setTab(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`/properties/${propertyId}?${params.toString()}`);
  }

  const propertyStatusOptions = listingType === "RENT" ? PROPERTY_STATUS_RENT : PROPERTY_STATUS_SALE;
  const isRent = listingType === "RENT";
  const groups = buildGroups(listingType, category);
  const activeMeta = findTabMeta(groups, activeTab);

  return (
    <div className="flex flex-col gap-8">
      <Tabs value={activeTab} onValueChange={setTab} className="flex flex-col gap-6">
        <Card ref={contentRef} className="min-w-0 flex-1">
          <CardHeader>
            <CardTitle className="font-display text-2xl leading-tight">
              {activeMeta?.label ?? "Propiedad"}
            </CardTitle>
            <CardDescription>{TAB_DESCRIPTIONS[activeTab]}</CardDescription>
          </CardHeader>
        <CardContent>
          <TabsContent value="basico" className="mt-0">
            <BasicTab form={form} property={property} />
          </TabsContent>

          <TabsContent value="ubicacion" className="mt-0 max-w-xl space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="visibleLocation">Ubicación visible</FieldLabel>
                <Input id="visibleLocation" {...form.register("visibleLocation")} />
                <FieldDescription>
                  Cómo se muestra la ubicación a tus clientes, por ejemplo «La Barra, Punta del Este».
                </FieldDescription>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="country">País</FieldLabel>
                  <Input id="country" {...form.register("country")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="region">Región</FieldLabel>
                  <Input id="region" {...form.register("region")} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="area">Zona</FieldLabel>
                  <Input id="area" {...form.register("area")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="address">Dirección</FieldLabel>
                  <Input id="address" {...form.register("address")} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="lat">Latitud</FieldLabel>
                  <Input id="lat" {...form.register("lat")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lng">Longitud</FieldLabel>
                  <Input id="lng" {...form.register("lng")} />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="googleMapUrl">Link de Google Maps</FieldLabel>
                <Input id="googleMapUrl" {...form.register("googleMapUrl")} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="brochureUrl">Link de folleto (PDF)</FieldLabel>
                  <Input id="brochureUrl" {...form.register("brochureUrl")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="websiteUrl">Link de sitio web</FieldLabel>
                  <Input id="websiteUrl" {...form.register("websiteUrl")} />
                </Field>
              </div>
              <Field>
                <FieldLabel>Location Features</FieldLabel>
                <Controller
                  control={form.control}
                  name="locationFeatures"
                  render={({ field }) => (
                    <CheckboxGroup options={LOCATION_FEATURES} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field>
                <FieldLabel>View</FieldLabel>
                <Controller
                  control={form.control}
                  name="view"
                  render={({ field }) => (
                    <CheckboxGroup options={VIEW_OPTIONS} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
            </FieldGroup>

            {!isRent && (
              <div>
                <Separator className="mb-4" />
                <h3 className="mb-3 text-sm font-medium">Pools & Jacuzzis</h3>
                <PoolsTab propertyId={property.id} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="amenities" className="mt-0 max-w-xl space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel>Outdoor Amenities</FieldLabel>
                <Controller
                  control={form.control}
                  name="outdoorAmenities"
                  render={({ field }) => (
                    <CheckboxGroup options={OUTDOOR_AMENITIES} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field>
                <FieldLabel>Indoor Amenities (Luxury Facilities)</FieldLabel>
                <Controller
                  control={form.control}
                  name="indoorAmenities"
                  render={({ field }) => (
                    <CheckboxGroup options={INDOOR_AMENITIES} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              {isRent && (
                <Field>
                  <FieldLabel htmlFor="customFacilitiesText">
                    Custom Facilities (separadas por coma)
                  </FieldLabel>
                  <Input id="customFacilitiesText" {...form.register("customFacilitiesText")} />
                </Field>
              )}
              <Field>
                <FieldLabel>Property Status {isRent ? "" : "(Condition)"}</FieldLabel>
                <Controller
                  control={form.control}
                  name="propertyStatus"
                  render={({ field }) => (
                    <CheckboxGroup
                      options={propertyStatusOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>
            </FieldGroup>

            {isRent && (
              <div>
                <Separator className="mb-4" />
                <h4 className="mb-2 text-sm font-medium">Accommodation</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Field>
                    <FieldLabel htmlFor="masterBedroomQty">Master</FieldLabel>
                    <Input id="masterBedroomQty" inputMode="numeric" {...form.register("masterBedroomQty")} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="doubleBedroomQty">Doble</FieldLabel>
                    <Input id="doubleBedroomQty" inputMode="numeric" {...form.register("doubleBedroomQty")} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="twinBedroomQty">Twin</FieldLabel>
                    <Input id="twinBedroomQty" inputMode="numeric" {...form.register("twinBedroomQty")} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="singleBedroomQty">Single</FieldLabel>
                    <Input id="singleBedroomQty" inputMode="numeric" {...form.register("singleBedroomQty")} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="bedroomWithBunkBedsQty">Cuchetas</FieldLabel>
                    <Input
                      id="bedroomWithBunkBedsQty"
                      inputMode="numeric"
                      {...form.register("bedroomWithBunkBedsQty")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="guestBedroomQty">Guest</FieldLabel>
                    <Input id="guestBedroomQty" inputMode="numeric" {...form.register("guestBedroomQty")} />
                  </Field>
                </div>
              </div>
            )}

            {!isRent && (
              <div>
                <Separator className="mb-4" />
                <h4 className="mb-2 text-sm font-medium">Layout & Living Spaces</h4>
                <div className="space-y-3">
                  {(
                    [
                      ["layoutKitchensCount", "layoutKitchensDescription", "Cocinas"],
                      ["layoutLivingRoomsCount", "layoutLivingRoomsDescription", "Livings"],
                      ["layoutGuestWCCount", "layoutGuestWCDescription", "Toilette de huéspedes"],
                      ["layoutStaffQuartersCount", "layoutStaffQuartersDescription", "Cuartos de servicio"],
                    ] as const
                  ).map(([countField, descField, label]) => (
                    <div key={countField} className="grid grid-cols-[80px_1fr] gap-2">
                      <Field>
                        <FieldLabel htmlFor={countField}>{label}</FieldLabel>
                        <Input id={countField} inputMode="numeric" {...form.register(countField)} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={descField}>Descripción</FieldLabel>
                        <Input id={descField} {...form.register(descField)} />
                      </Field>
                    </div>
                  ))}
                  <div className="grid grid-cols-[80px_1fr] items-end gap-2">
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="layoutGardenAvailable">Jardín</FieldLabel>
                      <Controller
                        control={form.control}
                        name="layoutGardenAvailable"
                        render={({ field }) => (
                          <Switch
                            id="layoutGardenAvailable"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="layoutGardenDescription">Descripción</FieldLabel>
                      <Input id="layoutGardenDescription" {...form.register("layoutGardenDescription")} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] items-end gap-2">
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="layoutStorageAvailable">Storage</FieldLabel>
                      <Controller
                        control={form.control}
                        name="layoutStorageAvailable"
                        render={({ field }) => (
                          <Switch
                            id="layoutStorageAvailable"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="layoutStorageDescription">Descripción</FieldLabel>
                      <Input id="layoutStorageDescription" {...form.register("layoutStorageDescription")} />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Separator className="mb-4" />
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="amenitiesText">Amenities generales (separados por coma)</FieldLabel>
                  <Input id="amenitiesText" {...form.register("amenitiesText")} />
                  <p className="text-xs text-zinc-500">
                    Es lo único de esta pestaña que hoy se muestra en el portal público.
                  </p>
                </Field>
                <Field>
                  <FieldLabel htmlFor="enjoy">Enjoy</FieldLabel>
                  <Textarea id="enjoy" rows={4} {...form.register("enjoy")} />
                </Field>
                {!isRent && (
                  <Field>
                    <FieldLabel htmlFor="outdoorShower">Duchas exteriores</FieldLabel>
                    <Input id="outdoorShower" inputMode="numeric" {...form.register("outdoorShower")} />
                  </Field>
                )}
              </FieldGroup>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-0 max-w-xl space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="summary">Resumen (bajada corta)</FieldLabel>
                <Textarea id="summary" rows={3} {...form.register("summary")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Descripción detallada</FieldLabel>
                <Textarea id="description" rows={6} {...form.register("description")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="ourNote">Nota del agente</FieldLabel>
                <Textarea id="ourNote" rows={3} {...form.register("ourNote")} />
              </Field>
              {isRent && (
                <>
                  <Separator />
                  <Field>
                    <FieldLabel htmlFor="extraInfo">Políticas & Términos</FieldLabel>
                    <Textarea id="extraInfo" rows={4} {...form.register("extraInfo")} />
                  </Field>
                  <Field>
                    <FieldLabel>Servicios incluidos</FieldLabel>
                    <Controller
                      control={form.control}
                      name="includedServices"
                      render={({ field }) => (
                        <CheckboxGroup
                          options={INCLUDED_SERVICES}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="additionalNotes">Notas adicionales</FieldLabel>
                    <Textarea id="additionalNotes" rows={3} {...form.register("additionalNotes")} />
                  </Field>
                </>
              )}
            </FieldGroup>
          </TabsContent>

          <TabsContent value="precios" className="mt-0 max-w-xl">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="price">
                    {isRent ? "Precio base/noche (para Ofertas)" : "Precio de venta"}
                  </FieldLabel>
                  <Input id="price" inputMode="decimal" {...form.register("price")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="currency">Moneda</FieldLabel>
                  <Input id="currency" maxLength={3} {...form.register("currency")} />
                </Field>
              </div>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="fotos" className="mt-0">
            <PhotosTab property={property} />
          </TabsContent>

          {isRent && (
            <TabsContent value="disponibilidad" className="mt-0 max-w-xl">
              <AvailabilityTab property={property} />
            </TabsContent>
          )}

          {isRent && (
            <TabsContent value="villa-page" className="mt-0">
              <VillaPageTab property={property} />
            </TabsContent>
          )}

          {isRent && (
            <TabsContent value="experiences" className="mt-0">
              <ExperiencesTab property={property} />
            </TabsContent>
          )}

          {isRent && (
            <TabsContent value="rates" className="mt-0 max-w-2xl">
              <RatesTab propertyId={property.id} />
            </TabsContent>
          )}

          <TabsContent value="essentials" className="mt-0">
            <EssentialsTab property={property} />
          </TabsContent>

          <TabsContent value="recomendaciones" className="mt-0 max-w-2xl">
            <RecommendationsTab propertyId={property.id} />
          </TabsContent>

          {isRent && category === "HOTEL" && (
            <TabsContent value="rooms" className="mt-0 max-w-xl">
              <RoomsTab hotelPropertyId={property.id} />
            </TabsContent>
          )}

          <TabsContent value="propietario" className="mt-0 max-w-xl">
            <Controller
              control={form.control}
              name="ownerId"
              render={({ field }) => <OwnerTab ownerId={field.value} onChange={field.onChange} />}
            />
          </TabsContent>
        </CardContent>
      </Card>
      </Tabs>
    </div>
  );
}

const TAB_DESCRIPTIONS: Record<string, string> = {
  basico: "Datos generales y métricas básicas de la propiedad.",
  ubicacion: "Dirección, mapa y características del entorno.",
  amenities: "Comodidades, estado, distribución de ambientes y lista general para el portal público.",
  content: "Textos que se muestran a clientes y colegas.",
  precios: "Precio y moneda — lo que usan Ofertas y Reservas.",
  fotos: "Galería, marca de agua y videos.",
  disponibilidad: "Bloqueos manuales y sincronización con iCal.",
  "villa-page": "Contenido destacado de la página de la villa.",
  experiences: "Experiencias destacadas cerca de la propiedad.",
  rates: "Tarifas por temporada.",
  essentials: "Contacto de management y datos de licencia.",
  recomendaciones: "Mejoras sugeridas para la propiedad.",
  rooms: "Habitaciones de este hotel.",
  propietario: "Propietario asociado a esta propiedad.",
};
