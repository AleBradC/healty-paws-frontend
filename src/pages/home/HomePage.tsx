import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../context/AuthenticationContext";
import { Button } from "../../components/Button/Button";
import { TestimonialCard } from "../../components/TestimonialCard/TestimonialCard";
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
          <h1 className="home-title">
            Caring for your pets, anytime, anywhere
          </h1>
          <p className="home-kicker">About the App</p>
          <ul className="home-features">
            <li>Manage appointments</li>
            <li>Connect patients with doctors</li>
            <li>Store medical history</li>
            <li>24/7 support</li>
          </ul>
        </div>
        <div className="home-hero-right">
          <img
            src="/doctor-cat.png"
            alt="Veterinarian with cats illustration"
            width={360}
            height={420}
            className="home-hero-image"
          />
        </div>
      </section>

      {showCta && (
        <section className="home-cta-section">
          <h2 className="home-section-title">Get Started</h2>
          <div className="home-cta-buttons">
            <Button
              onClick={() => handleRedirect(authRegisterDoctorPath)}
              text="Register as Doctor"
              color="primary"
              size="md"
            />
            <Button
              onClick={() => handleRedirect(authRegisterPatientPath)}
              text="Register as Patient"
              color="accent"
              size="md"
            />
          </div>
        </section>
      )}

      <section className="home-testimonials">
        <h2 className="home-section-title">What our users say</h2>
        <div className="home-testimonial-grid">
          {testimonials.map(({ text, author }, i) => (
            <TestimonialCard key={i} text={text} author={author} />
          ))}
        </div>
      </section>
    </div>
  );
}
