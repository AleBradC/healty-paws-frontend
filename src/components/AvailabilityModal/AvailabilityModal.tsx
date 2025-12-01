import React, { useState, type FC } from "react";
import { Button } from "../Button/Button";
import { Calendar } from "../Calendar/Calendar";
import { Modal } from "../Modal/Modal";
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
