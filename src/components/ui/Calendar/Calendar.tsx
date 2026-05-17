import { useState, type FC } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { generateTimeSlots } from "./utils";
import type { Slot } from "../../../types";
import "./styles.css";

interface CalendarProps {
  availability: Record<string, string[] | Record<string, string>>;
  onSelectSlot: (date: string, time: string, iso?: string) => void;
  onSelectAll?: (date: string, slots: string[]) => void;
  onClearAll?: (date: string) => void;
  selectedSlot?: Slot | null;
  isEditable?: boolean;
}

const workdaySlots = generateTimeSlots(9, 18, 30);

export const Calendar: FC<CalendarProps> = ({
  availability,
  onSelectSlot,
  onSelectAll,
  onClearAll,
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
          className="custom-day-picker"
        />
      </div>

      <div className="time-slots-container">
        <h4 className="slots-header">
          <span className="header-text">
            {selectedDay
              ? `Available Slots for ${format(selectedDay, "MMMM do, yyyy")}`
              : "Select a day to see slots"}
          </span>
          {isEditable && selectedDay && (onSelectAll || onClearAll) && (
            <div className="slots-controls">
              {onSelectAll && (
                <button
                  type="button"
                  className="control-btn select-all"
                  onClick={() => {
                    const allFutureSlots = workdaySlots.filter((time) => {
                      const [hour, minute] = time.split(":").map(Number);
                      const t = new Date(selectedDay);
                      t.setHours(hour, minute, 0, 0);
                      return t >= new Date();
                    });
                    onSelectAll(formattedDate, allFutureSlots);
                  }}
                >
                  Select All
                </button>
              )}
              {onClearAll && (
                <button
                  type="button"
                  className="control-btn clear-all"
                  onClick={() => onClearAll(formattedDate)}
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </h4>

        {selectedDay && (
          <div className="time-slots-grid">
            {workdaySlots.map((time) => {
              const [hour, minute] = time.split(":").map(Number);
              const slotTime = new Date(selectedDay);
              slotTime.setHours(hour, minute, 0, 0);
              const isPastSlot = slotTime < new Date();

              const isAvailable = Array.isArray(availableSlotsForDay)
                ? (availableSlotsForDay as string[]).includes(time)
                : !!(availableSlotsForDay as Record<string, string>)[time];
              const isBookingSelected =
                !isEditable &&
                isAvailable &&
                selectedSlot?.date === formattedDate &&
                selectedSlot?.time === time;
              const isEditSelected = isEditable && isAvailable;

              const isSlotDisabled = isPastSlot || (!isEditable && !isAvailable);

              return (
                <button
                  key={time}
                  disabled={isSlotDisabled}
                  className={`time-slot ${
                    isEditable && !isSlotDisabled ? "editable" : ""
                  } ${isAvailable ? "available" : ""} ${
                    isBookingSelected || isEditSelected ? "selected" : ""
                  }`}
                  onClick={() => {
                    const iso = Array.isArray(availableSlotsForDay)
                      ? ""
                      : (availableSlotsForDay as Record<string, string>)[time];
                    onSelectSlot(formattedDate, time, iso);
                  }}
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
