import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProductTour } from "./product-tour";

describe("public product tour", () => {
  it("switches workflows while keeping sample records labelled", async () => {
    const user = userEvent.setup();
    render(<ProductTour />);
    expect(screen.getByRole("heading", { name: "Property portfolio" })).toBeVisible();
    expect(screen.getByText("Sample data")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Pipeline" }));
    expect(screen.getByRole("button", { name: "Pipeline" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Lead pipeline" })).toBeVisible();
    expect(screen.queryByText("Three-bedroom house, Kabulonga")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Complete sample follow-up" }));
    expect(screen.getByRole("status")).toHaveTextContent("Sample follow-up completed");
    await user.click(screen.getByRole("button", { name: "Reset sample follow-up" }));
    expect(screen.getByRole("status")).toHaveTextContent("Next action");
  });
});
