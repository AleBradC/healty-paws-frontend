// Mirrors the server-side Zod schema in
// healthy-paws-service/src/features/authentication/authentication.controller.ts.
// Keep these two in sync.
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]).{8,}$/;

export const PASSWORD_RULE_TEXT =
  "Must be 8+ characters and include uppercase, lowercase, a number, and a special character.";

const PASSWORD_COMPLEXITY_ERROR =
  "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.";

const PASSWORDS_DO_NOT_MATCH_ERROR = "Passwords do not match.";

export function validateNewPassword(
  newPassword: string,
  confirmPassword: string
): string | null {
  if (!PASSWORD_REGEX.test(newPassword)) {
    return PASSWORD_COMPLEXITY_ERROR;
  }
  if (newPassword !== confirmPassword) {
    return PASSWORDS_DO_NOT_MATCH_ERROR;
  }
  return null;
}
