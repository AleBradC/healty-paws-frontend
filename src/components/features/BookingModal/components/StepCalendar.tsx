import { type FC } from "react";
import type { Doctor, Slot } from "../../../../types";
import { Calendar } from "../../../ui/Calendar/Calendar";
import { format } from "date-fns";
import "../styles.css";

interface StepCalendarProps {
  doctor: Doctor;
  selectedSlot: Slot | null;
  onSelect: (slot: Slot) => void;
}

export const StepCalendar: FC<StepCalendarProps> = ({
  doctor,
  selectedSlot,
  onSelect,
}) => {
  const bookedSlots = new Set(
    (doctor.appointments ?? [])
      .filter((appointment) => !["Cancelled", "Denied"].includes(appointment.status || ""))
      .map((appointment) => {
        const dateObj = new Date(appointment.datetime);
        const date = format(dateObj, "yyyy-MM-dd");
        const time = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${date} ${time}`;
      })
  );

  const availability: Record<string, Record<string, string>> =
    doctor.availabilities?.reduce((acc, avail) => {
      const dateObj = new Date(avail.available_datetime);
      const date = format(dateObj, "yyyy-MM-dd");
      const time = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      if (dateObj < new Date() || bookedSlots.has(`${date} ${time}`)) {
        return acc;
      }
      if (!acc[date]) acc[date] = {};
      acc[date][time] = avail.available_datetime;
      return acc;
    }, {} as Record<string, Record<string, string>>) ?? {};

  return (
    <Calendar
      availability={availability}
      selectedSlot={selectedSlot}
      onSelectSlot={(date: string, time: string, datetime?: string) =>
        onSelect({ date, time, datetime: datetime || "" })
      }
    />
  );
};
