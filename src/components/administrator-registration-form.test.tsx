import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ registerAdministrator: vi.fn() }));
vi.mock("@/actions/auth", () => ({
  initialAuthActionState: { status: "idle" }, registerAdministrator: mocks.registerAdministrator,
}));
import { AdministratorRegistrationForm } from "./administrator-registration-form";

describe("AdministratorRegistrationForm", () => {
  it("provides labelled agency and account fields", () => {
    render(<AdministratorRegistrationForm />);
    expect(screen.getByRole("heading", { name: /create your agency workspace/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText(/agency name/i)).toHaveAttribute("autocomplete", "organization");
    expect(screen.getByLabelText(/^email address/i)).toHaveAttribute("type", "email");
  });
  it("reveals and hides passwords", async () => {
    const user = userEvent.setup();
    render(<AdministratorRegistrationForm />);
    const password = screen.getByLabelText(/^password$/i);
    await user.click(screen.getByRole("button", { name: /show passwords/i }));
    expect(password).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: /hide passwords/i }));
    expect(password).toHaveAttribute("type", "password");
  });
});
