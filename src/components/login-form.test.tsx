import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ replace: vi.fn(), signIn: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace }) }));
vi.mock("@/actions/auth", () => ({ initialAuthActionState: { status: "idle" }, signIn: mocks.signIn }));
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("renders labelled credential fields and a safe return target", () => {
    render(<LoginForm next="/dashboard/properties" />);
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("autocomplete", "current-password");
    expect(document.querySelector('input[name="next"]')).toHaveValue("/dashboard/properties");
  });
});
