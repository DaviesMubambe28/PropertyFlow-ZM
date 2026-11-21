import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DemoFormState } from "./demo";

const { createAdminClient, getDemoStaff, rpc } = vi.hoisted(() => ({
  createAdminClient: vi.fn(), getDemoStaff: vi.fn(), rpc: vi.fn(),
}));
vi.mock("@/lib/auth/demo-staff", () => ({ getDemoStaff }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { reviewDemoRequest, submitDemoRequest } from "./demo";

const initial: DemoFormState = { status: "idle", message: "" };
function requestForm() {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    fullName: "Example Person", company: "Example Agency", email: " PERSON@EXAMPLE.COM ",
    phone: "+260 977 000000", teamSize: "2–5", requirements: "",
  })) form.set(key, value);
  return form;
}

beforeEach(() => {
  vi.resetAllMocks();
  createAdminClient.mockReturnValue({ rpc });
});

describe("enterprise demo requests", () => {
  it("reports success only after persistence and normalises the email", async () => {
    rpc.mockResolvedValue({ data: true, error: null });
    await expect(submitDemoRequest(initial, requestForm())).resolves.toMatchObject({ status: "success" });
    expect(rpc).toHaveBeenCalledWith("submit_enterprise_demo", expect.objectContaining({ p_email: "person@example.com" }));
  });

  it.each([null, false])("does not claim submission when persistence returns %s", async (data) => {
    rpc.mockResolvedValue({ data, error: null });
    await expect(submitDemoRequest(initial, requestForm())).resolves.toMatchObject({ status: "error" });
  });

  it("rejects a filled honeypot before opening a privileged client", async () => {
    const form = requestForm();
    form.set("website", "spam");
    await expect(submitDemoRequest(initial, form)).resolves.toMatchObject({ status: "error" });
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it("checks the staff identity before opening a privileged client", async () => {
    getDemoStaff.mockResolvedValue(null);
    await expect(reviewDemoRequest(initial, new FormData())).resolves.toMatchObject({ status: "error" });
    expect(createAdminClient).not.toHaveBeenCalled();
  });
});
