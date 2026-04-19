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

  const isCancel = displayStatus === "Cancel";
  const isDeclined = displayStatus === "Declined";
  const isUpcoming = displayStatus === "Upcoming";
  const isPending = displayStatus === "Pending";
  const isConfirmed = displayStatus === "Confirmed";
  const isAccepted = displayStatus === "Accepted";
  const isBegin = displayStatus === "Begin";
  const isCompleted = displayStatus === "Completed";
  
  // Disable logic: Cancel/Declined terminal states are always disabled for consultation access.
  // Upcoming/Confirmed are disabled until the Begin window opens (<5m).
  const isDisabled = manuallyDisabled || isUpcoming || isConfirmed || isCancel || isDeclined;

  // Show cancel (X) button for Pending (Patient only), Confirmed, and Upcoming.
  // Hide it if lifecycle actions (Accept/Decline) are active to avoid UI clutter.
  // Hide it during the 'Begin' phase as per specific rule.
  const isLifecycleActive = isPending && onAccept && onDeny;
  const showActions = (isPending || isConfirmed || isAccepted || isUpcoming) && onDelete && !isLifecycleActive && !isBegin;

  const isTerminal = ["Cancel", "Declined"].includes(baseStatus);
  
  const statusDisabled = isUpcoming || isConfirmed || isTerminal;
  const isDisabled = forceDisabled || statusDisabled;

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
        ) : (
          <span className={`appointment-status ${statusClass}`}>
            {displayStatus}
          </span>
        )}
      </div>
    </div>
  );
};
