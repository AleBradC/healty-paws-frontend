import { type FC } from "react";
import "../styles.css";
import type { Doctor, Pet, Slot } from "../../../../types";

interface StepConfirmationProps {
  doctor: Doctor;
  pet: Pet;
  slot: Slot;
  total: number;
}

export const StepConfirmation: FC<StepConfirmationProps> = ({
  doctor,
  pet,
  slot,
  total,
}) => (
  <div className="confirmation-view">
    <h3>Appointment Confirmed!</h3>
    <p>
      <strong>Doctor:</strong> {doctor.name}
    </p>
    <p>
      <strong>Pet:</strong> {pet.name}
    </p>
    <p>
      <strong>Date & Time:</strong> {slot?.date} at {slot?.time}
    </p>
    <p>
      <strong>Total Cost:</strong> ${total.toFixed(2)}
    </p>
  </div>
);
