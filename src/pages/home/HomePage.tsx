import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../context/AuthenticationContext";
import { Button } from "../../components/ui/Button/Button";
import { TestimonialCard } from "../../components/features/TestimonialCard/TestimonialCard";
import {
  authRegisterDoctorPath,
  authRegisterPatientPath,
} from "../../utils/path";
import "./styles.css";

const testimonials = [
  {
    text: "“Booking a visit for Luna took less than a minute. Love the reminders!”",
    author: "Andrei, pet parent",
  },
  {
    text: "“Seamless scheduling and patient history in one place. Super helpful.”",
    author: "Dr. Ionescu, veterinarian",
  },
  {
    text: "“24/7 support gave us peace of mind during a late-night scare.”",
    author: "Maria, pet parent",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuthentication();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  const showCta = isMounted && !isLoading && !isLoggedIn;

  return (
    <div className="home-wrapper">
      <section className="home-hero">
        <div className="home-hero-left">
          <p className="home-kicker">Next-Gen Veterinary Care</p>
          <h1 className="home-title">
            Caring for your pets, anytime, anywhere.
          </h1>
          <ul className="home-features">
            <li>Manage appointments seamlessly</li>
            <li>Connect patients with top doctors</li>
            <li>Securely store medical histories</li>
            <li>Access 24/7 emergency support</li>
          </ul>
          
          {showCta && (
            <div className="home-hero-cta">
              <Button
                onClick={() => handleRedirect(authRegisterPatientPath)}
                text="Join as a Pet Parent"
                color="primary"
                size="lg"
              />
            </div>
          )}
        </div>
        <div className="home-hero-right">
          <img
            src="/doctor-cat.png"
            alt="Veterinarian with cats illustration"
            className="home-hero-image"
          />
        </div>
      </section>

      {showCta && (
        <section className="home-cta-section">
          <h2 className="home-section-title">Are you a Veterinary Professional?</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Join our network of top-rated vet clinics and manage your schedule, patient records, and appointments in one place.
          </p>
          <div className="home-cta-buttons">
            <Button
              onClick={() => handleRedirect(authRegisterDoctorPath)}
              text="Register as Doctor"
              color="accent"
              size="lg"
            />
          </div>
        </section>
      )}

      <section className="home-testimonials">
        <h2 className="home-section-title">What our community says</h2>
        <div className="home-testimonial-grid">
          {testimonials.map(({ text, author }, i) => (
            <TestimonialCard key={i} text={text} author={author} />
          ))}
        </div>
      </section>
    </div>
  );
}
