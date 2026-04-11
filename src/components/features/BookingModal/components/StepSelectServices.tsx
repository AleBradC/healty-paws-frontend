import { type FC } from "react";
import type { Service } from "../../../../types";
import "../styles.css";

interface StepSelectServicesProps {
  services: Service[];
  selectedServices: string[];
  onToggle: (services: string[]) => void;
}

export const StepSelectServices: FC<StepSelectServicesProps> = ({
  services,
  selectedServices,
  onToggle,
}) => (
  <div className="selection-group">
    <h3>Select Services</h3>
    <div className="service-list">
      {services.map((s) => (
        <div
          key={s.id}
          className={`service-item ${
            selectedServices.includes(s.id) ? "selected" : ""
          }`}
          onClick={() =>
            onToggle(
              selectedServices.includes(s.id)
                ? selectedServices.filter((id) => id !== s.id)
                : [...selectedServices, s.id]
            )
          }
        >
          <span>{s.name}</span>
          <span className="service-price">${s.price.toFixed(2)}</span>
        </div>
      ))}
      {services.length === 0 && (
        <p>No services available for this specialization.</p>
      )}
    </div>
  </div>
);
