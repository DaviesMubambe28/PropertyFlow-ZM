import type { MetadataRoute } from "next";
import { getSiteOrigin, indexablePages } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  return origin ? indexablePages.map((path) => ({ url: new URL(path, origin).href })) : [];
}
