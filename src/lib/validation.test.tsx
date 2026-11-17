import { describe, expect, it } from "vitest";
import { createEmptyState, createSeedState } from "@/lib/store";
import { formatCurrency, getCurrentUser } from "@/lib/tenant";
import { propertySchema } from "@/lib/validation";

describe("shared property validation", () => {
  it("accepts valid property payloads", () => {
    const result = propertySchema.safeParse({
      title: "Mapepe Villa",
      type: "Residential house",
      listingType: "sale",
      price: 750000,
      location: "Kabulonga",
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      description: "Comfortable family home",
      imageUrl: "https://example.com/house.jpg",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid values", () => {
    const result = propertySchema.safeParse({
      title: "X",
      type: "",
      listingType: "sale",
      price: -1,
      location: "K",
      bedrooms: -2,
      bathrooms: -1,
      area: 0,
      description: "short",
      imageUrl: "not-a-url",
    });

    expect(result.success).toBe(false);
  });
});

describe("session helpers", () => {
  it("formats ZMW values correctly", () => {
    expect(formatCurrency(250000)).toMatch("K");
  });

  it("returns the seeded current user", () => {
    const state = createSeedState();
    const user = getCurrentUser(state);
    expect(user?.email).toBe("sarah@lusakaheights.co.zm");
  });

  it("creates an empty production-safe initial state", () => {
    const state = createEmptyState();
    expect(state.users).toHaveLength(0);
    expect(state.organizations).toHaveLength(0);
    expect(state.properties).toHaveLength(0);
    expect(state.currentUserId).toBeNull();
  });
});

