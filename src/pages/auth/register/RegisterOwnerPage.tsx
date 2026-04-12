import { useState, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, registerEndpoint } from "../../../api/endpoint";
import { Input } from "../../../components/ui/Input/Input";
import type { RegisterOwnerPayload } from "../../../types";
import { successPagePath } from "../../../utils/path";
import { Button } from "../../../components/ui/Button/Button";
import "../styles.css";

export default function RegisterOwnerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [ownerData, setOwnerData] = useState<RegisterOwnerPayload["owner"]>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [petData, setPetData] = useState<RegisterOwnerPayload["pet"]>({
    name: "",
    type: "",
    breed: "",
    age: 0,
    weight: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOwnerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handlePetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPetData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateStep1 = (): string | null => {
    const allEmpty =
      !ownerData.name &&
      !ownerData.email &&
      !ownerData.password &&
      !ownerData.confirmPassword;
    if (allEmpty) return "Please fill in all required fields.";

    if (!ownerData.name.trim()) return "Your name is required.";
    if (!ownerData.email.trim()) return "Your email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerData.email))
      return "Please enter a valid email address.";
    if (!ownerData.password) return "Password is required.";
    if (ownerData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (!ownerData.confirmPassword) return "Please confirm your password.";
    if (ownerData.password !== ownerData.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  const validateStep2 = (): string | null => {
    const allEmpty =
      !petData.name &&
      !petData.type &&
      !petData.breed &&
      !petData.age &&
      !petData.weight;
    if (allEmpty) return "Please fill in all required pet details.";

    if (!petData.name.trim()) return "Pet's name is required.";
    if (!petData.type.trim()) return "Pet type is required.";
    if (!petData.breed.trim()) return "Pet's breed is required.";
    if (!petData.age || petData.age <= 0)
      return "Pet's age must be greater than 0.";
    if (!petData.weight || petData.weight <= 0)
      return "Pet's weight must be greater than 0.";
    return null;
  };

  const handleNext = () => {
    setError(null);
    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setError(null);
    setStep(1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step !== 2) return;

    setError(null);
    const validationError = validateStep2();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      role: "owner",
      owner: {
        name: ownerData.name,
        email: ownerData.email,
        password: ownerData.password,
      },
      pet: {
        name: petData.name,
        type: petData.type,
        breed: petData.breed,
        age: Number(petData.age),
        weight: Number(petData.weight),
      },
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}${registerEndpoint}`,
        payload
      );

      if (response.status === 201) {
        navigate(successPagePath);
      } else {
        throw new Error("An unexpected response was received from the server.");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Registration failed.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Registration</h1>
        {error && <p className="global-error">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <h2 className="auth-subtitle">Your Details</h2>
              <Input
                name="name"
                label="Your Name"
                value={ownerData.name}
                onChange={handleOwnerChange}
              />
              <Input
                name="email"
                label="Your Email"
                type="email"
                value={ownerData.email}
                onChange={handleOwnerChange}
              />
              <Input
                name="password"
                label="Password"
                type="password"
                showToggle
                value={ownerData.password}
                onChange={handleOwnerChange}
              />
              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                showToggle
                value={ownerData.confirmPassword}
                onChange={handleOwnerChange}
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
                name="name"
                label="Pet's Name"
                value={petData.name}
                onChange={handlePetChange}
              />
              <Input
                name="type"
                label="Pet Type (e.g., Dog, Cat)"
                value={petData.type}
                onChange={handlePetChange}
              />
              <Input
                name="breed"
                label="Pet's Breed"
                value={petData.breed}
                onChange={handlePetChange}
              />
              <Input
                name="age"
                label="Pet's Age (years)"
                type="number"
                min="1"
                value={petData.age}
                onChange={handlePetChange}
              />
              <Input
                name="weight"
                label="Pet's Weight (kg)"
                type="number"
                step="0.1"
                min="0.1"
                value={petData.weight}
                onChange={handlePetChange}
              />
              <div className="auth-actions">
                <Button
                  text="Back"
                  color="secondary"
                  size="md"
                  onClick={handleBack}
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
