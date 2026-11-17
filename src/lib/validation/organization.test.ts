import { describe, expect, it } from "vitest";
import { organizationProfileSchema } from "./organization";

describe("organizationProfileSchema", () => {
  it("normalizes a valid agency profile", () => {
    expect(organizationProfileSchema.parse({
      organizationId: "30000000-0000-4000-8000-000000000001", name: " Prime Properties ",
      email: " OFFICE@PRIME.TEST ", phone: "+260 955 000 000", location: "Lusaka",
      logoUrl: "", timezone: "Africa/Lusaka", currency: "zmw",
    })).toMatchObject({ name: "Prime Properties", email: "office@prime.test", currency: "ZMW" });
  });

  it("rejects unsupported currency and invalid URLs", () => {
    expect(organizationProfileSchema.safeParse({
      organizationId: "30000000-0000-4000-8000-000000000001", name: "Prime Properties",
      email: "office@prime.test", logoUrl: "javascript:alert(1)", currency: "KWACHA",
    }).success).toBe(false);
  });
});
