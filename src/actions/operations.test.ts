import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(), from: vi.fn(), getUser: vi.fn(), insert: vi.fn(), revalidatePath: vi.fn(), update: vi.fn(),
}));
mocks.from.mockImplementation(() => ({ insert: mocks.insert, update: mocks.update }));
mocks.createClient.mockImplementation(async () => ({ auth: { getUser: mocks.getUser }, from: mocks.from }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { createProperty, initialOperationState } from "./operations";

function propertyForm(overrides: Record<string, string> = {}) {
  const data = new FormData();
  Object.entries({
    organizationId: "30000000-0000-4000-8000-000000000001", title: "Kabulonga Home", type: "House",
    listingType: "sale", price: "750000", location: "Lusaka", bedrooms: "3", bathrooms: "2",
    area: "180", description: "A family home", imageUrl: "", ...overrides,
  }).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("createProperty", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    mocks.insert.mockResolvedValue({ error: null });
  });

  it("rejects invalid input before opening a database client", async () => {
    const result = await createProperty(initialOperationState, propertyForm({ title: "x" }));
    expect(result.status).toBe("error");
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("persists only validated property fields", async () => {
    const result = await createProperty(initialOperationState, propertyForm());
    expect(mocks.from).toHaveBeenCalledWith("properties");
    expect(mocks.insert).toHaveBeenCalledWith({
      organization_id: "30000000-0000-4000-8000-000000000001", title: "Kabulonga Home", type: "House",
      listing_type: "sale", price: 750000, location: "Lusaka", bedrooms: 3, bathrooms: 2,
      province: "Lusaka", area: 180, description: "A family home", image_url: null,
      status: "available", owner_name: "", owner_phone: "", assigned_to: "user-1", created_by: "user-1",
    });
    expect(result.status).toBe("success");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("does not expose database error details", async () => {
    mocks.insert.mockResolvedValue({ error: { message: "internal policy detail" } });
    const result = await createProperty(initialOperationState, propertyForm());
    expect(result).toEqual({ status: "error", message: "The property could not be saved. Please try again." });
  });
});
