import type { AppointmentStatus } from "../generated/graphql";

/**
 * Calculates the logical display status of an appointment based on its
 * base status and the current time.
 * 
 * Flow:
 * - < 2h before: status becomes 'Upcoming' (if base status is Confirmed)
 * - < 5m before: status becomes 'Start' (if base status is Confirmed)
 */
export const getAppointmentDisplayStatus = (
  baseStatus: AppointmentStatus | string | null | undefined,
  datetime: string
): string => {
  if (!baseStatus) return "Pending";
  
  // Transitions only apply to Confirmed appointments
  if (baseStatus !== "Confirmed" && baseStatus !== "Upcoming" && baseStatus !== "Start") {
    return baseStatus;
  }

  const appointmentDate = new Date(datetime);
  const now = new Date();
  
  // Difference in minutes
  const diffMs = appointmentDate.getTime() - now.getTime();
  const diffMins = diffMs / (1000 * 60);

  // 5 minutes before up to 1 hour after (window for 'Start')
  if (diffMins <= 5 && diffMins >= -60) {
    return "Start";
  }

  // 2 hours before up to 5 minutes before
  if (diffMins <= 120 && diffMins > 5) {
    return "Upcoming";
  }

  return "Confirmed";
};
