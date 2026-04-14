import { type MouseEvent, type FC } from "react";
import "./styles.css";

interface AppointmentCardProps {
  id: string | number;
  status: string;
  doctorName?: string;
  petName: string;
  date: string;
  time: string;
  isDisabled?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export const AppointmentCard: FC<AppointmentCardProps> = ({
  status,
  doctorName,
  petName,
  date,
  time,
  isDisabled = false,
  onClick,
  onDelete,
}) => {
  const statusClass = `status-${status.toLowerCase()}`;
  const cardClasses = `appointment-card ${statusClass} ${onClick ? "clickable" : ""} ${
    isDisabled ? "disabled" : ""
  }`;

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className={cardClasses} onClick={isDisabled ? undefined : onClick}>
      <div className="appointment-details">
        <span className="primary-name">{doctorName}</span>
        <span className="secondary-name">For: {petName}</span>
      </div>
      <div className="appointment-time">
        <span>{date}</span>
        <span>{time}</span>
      </div>
      <div className="appointment-status-wrapper">
        <span className="appointment-status">{status}</span>
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="delete-appointment-btn"
            aria-label="Delete appointment"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};
