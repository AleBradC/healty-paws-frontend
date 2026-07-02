import { z } from "zod";


export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

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
