import { describe, expect, it } from "vitest";
import { parsePublicEnvironment, parseServerEnvironment } from "./schema";

const publicEnvironment = {
  NEXT_PUBLIC_APP_URL: "https://app.propertyflow.test",
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

describe("environment validation", () => {
  it("parses public settings without accepting server secrets", () => {
    expect(parsePublicEnvironment({ ...publicEnvironment, SUPABASE_SERVICE_ROLE_KEY: "secret" }))
      .toEqual(publicEnvironment);
  });

  it("requires the service key at the server boundary", () => {
    expect(() => parseServerEnvironment(publicEnvironment)).toThrow(
      "Missing or invalid environment configuration: SUPABASE_SERVICE_ROLE_KEY",
    );
  });

  it("does not expose invalid values in its error", () => {
    expect(() => parsePublicEnvironment({ ...publicEnvironment, NEXT_PUBLIC_SUPABASE_URL: "private-value" }))
      .toThrow("Missing or invalid environment configuration: NEXT_PUBLIC_SUPABASE_URL");
  });
});
