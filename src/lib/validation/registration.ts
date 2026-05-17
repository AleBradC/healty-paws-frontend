import { z } from "zod";
import { strongPasswordSchema } from "./auth";

// Mirrors healthy-paws-service/src/features/registration/registration.validation.ts.
// See the note at the top of ./auth.ts about long-term consolidation.

const credentialsBlock = {
  name: z.string().trim().min(1, "Name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password."),
};

export const ownerCredentialsSchema = z
  .object(credentialsBlock)
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

// Number inputs are registered with `valueAsNumber: true` so RHF hands the
// resolver a real number (NaN when empty). We use a custom error so the
// "required" message reads naturally instead of "Expected number, received NaN".
const requiredNumber = (label: string, opts: { integer?: boolean } = {}) =>
  z
    .number({ error: `${label} is required.` })
    .refine((n) => !Number.isNaN(n), { message: `${label} is required.` })
    .refine((n) => n > 0, { message: `${label} must be greater than 0.` })
    .refine((n) => (opts.integer ? Number.isInteger(n) : true), {
      message: `${label} must be a whole number.`,
    });

export const petSchema = z.object({
  name: z.string().trim().min(1, "Pet's name is required."),
  type: z.string().trim().min(1, "Pet type is required."),
  breed: z.string().trim().min(1, "Pet's breed is required."),
  age: requiredNumber("Pet's age", { integer: true }),
  weight: requiredNumber("Pet's weight"),
});

export const registerOwnerFormSchema = z
  .object({
    ...credentialsBlock,
    pet: petSchema,
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type RegisterOwnerFormValues = z.infer<typeof registerOwnerFormSchema>;

export const serviceSchema = z.object({
  name: z.string().min(1),
  price: requiredNumber("Price"),
});

export const registerDoctorFormSchema = z
  .object({
    ...credentialsBlock,
    specialization: z.string().min(1, "Please select a specialization."),
    clinicName: z.string().trim().min(1, "Clinic name is required."),
    clinicAddress: z.string().trim().min(1, "Clinic address is required."),
    services: z
      .array(serviceSchema)
      .min(1, "Please configure at least one service."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type RegisterDoctorFormValues = z.infer<typeof registerDoctorFormSchema>;
