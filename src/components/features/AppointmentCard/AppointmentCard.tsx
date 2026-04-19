import { type MouseEvent, type FC } from "react";
import { getAppointmentDisplayStatus } from "../../../utils/appointment-status";
import { Button } from "../../ui/Button/Button";
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
  const statusClass = `status-${displayStatus.toLowerCase()}`;

  const isCancelled = displayStatus === "Cancelled";
  const isDenied = displayStatus === "Denied";
  const isUpcoming = displayStatus === "Upcoming";
  const isPending = displayStatus === "Pending";
  const isConfirmed = displayStatus === "Confirmed";
  
  // Disable logic: Cancelled/Denied are always disabled.
  // Upcoming is disabled to prevent premature consultation access.
  const isDisabled = manuallyDisabled || isUpcoming || isCancelled || isDenied;

  // Show cancel (X) button for Pending, Confirmed, and Upcoming
  const showActions = (isPending || isConfirmed || isUpcoming) && onDelete;

  const cardClasses = `appointment-card ${statusClass} ${
    onClick && !isDisabled ? "clickable" : ""
  } ${isDisabled || (isPending && !onDelete) ? "disabled" : ""}`;

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleAction = (e: MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };

  return (
    <div className={cardClasses} onClick={isDisabled ? undefined : onClick}>
      {showActions && (
        <button
          onClick={handleDeleteClick}
          className="delete-appointment-btn"
          aria-label="Cancel appointment"
        >
          &times;
        </button>
      )}

      {isPending && onAccept && onDeny && (
        <div className="lifecycle-actions">
          <Button 
            text="Accept" 
            size="sm" 
            color="primary" 
            onClick={(e) => handleAction(e, onAccept)} 
          />
          <Button 
            text="Deny" 
            size="sm" 
            color="secondary" 
            onClick={(e) => handleAction(e, onDeny)} 
          />
        </div>
      )}

      <div className="appointment-details">
        {doctorName && <span className="primary-name">{doctorName}</span>}
        <span className="secondary-name">For: {petName}</span>
      </div>
      <div className="appointment-time">
        <span>{date}</span>
        <span>{time}</span>
      </div>
      <div className="appointment-status-wrapper">
        <span className={`appointment-status ${statusClass}`}>
          {displayStatus}
        </span>
      </div>
    </div>
  );
};
