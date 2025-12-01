import React, { type FC } from "react";
import type { Doctor, Slot } from "../../../types";
import { Calendar } from "../../Calendar/Calendar";
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
  const availability: Record<string, string[]> =
    doctor.availabilities?.reduce((acc, avail) => {
      const dateObj = new Date(avail.available_datetime);
      const date = format(dateObj, "yyyy-MM-dd");
      const time = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(time);
      return acc;
    }, {} as Record<string, string[]>) ?? {};

  return (
    <Calendar
      availability={availability}
      selectedSlot={selectedSlot}
      onSelectSlot={(date: any, time: any) => onSelect({ date, time })}
    />
  );
};
