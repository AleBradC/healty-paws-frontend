import React, { type FC } from "react";
import { Loading } from "../../Loading/Loading";
import type { Doctor } from "../../../types";
import { Button } from "../../Button/Button";
import "../styles.css";

interface StepSelectDoctorProps {
  selectedDoctor: Doctor | null | undefined;
  onSelect?: (doctor: Doctor) => void;
  doctors?: Doctor[];
  currentPage?: number;
  totalPages?: number;
  onNext?: () => void;
  onPrev?: () => void;
  isLoading?: boolean;
}

export const StepSelectDoctor: FC<StepSelectDoctorProps> = ({
  selectedDoctor,
  onSelect,
  doctors,
  currentPage,
  totalPages,
  onNext,
  onPrev,
  isLoading,
}) => {
  return (
    <div className="selection-group">
      <h3>2. Choose a Doctor</h3>

      <div className="doctor-selection-container">
        <div className="doctor-loading-overlay-wrapper">
          <Loading isLoading={isLoading || false} minDuration={500} />
        </div>

        <div
          className={`doctor-selection-list ${
            isLoading ? "content-dimmed" : ""
          }`}
        >
          {doctors?.map((doctor: Doctor) => (
            <button
              key={doctor.id}
              disabled={isLoading}
              className={`doctor-select-item ${
                selectedDoctor?.id === doctor.id ? "selected" : ""
              }`}
              onClick={() => onSelect?.(doctor)}
            >
              <span className="doctor-name">{doctor.name}</span>
              <span className="doctor-specializations">
                {doctor.specializations?.map((s) => s.name).join(", ")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pagination-bar">
        <Button
          className="pagination-btn"
          onClick={onPrev}
          disabled={currentPage === 1 || isLoading}
          text="Prev"
        />
        <span className="pagination-current">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          className="pagination-btn"
          onClick={onNext}
          disabled={currentPage === totalPages || isLoading}
          text="Next"
        />
      </div>
    </div>
  );
};
