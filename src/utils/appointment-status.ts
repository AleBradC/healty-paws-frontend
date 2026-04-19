import {
  isAfter,
  isBefore,
  addHours,
  subMinutes,
} from "date-fns";

/**
 * Calculates the dynamic display status of an appointment based on timing logic.
 *
 * Logic:
 * - If status is not 'Confirmed', return the base status.
 * - If it's more than 2h before: 'Confirmed'
 * - If it's between 5m and 2h before: 'Upcoming' (Disabled in UI)
 * - If it's between 5m before and 1h after: 'Begin' (Active/Pulse in UI)
 * - If it's more than 1h after and base status was 'Confirmed', we currently keep 'Confirmed' or handle terminal states.
 */
export const getAppointmentDisplayStatus = (
  baseStatus: string | null | undefined,
  datetime: string | Date
): string => {
  if (!baseStatus) return "Pending";
  
  // Transitions only apply to 'Confirmed' appointments in this lifecycle
  if (baseStatus !== "Confirmed") return baseStatus;

  const appDate = new Date(datetime);
  const now = new Date();

  // 1. Upcoming Check (5m to 2h before)
  const upcomingStart = subMinutes(appDate, 120); // 2h before
  const upcomingEnd = subMinutes(appDate, 5); // 5m before

  if (isAfter(now, upcomingStart) && isBefore(now, upcomingEnd)) {
    return "Upcoming";
  }

  // 2. Start Check (5m before to 1h after)
  const startWindow = subMinutes(appDate, 5); // 5m before
  const endWindow = addHours(appDate, 1); // 1h after

  if (isAfter(now, startWindow) && isBefore(now, endWindow)) {
    return "Begin";
  }

  return baseStatus;
};
