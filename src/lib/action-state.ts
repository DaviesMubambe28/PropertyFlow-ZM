import type { AuthActionState } from "@/actions/auth";
import type { OperationState } from "@/actions/operations";
import type { OrganizationActionState } from "@/actions/organizations";

export const initialAuthActionState: AuthActionState = { status: "idle" };
export const initialOperationState: OperationState = { status: "idle" };
export const initialOrganizationState: OrganizationActionState = { status: "idle" };
