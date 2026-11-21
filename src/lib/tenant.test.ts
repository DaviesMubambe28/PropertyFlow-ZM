import { describe, expect, it } from "vitest";
import { whatsappContactLink } from "./tenant";

describe("WhatsApp contact links", () => {
  it.each(["0971 234 567", "+260 (971) 234-567", "00260971234567"])(
    "normalizes %s to an international number",
    (value) => expect(whatsappContactLink(value)).toBe("https://wa.me/260971234567"),
  );

  it.each(["", "unknown", "0971", "260971234567?text=test"])(
    "rejects invalid phone input %s",
    (value) => expect(whatsappContactLink(value)).toBeNull(),
  );
});
