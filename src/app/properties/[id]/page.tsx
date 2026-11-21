import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { PropertyDetail } from "@/components/property-detail";
import { getPublicProperty } from "@/lib/public-listing-data";

export const metadata: Metadata = { title: "Property details | PropertyFlow ZM" };
export const instant = false;

export default async function PropertyDetailPage({ params }: PageProps<"/properties/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const property = await getPublicProperty(id);
  if (!property) notFound();
  return <PropertyDetail property={property} />;
}
