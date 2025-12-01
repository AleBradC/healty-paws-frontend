import React, { type FC } from "react";
import type { Pet } from "../../../types";
import "../styles.css";

interface StepSelectPetProps {
  pets: Pet[];
  selectedPet: string | null;
  onSelect: (petId: string) => void;
}

export const StepSelectPet: FC<StepSelectPetProps> = ({
  pets,
  selectedPet,
  onSelect,
}) => (
  <div className="selection-group">
    <h3>1. Select Your Pet</h3>
    <p className="modal-note">
      Please note: For multiple pets, complete the booking for each one
      individually.
    </p>
    <div className="toggle-list">
      {pets.map((p) => (
        <button
          key={p.id}
          className={`toggle-item ${selectedPet === p.id ? "selected" : ""}`}
          onClick={() => onSelect(p.id)}
        >
          {p.name}
        </button>
      ))}
    </div>
  </div>
);
