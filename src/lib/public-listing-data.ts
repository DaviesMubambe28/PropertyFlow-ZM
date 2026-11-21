import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PublicListing } from "@/lib/public-listing";

const fields = "id,title,type,listing_type,price,location,bedrooms,bathrooms,area,image_url,description";

type ListingRow = Omit<PublicListing, "listingType" | "imageUrl"> & {
  listing_type: PublicListing["listingType"];
  image_url: string | null;
};

function formatListing({ listing_type, image_url, ...listing }: ListingRow): PublicListing {
  return { ...listing, listingType: listing_type, imageUrl: image_url ?? "" };
}

export async function listPublicProperties() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("public_property_listings")
    .select(fields).order("published_at", { ascending: false }).order("id").limit(100);
  return { properties: (data ?? []).map(formatListing), unavailable: Boolean(error) };
}

export async function getPublicProperty(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("public_property_listings").select(fields).eq("id", id).maybeSingle();
  if (error) throw new Error("Unable to load the public property listing.");
  return data ? formatListing(data) : null;
}
