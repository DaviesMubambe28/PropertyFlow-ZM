import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ request: vi.fn(), update: vi.fn() }));
vi.mock("@/actions/auth", () => ({
  initialAuthActionState: { status: "idle" }, requestPasswordReset: mocks.request, updatePassword: mocks.update,
}));
import { ForgotPasswordForm, ResetPasswordForm } from "./recovery-forms";

describe("recovery forms", () => {
  it("uses an email-autocomplete recovery field", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute("autocomplete", "email");
  });
  it("uses new-password autocomplete for both reset fields", () => {
    render(<ResetPasswordForm />);
    expect(screen.getByLabelText(/^new password$/i)).toHaveAttribute("autocomplete", "new-password");
    expect(screen.getByLabelText(/confirm new password/i)).toHaveAttribute("autocomplete", "new-password");
  });
});
