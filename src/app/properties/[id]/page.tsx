import { notFound } from "next/navigation";
import { PropertyDetail } from "@/components/property-detail";
import { demoProperties } from "@/lib/demo-properties";

export const instant = false;

export function generateStaticParams() {
  return demoProperties.map(({ id }) => ({ id }));
}

export default async function PropertyDetailPage({ params }: PageProps<"/properties/[id]">) {
  const { id } = await params;
  const property = demoProperties.find((item) => item.id === id && item.status === "available");
  if (!property) notFound();
  return <PropertyDetail property={property} />;
}
