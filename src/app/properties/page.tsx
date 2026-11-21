import type { Metadata } from "next";
import { PublicPropertyDirectory } from "@/components/public-property-directory";
import { listPublicProperties } from "@/lib/public-listing-data";

export const metadata: Metadata = {
  title: "Published properties | PropertyFlow ZM",
  description: "Browse property listings published by Zambian real estate agencies.",
};

export const instant = false;

export default async function PropertiesPage() {
  const directory = await listPublicProperties();
  return <PublicPropertyDirectory {...directory} />;
}
