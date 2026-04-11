import { type FC } from "react";
import type { Specialization } from "../../../../types";
import "../styles.css";

interface StepSelectSpecializationProps {
  specializations: Specialization[];
  selectedSpecialization: string | null;
  onSelect: (specializationId: string) => void;
}

export const StepSelectSpecialization: FC<StepSelectSpecializationProps> = ({
  specializations,
  selectedSpecialization,
  onSelect,
}) => (
  <div className="selection-group">
    <h3>Select a Specialization</h3>
    <div className="toggle-list">
      {specializations.map((spec) => (
        <button
          key={spec.id}
          className={`toggle-item ${
            selectedSpecialization === spec.id ? "selected" : ""
          }`}
          onClick={() => onSelect(spec.id)}
        >
          {spec.name}
        </button>
      ))}
    </div>
  </div>
);
