import {
  useState,
  type FormEvent,
  type ChangeEvent,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, registerDoctorEndpoint } from "../../../api/endpoint";
import { Input } from "../../../components/ui/Input/Input";
import { specializationsData } from "../../../data/specialization";
import { successPagePath, homePath } from "../../../utils/path";
import { Select } from "../../../components/ui/Select/Select";
import { Button } from "../../../components/ui/Button/Button";
import { Link } from "react-router-dom";
import "../styles.css";

interface ServicePrice {
  name: string;
  price: string;
}

export default function RegisterDoctorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    clinicName: "",
    clinicAddress: "",
  });
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const canProceedStep1 =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password.length >= 8 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword &&
    formData.specialization.trim().length > 0 &&
    formData.clinicName.trim().length > 0 &&
    formData.clinicAddress.trim().length > 0;
  const canSubmitStep2 =
    services.length > 0 &&
    services.every(
      (service) => service.price.trim().length > 0 && Number(service.price) > 0
    );

  const specializationOptions = specializationsData.map((spec) => ({
    value: spec.name,
    label: spec.name,
  }));

  useEffect(() => {
    if (!formData.specialization) {
      setServices([]);
      return;
    }
    const selectedSpec = specializationsData.find(
      (spec) => spec.name === formData.specialization
    );

    if (selectedSpec) {
      const initialServices = selectedSpec.services.map((service) => ({
        name: service.name,
        price: "",
      }));
      setServices(initialServices);
    }
  }, [formData.specialization]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(undefined);
  };

  const handleServicePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    serviceName: string
  ) => {
    const { value } = e.target;
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.name === serviceName ? { ...service, price: value } : service
      )
    );
    if (error) setError(undefined);
  };

  const validateStep1 = (): string | null => {
    const allEmpty =
      !formData.name &&
      !formData.email &&
      !formData.password &&
      !formData.confirmPassword &&
      !formData.specialization &&
      !formData.clinicName &&
      !formData.clinicAddress;
    if (allEmpty) return "Please fill in all required fields.";

    if (!formData.name.trim()) return "Full name is required.";
    if (!formData.email.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Please enter a valid email address.";
    if (!formData.password) return "Password is required.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (!formData.confirmPassword) return "Please confirm your password.";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";
    if (!formData.specialization) return "Please select a specialization.";
    if (!formData.clinicName.trim()) return "Clinic name is required.";
    if (!formData.clinicAddress.trim()) return "Clinic address is required.";

    return null;
  };

  const validateStep2 = (): string | null => {
    if (services.length === 0)
      return "No services available for the selected specialization.";

    const allPricesEmpty = services.every(
      (s) => !s.price || s.price.trim() === ""
    );
    if (allPricesEmpty) return "Please set prices for all services.";

    for (const service of services) {
      if (!service.price || service.price.trim() === "") {
        return `Please set a price for "${service.name}".`;
      }
      const price = Number(service.price);
      if (isNaN(price) || price <= 0) {
        return `Please set a valid price (greater than 0) for "${service.name}".`;
      }
    }
    return null;
  };

  const handleNext = () => {
    setError(undefined);
    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setError(undefined);
    setStep(1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step !== 2) return;

    setError(undefined);
    const validationError = validateStep2();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      doctor: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        clinicName: formData.clinicName,
        clinicAddress: formData.clinicAddress,
        specializations: [
          {
            name: formData.specialization,
            services: services.map((service) => ({
              name: service.name,
              price: Number(service.price),
            })),
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
        <Link to={homePath} className="auth-close-button" aria-label="Close">
          ×
        </Link>
        <h1 className="auth-title">Doctor Registration</h1>
        {error && <p className="global-error">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <h2 className="auth-subtitle">
                Step 1: Personal & Professional Details
              </h2>
              <section className="form-section">
                <Input
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <Input
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  showToggle
                  value={formData.password}
                  onChange={handleChange}
                />
                <Input
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  showToggle
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </section>
              <section className="form-section">
                <Select
                  label="Specialization"
                  name="specialization"
                  options={specializationOptions}
                  value={formData.specialization}
                  onChange={handleChange}
                />
                <Input
                  name="clinicName"
                  label="Veterinary Clinic Name"
                  value={formData.clinicName}
                  onChange={handleChange}
                />
                <Input
                  name="clinicAddress"
                  label="Clinic Address"
                  value={formData.clinicAddress}
                  onChange={handleChange}
                />
              </section>
              <div className="auth-actions flex-end">
                <Button
                  text="Next"
                  color="primary"
                  size="md"
                  onClick={handleNext}
                  type="button"
                  disabled={!canProceedStep1}
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
                  {services.map((service) => (
                    <div key={service.name} className="service-price-item">
                      <label htmlFor={service.name}>{service.name}</label>
                      <Input
                        id={service.name}
                        name={service.name}
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        value={service.price}
                        onChange={(e) =>
                          handleServicePriceChange(e, service.name)
                        }
                      />
                    </div>
                  ))}
                </div>
              </section>
              <div className="auth-actions">
                <Button
                  text="Back"
                  color="secondary"
                  onClick={handleBack}
                  size="md"
                  type="button"
                />
                <Button
                  text={isSubmitting ? "Creating Account..." : "Create Account"}
                  color="primary"
                  type="submit"
                  size="md"
                  disabled={isSubmitting || !canSubmitStep2}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
