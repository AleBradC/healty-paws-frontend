import { useState, type FC } from "react";
import { Button } from "../../ui/Button/Button";
import { Calendar } from "../../ui/Calendar/Calendar";
import { Modal } from "../../ui/Modal/Modal";
import "./styles.css";

export interface Availability {
  [date: string]: string[];
}

interface AvailabilityModalProps {
  initialAvailability: Availability;
  onSave: (newAvailability: Availability) => void;
  onClose: () => void;
}

export const AvailabilityModal: FC<AvailabilityModalProps> = ({
  initialAvailability,
  onSave,
  onClose,
}) => {
  const [availability, setAvailability] =
    useState<Availability>(initialAvailability);

  const normalizeAvailability = (value: Availability) =>
    JSON.stringify(
      Object.keys(value)
        .sort()
        .reduce<Availability>((acc, date) => {
          acc[date] = [...value[date]].sort();
          return acc;
        }, {})
    );

  const hasChanges =
    normalizeAvailability(availability) !==
    normalizeAvailability(initialAvailability);

  const handleSlotToggle = (date: string, time: string) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      const daySlots = newAvailability[date] || [];
      const isSlotSelected = daySlots.includes(time);

      if (isSlotSelected) {
        newAvailability[date] = daySlots.filter((slot) => slot !== time);
      } else {
        newAvailability[date] = [...daySlots, time].sort();
      }

      if (newAvailability[date].length === 0) {
        delete newAvailability[date];
      }

      return newAvailability;
    });
  };

  const handleSaveChanges = () => {
    onSave(availability);
    onClose();
  };

  const footer = (
    <>
      <Button text="Cancel" color="secondary" size="md" onClick={onClose} />
      <Button
        text="Save Changes"
        color="primary"
        size="md"
        onClick={handleSaveChanges}
        disabled={!hasChanges}
      />
    </>
  );

  return (
    <Modal
      title="Manage Your Availability"
      onClose={onClose}
      footerContent={footer}
    >
      <Calendar
        availability={availability}
        onSelectSlot={handleSlotToggle}
        isEditable={true}
      />
    </Modal>
  );
};
