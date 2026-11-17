import { z } from "zod";

const normalizedEmail = z.string().trim().pipe(z.email("Enter a valid email address."))
  .transform((value) => value.toLowerCase());
const strongPassword = z.string()
  .min(8, "Use at least 8 characters with uppercase, lowercase, and a number.")
  .max(72, "Use no more than 72 characters.")
  .regex(/[a-z]/, "Use at least 8 characters with uppercase, lowercase, and a number.")
  .regex(/[A-Z]/, "Use at least 8 characters with uppercase, lowercase, and a number.")
  .regex(/[0-9]/, "Use at least 8 characters with uppercase, lowercase, and a number.");

export const administratorRegistrationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  agencyName: z.string().trim().min(2, "Enter your agency name.").max(160),
  agencyEmail: normalizedEmail,
  email: normalizedEmail,
  password: strongPassword,
  confirmPassword: z.string(),
}).superRefine((value, context) => {
  if (value.password !== value.confirmPassword) {
    context.addIssue({ code: "custom", message: "Passwords do not match.", path: ["confirmPassword"] });
  }
});

export const signInSchema = z.object({
  email: normalizedEmail,
  password: z.string().min(1, "Enter your password.").max(72),
});
