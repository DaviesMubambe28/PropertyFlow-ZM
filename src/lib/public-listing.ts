import type { Property } from "@/lib/types";

export type PublicListing = Pick<Property, "id" | "title" | "type" | "listingType" | "price" |
  "location" | "bedrooms" | "bathrooms" | "area" | "imageUrl" | "description">;
