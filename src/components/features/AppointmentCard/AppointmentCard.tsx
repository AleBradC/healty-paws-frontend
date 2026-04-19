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
  datetime: string; // ISO string for precise status calculation
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
  
  const isPending = baseStatus.toLowerCase() === "pending";
  const isUpcoming = displayStatus.toLowerCase() === "upcoming";
  const isStart = displayStatus.toLowerCase() === "start";
  const isCancelled = baseStatus.toLowerCase() === "cancelled";
  const isDenied = baseStatus.toLowerCase() === "denied";

  const showActions = isPending && (onAccept || onDeny);
  const statusClass = `status-${displayStatus.toLowerCase()}`;
  
  // Card is effectively disabled if it's Upcoming (too soon to start but confirmed)
  // or if manually disabled, or if it's already cancelled/denied.
  const isDisabled = manuallyDisabled || isUpcoming || isCancelled || isDenied;

  const cardClasses = `appointment-card ${statusClass} ${
    onClick && !isDisabled ? "clickable" : ""
  } ${isDisabled || showActions ? "disabled" : ""}`;

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleActionClick = (
    e: MouseEvent<HTMLButtonElement>,
    action?: () => void
  ) => {
    e.stopPropagation();
    action?.();
  };

  const isCancellable = ["confirmed", "upcoming", "pending"].includes(
    baseStatus.toLowerCase()
  );

  return (
    <div
      className={cardClasses}
      onClick={isDisabled || showActions ? undefined : onClick}
    >
      <div className="appointment-details">
        <span className="primary-name">{doctorName}</span>
        <span className="secondary-name">For: {petName}</span>
      </div>
      <div className="appointment-time">
        <span>{date}</span>
        <span>{time}</span>
      </div>

      <div className="appointment-actions-container">
        {showActions ? (
          <div className="overlay-actions inline">
            {onAccept && (
              <button
                className="action-btn accept-btn"
                onClick={(e) => handleActionClick(e, onAccept)}
              >
                Accept
              </button>
            )}
            {onDeny && (
              <button
                className="action-btn deny-btn"
                onClick={(e) => handleActionClick(e, onDeny)}
              >
                Deny
              </button>
            )}
          </div>
        ) : (
          <div className="appointment-status-wrapper">
            <span className="appointment-status">{displayStatus}</span>
          </div>
        )}
      </div>

      {onDelete && isCancellable && !showActions && (
        <button
          onClick={handleDeleteClick}
          className="delete-appointment-btn"
          aria-label="Cancel appointment"
        >
          &times;
        </button>
      )}
    </div>
  );
};
