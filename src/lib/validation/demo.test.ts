import { describe, expect, it } from "vitest";
import { demoRequestSchema } from "./demo";

const request = {
  name: "Mwaka Banda",
  company: "Lusaka Realty",
  email: " SALES@EXAMPLE.COM ",
  phone: "+260 971 234 567",
  teamSize: "2–10",
  message: "",
};

describe("demo request validation", () => {
  it("normalizes an email and accepts an optional message", () => {
    expect(demoRequestSchema.parse(request).email).toBe("sales@example.com");
  });

  it("rejects unknown team sizes and oversized messages", () => {
    expect(demoRequestSchema.safeParse({ ...request, teamSize: "unknown" }).success).toBe(false);
    expect(demoRequestSchema.safeParse({ ...request, message: "a".repeat(2001) }).success).toBe(false);
  });
});
