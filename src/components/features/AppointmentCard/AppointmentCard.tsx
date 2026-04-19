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

  // Clickability logic: Only clickable if it's Begin (Consultation) or Completed (Summary).
  const isNavigable = isBegin || isCompleted;
  const cardClasses = `appointment-card ${statusClass} ${
    onClick && isNavigable ? "clickable" : ""
  } ${(!isNavigable && !isPending) ? "disabled" : ""}`;

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleAction = (e: MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };

  return (
    <div className={cardClasses} onClick={isNavigable ? onClick : undefined}>
      {showActions && (
        <button
          onClick={handleDeleteClick}
          className="delete-appointment-btn"
          aria-label="Cancel appointment"
        >
          &times;
        </button>
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
        {isPending && onAccept && onDeny ? (
          <div className="lifecycle-actions">
            <Button
              text="Accept"
              size="sm"
              color="primary"
              onClick={(e) => handleAction(e, onAccept)}
            />
            <Button
              text="Decline"
              size="sm"
              color="secondary"
              onClick={(e) => handleAction(e, onDeny)}
            />
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
