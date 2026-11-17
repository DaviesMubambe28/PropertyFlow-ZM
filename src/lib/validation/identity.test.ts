import { describe, expect, it } from "vitest";
import { administratorRegistrationSchema } from "./identity";

const valid = {
  fullName: " Natasha Banda ", agencyName: " Lusaka Prime Properties ",
  agencyEmail: " OFFICE@LUSAKAPRIME.TEST ", email: " NATASHA@LUSAKAPRIME.TEST ",
  password: "SecurePass123!", confirmPassword: "SecurePass123!",
};

describe("administratorRegistrationSchema", () => {
  it("normalizes valid registration data", () => {
    const result = administratorRegistrationSchema.parse(valid);
    expect(result.email).toBe("natasha@lusakaprime.test");
    expect(result.agencyEmail).toBe("office@lusakaprime.test");
    expect(result.fullName).toBe("Natasha Banda");
  });
  it("rejects weak passwords", () => expect(administratorRegistrationSchema.safeParse({ ...valid, password: "weak", confirmPassword: "weak" }).success).toBe(false));
  it("rejects mismatched confirmation", () => expect(administratorRegistrationSchema.safeParse({ ...valid, confirmPassword: "Different123" }).success).toBe(false));
});
