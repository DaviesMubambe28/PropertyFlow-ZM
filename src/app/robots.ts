import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getPublicEnvironment } from "@/lib/env/public";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  const base = getPublicEnvironment().NEXT_PUBLIC_APP_URL;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard/", "/staff/", "/auth/", "/invitations/"] }],
    sitemap: new URL("/sitemap.xml", base).href,
  };
}
