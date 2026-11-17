import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { mapOperationalData, mapWorkspaceIdentity } from "./current-context";

const user = {
  id: "user-1", email: "admin@example.test", created_at: "2026-11-17T00:00:00Z",
  user_metadata: { full_name: "Natasha Banda" },
} as never;

describe("mapWorkspaceIdentity", () => {
  it("maps an administrator membership into dashboard identity", () => {
    const result = mapWorkspaceIdentity(user, [{
      organization_id: "org-1", role: "admin",
      organizations: { id: "org-1", name: "Prime Properties", email: "office@example.test", phone: null, timezone: "Africa/Lusaka", currency: "ZMW", created_at: "2026-11-17T00:00:00Z" },
    }]);
    expect(result?.user.role).toBe("owner");
    expect(result?.organizations[0].name).toBe("Prime Properties");
  });
  it("rejects a user without active organization data", () => expect(mapWorkspaceIdentity(user, [])).toBeNull());
});

describe("mapOperationalData", () => {
  it("maps database rows into the existing dashboard contracts", () => {
    const result = mapOperationalData({
      properties: [{ id: "property-1", organization_id: "org-1", title: "Kabulonga Home", type: "house", listing_type: "sale", price: "750000.00", location: "Lusaka", bedrooms: 3, bathrooms: 2, area: "180.5", status: "active", image_url: null, description: "Family home", featured: false, created_at: "2026-11-17T00:00:00Z" }],
      contacts: [{ id: "contact-1", organization_id: "org-1", name: "Buyer One", email: "buyer@test.local", phone: "+260", category: "buyer", lead_source: "Website", budget: "K750,000", notes: "", created_at: "2026-11-17T00:00:00Z" }],
      leads: [], viewings: [], tasks: [], deals: [], leadInteractions: [],
    });
    expect(result.properties[0]).toMatchObject({ orgId: "org-1", listingType: "sale", price: 750000, area: 180.5 });
    expect(result.contacts[0]).toMatchObject({ orgId: "org-1", leadSource: "Website" });
  });
});
