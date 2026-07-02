import { isAfter, isBefore, addHours, subMinutes } from "date-fns";

export const getAppointmentDisplayStatus = (
  baseStatus: string | null | undefined,
  datetime: string | Date,
): string => {
  if (!baseStatus) return "Pending";

  if (baseStatus !== "Confirmed") return baseStatus;

  const appDate = new Date(datetime);
  const now = new Date();

  const upcomingStart = subMinutes(appDate, 120);
  const upcomingEnd = subMinutes(appDate, 5);

  if (isAfter(now, upcomingStart) && isBefore(now, upcomingEnd)) {
    return "Upcoming";
  }

  const startWindow = subMinutes(appDate, 5);
  const endWindow = addHours(appDate, 1);

  if (isAfter(now, startWindow) && isBefore(now, endWindow)) {
    return "Start";
  }

  return baseStatus;
};
