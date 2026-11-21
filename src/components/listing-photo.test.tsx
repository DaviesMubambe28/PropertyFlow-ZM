import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingPhoto } from "./listing-photo";

describe("public listing photos", () => {
  it("shows a fallback when the listing has no photo", () => {
    render(<ListingPhoto src="" title="Kabulonga home" sizes="100vw" />);
    expect(screen.getByText("Photo unavailable")).toBeVisible();
  });

  it("replaces a failed photo with the same fallback", () => {
    render(<ListingPhoto src="https://example.test/property.jpg" title="Kabulonga home" sizes="100vw" />);
    fireEvent.error(screen.getByRole("img", { name: "Kabulonga home" }));
    expect(screen.getByText("Photo unavailable")).toBeVisible();
  });
});
