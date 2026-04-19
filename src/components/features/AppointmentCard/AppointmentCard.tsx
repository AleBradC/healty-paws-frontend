import { type MouseEvent, type FC } from "react";
import { getAppointmentDisplayStatus } from "../../../utils/appointment-status";
import "./styles.css";

interface AppointmentCardProps {
  id: string | number;
  status: string;
  doctorName?: string;
  petName: string;
  date: string;
  time: string;
  datetime: string;
  isDisabled?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onAccept?: () => void;
  onDeny?: () => void;
}

export const AppointmentCard: FC<AppointmentCardProps> = ({
  status: baseStatus,
  doctorName,
  petName,
  date,
  time,
  datetime,
  isDisabled: manuallyDisabled = false,
  onClick,
  onDelete,
  onAccept,
  onDeny,
}) => {
  const displayStatus = getAppointmentDisplayStatus(baseStatus, datetime);
  
  // Terminal states (Cancel, Declined) or waiting states (Upcoming, Confirmed) are disabled for consultation access.
  const isPending = baseStatus === "Pending";
  const isUpcoming = displayStatus === "Upcoming";
  const isConfirmed = displayStatus === "Confirmed";
  const isTerminal = ["Cancel", "Declined"].includes(baseStatus);
  
  const statusDisabled = isUpcoming || isConfirmed || isTerminal;
  const isDisabled = manuallyDisabled || statusDisabled;

  const statusClass = `status-${displayStatus.toLowerCase()}`;
  const cardClasses = `appointment-card ${statusClass} ${onClick && !isDisabled ? "clickable" : ""} ${
    isDisabled ? "disabled" : ""
  }`;

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleActionClick = (e: MouseEvent<HTMLButtonElement>, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };

  // Only show delete button if it's NOT in 'Begin' phase and not currently in action phase
  const showDelete = onDelete && displayStatus !== "Begin" && !onAccept && !onDeny;

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
        <span className="appointment-status">{displayStatus}</span>
        
        {/* Approve/Deny Buttons for Doctors on Pending status */}
        {isPending && (onAccept || onDeny) && (
          <div className="lifecycle-actions">
            {onAccept && (
              <button 
                className="action-btn accept" 
                onClick={(e) => handleActionClick(e, onAccept)}
              >
                Accept
              </button>
            )}
            {onDeny && (
              <button 
                className="action-btn deny" 
                onClick={(e) => handleActionClick(e, onDeny)}
              >
                Decline
              </button>
            )}
          </div>
        )}

        {showDelete && (
          <button
            onClick={handleDeleteClick}
            className="delete-appointment-btn"
            aria-label="Cancel appointment"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};
