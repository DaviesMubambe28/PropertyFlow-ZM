import type { MetadataRoute } from "next";
import { getSiteOrigin, privatePages } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  if (!origin) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: privatePages },
    sitemap: new URL("/sitemap.xml", origin).href,
  };
}
