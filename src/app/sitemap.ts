import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getPublicEnvironment } from "@/lib/env/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const base = getPublicEnvironment().NEXT_PUBLIC_APP_URL;
  return ["/", "/features", "/enterprise", "/pricing", "/about", "/properties", "/contact", "/privacy", "/terms"]
    .map((path) => ({ url: new URL(path, base).href }));
}
