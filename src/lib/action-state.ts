export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Record<string, string[] | undefined>;
  redirectTo?: string;
};
export const initialAuthActionState: AuthActionState = { status: "idle" };

export type OperationState = {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Record<string, string[] | undefined>;
};
export const initialOperationState: OperationState = { status: "idle" };

export type OrganizationActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Record<string, string[] | undefined>;
};
export const initialOrganizationState: OrganizationActionState = { status: "idle" };
