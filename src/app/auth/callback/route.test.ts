import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  verifyOtp: vi.fn(),
  exchange: vi.fn(),
  getUser: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));

describe("agency invitation email links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createClient.mockResolvedValue({
      auth: { verifyOtp: mocks.verifyOtp, exchangeCodeForSession: mocks.exchange, getUser: mocks.getUser },
      rpc: mocks.rpc,
    });
    mocks.verifyOtp.mockResolvedValue({ error: null });
    mocks.getUser.mockResolvedValue({ data: { user: { user_metadata: {} } }, error: null });
  });

  it("verifies an invite token before opening the agency invitation", async () => {
    const invitation = "/invitations/a6d52c51-666a-4180-a293-ec36acface15";
    const url = new URL("http://localhost/auth/callback");
    url.search = new URLSearchParams({ next: invitation, token_hash: "test-token", type: "invite" }).toString();
    const response = await GET(new Request(url));
    expect(response.headers.get("location")).toBe("http://localhost" + invitation);
    expect(mocks.verifyOtp).toHaveBeenCalledWith({ token_hash: "test-token", type: "invite" });
    expect(mocks.exchange).not.toHaveBeenCalled();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("rejects an invite token directed at an external destination", async () => {
    const response = await GET(new Request("http://localhost/auth/callback?type=invite&token_hash=test&next=https://example.test"));
    expect(response.headers.get("location")).toBe("http://localhost/login?error=invalid_callback");
    expect(mocks.createClient).not.toHaveBeenCalled();
  });
});
