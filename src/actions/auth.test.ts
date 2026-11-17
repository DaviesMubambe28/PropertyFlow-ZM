import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(), rpc: vi.fn(), signInWithPassword: vi.fn(), signOut: vi.fn(), signUp: vi.fn(),
}));
mocks.createClient.mockImplementation(async () => ({
  auth: { signInWithPassword: mocks.signInWithPassword, signOut: mocks.signOut, signUp: mocks.signUp }, rpc: mocks.rpc,
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
import { initialAuthActionState, registerAdministrator, signIn } from "./auth";

function form(overrides: Record<string, string> = {}) {
  const data = new FormData();
  Object.entries({
    fullName: "Natasha Banda", agencyName: "Lusaka Prime Properties",
    agencyEmail: "office@lusakaprime.test", email: "natasha@lusakaprime.test",
    password: "SecurePass123!", confirmPassword: "SecurePass123!", ...overrides,
  }).forEach(([name, value]) => data.set(name, value));
  return data;
}

describe("registerAdministrator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.propertyflow.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
  });
  it("rejects invalid input before Supabase", async () => {
    const result = await registerAdministrator(initialAuthActionState, form({ password: "weak", confirmPassword: "weak" }));
    expect(result.status).toBe("error");
    expect(mocks.createClient).not.toHaveBeenCalled();
  });
  it("starts verified-email registration", async () => {
    mocks.signUp.mockResolvedValue({ data: { user: { id: "user-1" }, session: null }, error: null });
    const result = await registerAdministrator(initialAuthActionState, form());
    expect(mocks.signUp).toHaveBeenCalledWith(expect.objectContaining({
      email: "natasha@lusakaprime.test",
      options: expect.objectContaining({ emailRedirectTo: "https://app.propertyflow.test/auth/callback?next=%2Fdashboard" }),
    }));
    expect(result.status).toBe("success");
  });
  it("does not expose provider errors", async () => {
    mocks.signUp.mockResolvedValue({ data: { user: null, session: null }, error: { message: "sensitive detail" } });
    const result = await registerAdministrator(initialAuthActionState, form());
    expect(JSON.stringify(result)).not.toContain("sensitive detail");
    expect(result.status).toBe("error");
  });
});

describe("signIn", () => {
  beforeEach(() => vi.clearAllMocks());

  function loginForm(next = "/dashboard") {
    const data = new FormData();
    data.set("email", " USER@EXAMPLE.TEST ");
    data.set("password", "SecurePass123!");
    data.set("next", next);
    return data;
  }

  it("creates a cookie session and returns a safe destination", async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: null });
    const result = await signIn(initialAuthActionState, loginForm("/dashboard/properties"));
    expect(mocks.signInWithPassword).toHaveBeenCalledWith({ email: "user@example.test", password: "SecurePass123!" });
    expect(result).toEqual({ status: "success", redirectTo: "/dashboard/properties" });
  });

  it("uses a generic authentication failure and rejects external return paths", async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: { message: "user not found" } });
    const result = await signIn(initialAuthActionState, loginForm("https://attacker.test"));
    expect(result).toEqual({ status: "error", message: "The email or password is incorrect." });
    expect(JSON.stringify(result)).not.toContain("user not found");
  });
});
