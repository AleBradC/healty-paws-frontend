import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL, registerOwnerEndpoint } from "../../../api/endpoint";
import { Input } from "../../../components/ui/Input/Input";
import { Button } from "../../../components/ui/Button/Button";
import { successPagePath, homePath } from "../../../utils/path";
import {
  registerOwnerFormSchema,
  type RegisterOwnerFormValues,
} from "../../../lib/validation/registration";
import { PASSWORD_RULE_TEXT } from "../../../lib/validation/auth";
import "../styles.css";

// Field groups for per-step validation. Using `Path<...>` would be more
// strict but the literal tuples are clearer at the call site and the
// schema is small.
const STEP_1_FIELDS = [
  "name",
  "email",
  "password",
  "confirmPassword",
] as const;

const STEP_2_FIELDS = [
  "pet.name",
  "pet.type",
  "pet.breed",
  "pet.age",
  "pet.weight",
] as const;

export default function RegisterOwnerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterOwnerFormValues>({
    resolver: zodResolver(registerOwnerFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      pet: {
        name: "",
        type: "",
        breed: "",
        // RHF + `valueAsNumber: true` turn an empty text input into NaN at
        // submit time; the schema's refine catches that and surfaces a
        // "required" message instead of a misleading type error.
        age: NaN,
        weight: NaN,
      },
    },
  });

  const handleNext = async () => {
    setServerError(null);
    const valid = await trigger(STEP_1_FIELDS, { shouldFocus: true });
    if (valid) setStep(2);
  };

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}${registerOwnerEndpoint}`,
        {
          owner: {
            name: values.name,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
          },
          pet: values.pet,
        }
      );
      if (response.status === 201) {
        navigate(successPagePath);
      } else {
        throw new Error("Unexpected response.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setServerError(err.response.data.message || "Registration failed.");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to={homePath} className="auth-close-button" aria-label="Close">
          ×
        </Link>
        <h1 className="auth-title">Registration</h1>
        {serverError && <p className="global-error">{serverError}</p>}
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          {step === 1 && (
            <div className="form-step">
              <h2 className="auth-subtitle">Your Details</h2>
              <Input
                label="Your Name"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Your Email"
                type="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                hint={PASSWORD_RULE_TEXT}
                showToggle
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Confirm Password"
                type="password"
                showToggle
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
              <div className="auth-actions align-end">
                <Button
                  text="Next"
                  color="accent"
                  size="md"
                  onClick={handleNext}
                  type="button"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="form-step">
              <h2 className="auth-subtitle">Your Pet's Details</h2>
              <Input
                label="Pet's Name"
                error={errors.pet?.name?.message}
                {...register("pet.name")}
              />
              <Input
                label="Pet Type (e.g., Dog, Cat)"
                error={errors.pet?.type?.message}
                {...register("pet.type")}
              />
              <Input
                label="Pet's Breed"
                error={errors.pet?.breed?.message}
                {...register("pet.breed")}
              />
              <Input
                label="Pet's Age (years)"
                type="number"
                min="1"
                error={errors.pet?.age?.message}
                {...register("pet.age", { valueAsNumber: true })}
              />
              <Input
                label="Pet's Weight (kg)"
                type="number"
                step="0.1"
                min="0.1"
                error={errors.pet?.weight?.message}
                {...register("pet.weight", { valueAsNumber: true })}
              />
              <div className="auth-actions">
                <Button
                  text="Back"
                  color="secondary"
                  size="md"
                  onClick={() => {
                    setServerError(null);
                    setStep(1);
                  }}
                  type="button"
                />
                <Button
                  text={isSubmitting ? "Registering..." : "Create Account"}
                  color="accent"
                  type="submit"
                  size="md"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
