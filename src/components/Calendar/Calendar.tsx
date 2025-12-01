import React, { useState, type FC } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { generateTimeSlots } from "./utils";
import type { Slot } from "../../types";
import "./styles.css";

interface CalendarProps {
  availability: Record<string, string[]>;
  onSelectSlot: (date: string, time: string) => void;
  selectedSlot?: Slot | null;
  isEditable?: boolean;
}

const workdaySlots = generateTimeSlots(9, 17, 30);

export const Calendar: FC<CalendarProps> = ({
  availability,
  onSelectSlot,
  selectedSlot,
  isEditable = false,
}) => {
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const today = new Date();

  const formattedDate = selectedDay ? format(selectedDay, "yyyy-MM-dd") : "";
  const availableSlotsForDay = availability[formattedDate] || [];

  return (
    <div className="full-calendar-wrapper">
      <div className="calendar-component-container">
        <DayPicker
          mode="single"
          required
          selected={selectedDay}
          onSelect={setSelectedDay}
          month={month}
          onMonthChange={setMonth}
          disabled={{ before: today }}
          footer={
            <p className="calendar-footer">
              You can select any day from today onwards.
            </p>
          }
          className="custom-day-picker"
        />
      </div>

      <div className="time-slots-container">
        <h4 className="slots-header">
          {selectedDay
            ? `Available Slots for ${format(selectedDay, "MMMM do, yyyy")}`
            : "Select a day to see slots"}
        </h4>

        {selectedDay && (
          <div className="time-slots-grid">
            {workdaySlots.map((time) => {
              const isAvailable = availableSlotsForDay.includes(time);
              const isBookingSelected =
                selectedSlot?.date === formattedDate &&
                selectedSlot?.time === time;
              const isEditSelected = isEditable && isAvailable;

              return (
                <button
                  key={time}
                  disabled={!isEditable && !isAvailable}
                  className={`time-slot ${isEditable ? "editable" : ""} ${
                    isAvailable ? "available" : ""
                  } ${isBookingSelected || isEditSelected ? "selected" : ""}`}
                  onClick={() => onSelectSlot(formattedDate, time)}
                  type="button"
                >
                  {time}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
