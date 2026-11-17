import { describe, expect, it } from "vitest";
import { invitationInputSchema, membershipStatusSchema } from "./team";

describe("team validation", () => {
  it("normalizes an invitation email", () => {
    expect(invitationInputSchema.parse({ organizationId: "30000000-0000-4000-8000-000000000001", email: " AGENT@TEST.LOCAL " }).email).toBe("agent@test.local");
  });
  it("restricts membership changes to supported states", () => {
    expect(membershipStatusSchema.safeParse({ organizationId: "30000000-0000-4000-8000-000000000001", userId: "30000000-0000-4000-8000-000000000002", status: "owner" }).success).toBe(false);
  });
});
