import { PropertyEditor } from "@/components/properties/property-editor";

export default async function PropertyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropertyEditor propertyId={id} />;
}
