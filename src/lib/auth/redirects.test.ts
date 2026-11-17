import { describe, expect, it } from "vitest";
import { isProtectedPath, safeReturnPath } from "./redirects";

describe("safeReturnPath", () => {
  it("accepts internal paths", () => expect(safeReturnPath("/dashboard?tab=team")).toBe("/dashboard?tab=team"));
  it.each(["https://bad.test", "//bad.test", "dashboard", "/\\bad.test"])("rejects %s", (value) => {
    expect(safeReturnPath(value)).toBe("/dashboard");
  });
});

describe("isProtectedPath", () => {
  it("protects dashboard routes only", () => {
    expect(isProtectedPath("/dashboard/settings")).toBe(true);
    expect(isProtectedPath("/register")).toBe(false);
  });
});
