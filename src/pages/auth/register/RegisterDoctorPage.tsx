import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL, registerDoctorEndpoint } from "../../../api/endpoint";
import { Input } from "../../../components/ui/Input/Input";
import { specializationsData } from "../../../data/specialization";
import { authLoginPath, homePath } from "../../../utils/path";
import { Select } from "../../../components/ui/Select/Select";
import { Button } from "../../../components/ui/Button/Button";
import {
  registerDoctorFormSchema,
  type RegisterDoctorFormValues,
} from "../../../lib/validation/registration";
import { PASSWORD_RULE_TEXT } from "../../../lib/validation/auth";
import "../styles.css";

const STEP_1_FIELDS = [
  "name",
  "email",
  "password",
  "confirmPassword",
  "specialization",
  "clinicName",
  "clinicAddress",
] as const;

export default function RegisterDoctorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [serverError, setServerError] = useState<string | undefined>();

  const specializationOptions = specializationsData.map((spec) => ({
    value: spec.name,
    label: spec.name,
  }));

  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDoctorFormValues>({
    resolver: zodResolver(registerDoctorFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialization: "",
      clinicName: "",
      clinicAddress: "",
      services: [],
    },
  });

  const { fields, replace } = useFieldArray({ control, name: "services" });
  const specialization = useWatch({ control, name: "specialization" });

  // Replace the services array whenever specialization changes. This keeps
  // the visible service prompts in sync with the selected specialty and
  // wipes any prior prices (the prior services don't belong to the new
  // specialty).
  useEffect(() => {
    if (!specialization) {
      replace([]);
      return;
    }
    const selected = specializationsData.find(
      (spec) => spec.name === specialization
    );
    if (!selected) {
      replace([]);
      return;
    }
    replace(
      selected.services.map((service) => ({
        name: service.name,
        // NaN gets surfaced as a "required" message by the schema; using
        // 0 would let an empty form silently pass the >0 check on bypass.
        price: NaN,
      }))
    );
  }, [specialization, replace]);

  const handleNext = async () => {
    setServerError(undefined);
    const valid = await trigger(STEP_1_FIELDS, { shouldFocus: true });
    if (valid) setStep(2);
  };

  const onSubmit = handleSubmit(async (values) => {
    setServerError(undefined);
    const payload = {
      doctor: {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        clinicName: values.clinicName,
        clinicAddress: values.clinicAddress,
        specializations: [
          {
            name: values.specialization,
            services: values.services,
          },
        ],
      },
    };
    try {
      const response = await axios.post(
        `${API_BASE_URL}${registerDoctorEndpoint}`,
        payload
      );
      if (response.status === 201) {
        navigate(authLoginPath);
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
        <h1 className="auth-title">Doctor Registration</h1>
        {serverError && <p className="global-error">{serverError}</p>}
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          {step === 1 && (
            <div className="form-step">
              <h2 className="auth-subtitle">
                Step 1: Personal & Professional Details
              </h2>
              <section className="form-section">
                <Input
                  label="Full Name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="Email Address"
                  type="email"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="Password"
                  type="password"
                  showToggle
                  hint={PASSWORD_RULE_TEXT}
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
              </section>
              <section className="form-section">
                <Select
                  label="Specialization"
                  options={specializationOptions}
                  error={errors.specialization?.message}
                  {...register("specialization")}
                />
                <Input
                  label="Veterinary Clinic Name"
                  error={errors.clinicName?.message}
                  {...register("clinicName")}
                />
                <Input
                  label="Clinic Address"
                  error={errors.clinicAddress?.message}
                  {...register("clinicAddress")}
                />
              </section>
              <div className="auth-actions flex-end">
                <Button
                  text="Next"
                  color="primary"
                  size="md"
                  onClick={handleNext}
                  type="button"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="form-step">
              <h2 className="auth-subtitle">Services & Pricing</h2>
              <section className="form-section">
                <p className="auth-note">
                  Please select the prices for the services you offer.
                </p>
                <div className="services-list">
                  {fields.map((field, index) => (
                    <div key={field.id} className="service-price-item">
                      <label htmlFor={`service-${field.id}`}>
                        {field.name}
                      </label>
                      <Input
                        id={`service-${field.id}`}
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        error={errors.services?.[index]?.price?.message}
                        {...register(`services.${index}.price`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  ))}
                </div>
                {errors.services?.message && (
                  <p className="global-error">{errors.services.message}</p>
                )}
              </section>
              <div className="auth-actions">
                <Button
                  text="Back"
                  color="secondary"
                  onClick={() => {
                    setServerError(undefined);
                    setStep(1);
                  }}
                  size="md"
                  type="button"
                />
                <Button
                  text={isSubmitting ? "Creating Account..." : "Create Account"}
                  color="primary"
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
