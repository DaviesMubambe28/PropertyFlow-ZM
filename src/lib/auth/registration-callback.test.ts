import { describe, expect, it } from "vitest";
import { getAdministratorBootstrapInput, getSafeCallbackPath } from "./registration-callback";

describe("registration callback", () => {
  it("allows internal application paths", () => expect(getSafeCallbackPath("/dashboard?welcome=1")).toBe("/dashboard?welcome=1"));
  it.each(["https://attacker.test", "//attacker.test", "dashboard", "/\\attacker.test"])("rejects unsafe path %s", (target) => expect(getSafeCallbackPath(target)).toBe("/dashboard"));
  it("extracts validated metadata", () => expect(getAdministratorBootstrapInput({
    full_name: " Natasha Banda ", pending_organization_email: " OFFICE@LUSAKAPRIME.TEST ",
    pending_organization_name: " Lusaka Prime Properties ",
  })).toEqual({ p_email: "office@lusakaprime.test", p_full_name: "Natasha Banda", p_name: "Lusaka Prime Properties" }));
  it("rejects incomplete metadata", () => expect(getAdministratorBootstrapInput({ full_name: "Natasha" })).toBeNull());
});
