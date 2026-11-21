import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteOrigin } from "./site-url";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

afterEach(() => vi.unstubAllEnvs());

describe("getSiteOrigin", () => {
  it("uses the configured HTTPS origin", () => {
    expect(getSiteOrigin("https://propertyflow.example/preview")).toBe("https://propertyflow.example");
  });

  it.each(["", "bad", "http://propertyflow.example", "https://localhost:3000", "https://127.0.0.1", "https://user:password@propertyflow.example"])("suppresses invalid or local origins (%s)", (url) => {
    expect(getSiteOrigin(url)).toBeUndefined();
  });
});

describe("public metadata routes", () => {
  it("indexes only public destinations on the configured host", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://propertyflow.example");
    expect(robots()).toMatchObject({
      sitemap: "https://propertyflow.example/sitemap.xml",
      rules: { disallow: expect.arrayContaining(["/dashboard", "/staff", "/login"]) },
    });
    const urls = sitemap().map(({ url }) => url);
    expect(urls).toContain("https://propertyflow.example/enterprise");
    expect(urls.every((url) => new URL(url).origin === "https://propertyflow.example")).toBe(true);
    expect(urls.some((url) => /\/(?:dashboard|staff|properties)(?:\/|$)/.test(url))).toBe(false);
  });

  it("withholds discovery when configured with a local origin", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://127.0.0.1:3000");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(sitemap()).toEqual([]);
  });
});
