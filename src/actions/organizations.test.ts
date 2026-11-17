import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createClient: vi.fn(), eq: vi.fn(), from: vi.fn(), getUser: vi.fn(), revalidatePath: vi.fn(), update: vi.fn() }));
mocks.update.mockImplementation(() => ({ eq: mocks.eq }));
mocks.from.mockImplementation(() => ({ update: mocks.update }));
mocks.createClient.mockImplementation(async () => ({ auth: { getUser: mocks.getUser }, from: mocks.from }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { initialOrganizationState, updateOrganizationProfile } from "./organizations";

describe("updateOrganizationProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    mocks.eq.mockResolvedValue({ error: null });
  });

  it("updates only allowlisted profile fields", async () => {
    const data = new FormData();
    Object.entries({ organizationId: "30000000-0000-4000-8000-000000000001", name: "Prime Properties", email: "office@prime.test", phone: "+260", location: "Lusaka", logoUrl: "", timezone: "Africa/Lusaka", currency: "ZMW" }).forEach(([key, value]) => data.set(key, value));
    const result = await updateOrganizationProfile(initialOrganizationState, data);
    expect(mocks.update).toHaveBeenCalledWith({ name: "Prime Properties", email: "office@prime.test", phone: "+260", location: "Lusaka", logo_url: null, timezone: "Africa/Lusaka", currency: "ZMW" });
    expect(mocks.eq).toHaveBeenCalledWith("id", "30000000-0000-4000-8000-000000000001");
    expect(result.status).toBe("success");
  });
});
