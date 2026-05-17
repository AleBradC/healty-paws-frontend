import { z } from "zod";

// These schemas mirror the server-side definitions in
// healthy-paws-service/src/features/registration/registration.validation.ts
// and authentication.helpers.ts. Keep them in sync — the backend re-validates
// every request, so a frontend drift just means the user sees a worse error
// than a clean inline one.
//
// Long-term: replace this file with a shared workspace package
// (e.g. `@healthy-paws/contracts`) consumed by both repos.

// Looser than the registration schema (the backend enforces strict
// complexity at create time and authenticates login by hash comparison).
// The 6-char minimum is a UX gate — saves a round trip for obviously-empty
// or single-character typos. Real credential checking is the server's job.
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Reused across registration and reset-password — the regex literally
// matches the backend's, so a passing client validation guarantees a
// passing server validation for this rule.
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]).{8,}$/;

export const PASSWORD_RULE_TEXT =
  "Must be 8+ characters and include uppercase, lowercase, a number, and a special character.";

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(
    PASSWORD_REGEX,
    "Password must include uppercase, lowercase, a number, and a special character."
  );

export const requestResetSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

export type RequestResetFormValues = z.infer<typeof requestResetSchema>;

export const newPasswordSchema = z
  .object({
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
