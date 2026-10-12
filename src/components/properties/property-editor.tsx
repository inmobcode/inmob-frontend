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

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SectionNavbar } from "@/components/properties/editor-shell";
import { AmenitiesTab } from "@/components/properties/amenities-tab";
import { BasicTab } from "@/components/properties/basic-tab";
import { ContentTab } from "@/components/properties/content-tab";
import { LocationTab } from "@/components/properties/location-tab";
import { PricesTab } from "@/components/properties/prices-tab";
import { AvailabilityTab } from "@/components/properties/availability-tab";
import { EssentialsTab } from "@/components/properties/essentials-tab";
import { ExperiencesTab } from "@/components/properties/experiences-tab";
import { OwnerTab } from "@/components/properties/owner-tab";
import { PhotosTab } from "@/components/properties/photos-tab";
import { RatesTab } from "@/components/properties/rates-tab";
import { RecommendationsTab } from "@/components/properties/recommendations-tab";
import { RoomsTab } from "@/components/properties/rooms-tab";
import { VillaPageTab } from "@/components/properties/villa-page-tab";
import { ApiError } from "@/lib/api/client";
import {
  getProperty,
  publishProperty,
  unpublishProperty,
  updateProperty,
  type Property,
  type UpdatePropertyPayload,
} from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media } from "@/lib/motion";
import { useActionBarStore } from "@/lib/store/action-bar-store";

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

  managementName: z.string(),
  managementEmail: z.string(),
  managementPhone: z.string(),
  managementCompany: z.string(),
  vendorPropertyName: z.string(),
  website: z.string(),
  commission: z.string(),
  license: z.string(),
  thirdPartyPermission: z.boolean(),

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

    managementName: c?.managementName ?? "",
    managementEmail: c?.managementEmail ?? "",
    managementPhone: c?.managementPhone ?? "",
    managementCompany: c?.managementCompany ?? "",
    vendorPropertyName: c?.vendorPropertyName ?? "",
    website: c?.website ?? "",
    commission: c?.commission ?? "",
    license: c?.license ?? "",
    thirdPartyPermission: c?.thirdPartyPermission ?? false,

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

function toPayload(values: FormValues, originalOwnerId?: string | null): UpdatePropertyPayload {
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
    // Clearing the owner sends null (needs backend support); a property that never had one sends nothing.
    ...(values.ownerId ? { ownerId: values.ownerId } : originalOwnerId ? { ownerId: null } : {}),

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
      // Sent as-is (even empty) so clearing one of these actually clears it.
      managementName: values.managementName,
      managementEmail: values.managementEmail,
      managementPhone: values.managementPhone,
      managementCompany: values.managementCompany,
      vendorPropertyName: values.vendorPropertyName,
      website: values.website,
      commission: values.commission,
      license: values.license,
      thirdPartyPermission: values.thirdPartyPermission,
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

  const [formReady, setFormReady] = useState(false);
  useEffect(() => {
    if (property) {
      form.reset(toFormValues(property));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- gates the form's first render until reset() has populated real values
      setFormReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?.updatedAt]);

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateProperty(token, propertyId, toPayload(values, property?.ownerId));
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
      await updateProperty(token, propertyId, toPayload(values, property?.ownerId));
      return publishProperty(token, propertyId);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["property", propertyId], updated);
      toast.success("Propiedad publicada");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo publicar"),
  });

  const unpublishMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return unpublishProperty(token, propertyId);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["property", propertyId], updated);
      toast.success("Propiedad despublicada");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo despublicar"),
  });

  const isPublished = property?.status === "PUBLISHED";

  useEffect(() => {
    const navGroups = property ? buildGroups(property.listingType, property.category) : [];
    setActions({
      title: findTabMeta(navGroups, activeTab)?.label ?? "Propiedad",
      navigation: property ? (
        <SectionNavbar groups={navGroups} active={activeTab} onChange={setTab} />
      ) : null,
      isSubmitting: saveMutation.isPending || publishMutation.isPending || unpublishMutation.isPending,
      isDirty,
      canSubmit: true,
      onSave: form.handleSubmit((values) => saveMutation.mutate(values)),
      publishLabel: isPublished ? "Despublicar" : "Publicar",
      onPublish: isPublished
        ? () => unpublishMutation.mutate()
        : form.handleSubmit((values) => publishMutation.mutate(values)),
      onCancel: () => router.push("/properties"),
    });
    return resetActions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    property,
    activeTab,
    isDirty,
    isPublished,
    saveMutation.isPending,
    publishMutation.isPending,
    unpublishMutation.isPending,
  ]);

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

  if (isLoading || !property || !formReady) {
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

  const isRent = listingType === "RENT";

  return (
    <div className="flex flex-col gap-8">
      <Tabs value={activeTab} onValueChange={setTab} className="flex flex-col gap-6">
        <Card ref={contentRef} className="min-w-0 flex-1">
        <CardContent>
          <TabsContent value="basico" className="mt-0">
            <BasicTab form={form} property={property} />
          </TabsContent>

          <TabsContent value="ubicacion" className="mt-0">
            <LocationTab form={form} />
          </TabsContent>

          <TabsContent value="amenities" className="mt-0">
            <AmenitiesTab form={form} property={property} isRent={isRent} />
          </TabsContent>

          <TabsContent value="content" className="mt-0">
            <ContentTab form={form} isRent={isRent} />
          </TabsContent>

          <TabsContent value="precios" className="mt-0">
            <PricesTab form={form} isRent={isRent} />
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
            <EssentialsTab form={form} />
          </TabsContent>

          <TabsContent value="recomendaciones" className="mt-0 max-w-2xl">
            <RecommendationsTab propertyId={property.id} />
          </TabsContent>

          {isRent && category === "HOTEL" && (
            <TabsContent value="rooms" className="mt-0 max-w-xl">
              <RoomsTab hotelPropertyId={property.id} />
            </TabsContent>
          )}

          <TabsContent value="propietario" className="mt-0">
            <Controller
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <OwnerTab ownerId={field.value} onChange={field.onChange} currentOwner={property.owner} />
              )}
            />
          </TabsContent>
        </CardContent>
      </Card>
      </Tabs>
    </div>
  );
}
