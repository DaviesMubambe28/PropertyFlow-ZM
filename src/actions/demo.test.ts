import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitDemoRequest, updateDemoRequest } from "./demo";

const mocks = vi.hoisted(() => ({
  getStaff: vi.fn(),
  rpc: vi.fn(),
  revalidate: vi.fn(),
}));

vi.mock("@/lib/auth/sales-staff", () => ({ getSalesStaffId: mocks.getStaff }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => ({ rpc: mocks.rpc }) }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));

function request() {
  const form = new FormData();
  for (const [name, value] of Object.entries({
    name: "Demo Contact",
    company: "Demo Company",
    email: "demo@example.test",
    phone: "",
    teamSize: "1",
    message: "",
  })) form.set(name, value);
  return form;
}

describe("demo requests", () => {
  beforeEach(() => vi.resetAllMocks());

  it("only confirms a valid submission acknowledged by the database", async () => {
    mocks.rpc.mockResolvedValueOnce({ data: false, error: null }).mockResolvedValueOnce({ data: true, error: null });
    expect(await submitDemoRequest(null, request())).toMatch(/Too many requests/);
    expect(await submitDemoRequest(null, request())).toBe("received");
    expect(mocks.rpc).toHaveBeenCalledWith("submit_demo_request", expect.objectContaining({
      payload: expect.objectContaining({ email: "demo@example.test" }),
    }));
  });

  it("keeps invalid requests and honeypot submissions out of storage", async () => {
    const form = request();
    form.set("email", "invalid");
    expect(await submitDemoRequest(null, form)).toMatch(/Check your contact details/);
    const automated = request();
    automated.set("website", "automated");
    await submitDemoRequest(null, automated);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("rejects workspace users who lack platform sales access", async () => {
    mocks.getStaff.mockResolvedValue(null);
    expect(await updateDemoRequest(null, new FormData())).toMatch(/do not have access/);
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
});
