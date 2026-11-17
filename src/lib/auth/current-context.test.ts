import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { mapWorkspaceIdentity } from "./current-context";

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
