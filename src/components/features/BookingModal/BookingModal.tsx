import { useState, useMemo, type FC } from "react";
import type { queryInput } from "../../../lib/graphql/appointments/useCreateAppointment";
import { useDoctors } from "../../../lib/graphql/doctors/useDoctors";
import type { Doctor, Pet, Slot, Service } from "../../../types";
import type { AppointmentStatus } from "../../../generated/graphql";
import { DOCTORS_PER_PAGE } from "../../../utils/constants";
import { Button } from "../../ui/Button/Button";
import { Loading } from "../../ui/Loading/Loading";
import { Modal } from "../../ui/Modal/Modal";
import { StepCalendar } from "./components/StepCalendar";
import { StepConfirmation } from "./components/StepConfirmation";
import { StepSelectDoctor } from "./components/StepSelectDoctor";
import { StepSelectPet } from "./components/StepSelectPet";
import { StepSelectServices } from "./components/StepSelectServices";
import { StepSelectSpecialization } from "./components/StepSelectSpecialization";
import "./styles.css";

interface BookingModalProps {
  doctor?: Doctor | null;
  isLoading?: boolean;
  pets: Pet[];
  showStepSelectDoctor?: boolean;
  onClose: () => void;
  onDoctorSelect?: (doctor: Doctor) => void;
  onBookingSave: (bookingData: queryInput) => Promise<void>;
}

export const BookingModal: FC<BookingModalProps> = ({
  doctor: selectedDoctor,
  isLoading,
  pets,
  onClose,
  showStepSelectDoctor,
  onDoctorSelect,
  onBookingSave,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState<
    string | null
  >(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const skip = (currentPage - 1) * DOCTORS_PER_PAGE;
  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
  } = useDoctors(DOCTORS_PER_PAGE, skip);

  const doctorsForPage = doctors?.items || [];
  const totalCount = doctors?.totalCount || 0;

  const doctorSpecializations = useMemo(() => {
    return selectedDoctor?.specializations || [];
  }, [selectedDoctor]);

  const servicesForSelectedSpec: Service[] = useMemo(() => {
    if (!selectedSpecializationId) return [];
    const specialization = doctorSpecializations.find(
      (spec) => spec.id === selectedSpecializationId
    );
    return specialization?.services ?? [];
  }, [selectedSpecializationId, doctorSpecializations]);

  const totalCost: number = useMemo(() => {
    return selectedServices.reduce((total, serviceId) => {
      const service = servicesForSelectedSpec.find((s) => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  }, [selectedServices, servicesForSelectedSpec]);

  const workflow: string[] = useMemo(() => {
    const baseFlow = [
      "selectPet",
      "selectSpecialization",
      "selectServices",
      "calendar",
      "confirmation",
    ];
    if (showStepSelectDoctor)
      return ["selectPet", "selectDoctor", ...baseFlow.slice(1)];
    return baseFlow;
  }, [showStepSelectDoctor]);

  if (doctorsLoading && !doctors) {
    return (
      <Modal title="Loading..." onClose={onClose}>
        <Loading
          isLoading={doctorsLoading && !doctors}
          message="Loading..."
          variant="fullscreen"
        />
      </Modal>
    );
  }

  if (doctorsError || (!doctors && !doctorsLoading)) {
    return (
      <Modal title="Error" onClose={onClose}>
        <div className="error-state">
          <p>Failed to load data. Please try again later.</p>
          <Button text="Close" onClick={onClose} size="md" color="secondary" />
        </div>
      </Modal>
    );
  }

  const maxSteps = workflow.length;
  const totalPages = Math.ceil(totalCount / DOCTORS_PER_PAGE);

  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleBookingComplete = async () => {
    if (!selectedDoctor || !selectedPet || !selectedSlot) return;
    setBookingError(null);

    const petDetails = pets.find((p) => p.id === selectedPet);
    const serviceDetails = selectedServices
      .map((serviceId) =>
        servicesForSelectedSpec.find((s) => s.id === serviceId)
      )
      .filter((s): s is Service => s !== undefined);

    const appointmentDatetime = `${selectedSlot.date}T${selectedSlot.time}:00`;

    const bookingInput: queryInput = {
      doctorId: selectedDoctor.id,
      petId: petDetails!.id,
      appointmentDatetime,
      status: "Pending" as AppointmentStatus,
      consultationType:
        serviceDetails.length > 0 ? serviceDetails[0].name : "General",
    };

    try {
      await onBookingSave(bookingInput);
      onClose();
    } catch (error: any) {
      console.error("Booking failed:", error);
      const message = error.message || "Something went wrong. Please try again.";
      setBookingError(message.replace("CombinedGraphQLErrors: ", ""));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const canProceed = (): boolean => {
    if (isLoading) return false;
    const currentStepId = workflow[step - 1];
    switch (currentStepId) {
      case "selectPet":
        return !!selectedPet;
      case "selectDoctor":
        return !!selectedDoctor;
      case "selectSpecialization":
        return !!selectedSpecializationId;
      case "selectServices":
        return selectedServices.length > 0;
      case "calendar":
        return !!selectedSlot;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    const currentStepId = workflow[step - 1];
    switch (currentStepId) {
      case "selectPet":
        return (
          <StepSelectPet
            pets={pets}
            selectedPet={selectedPet}
            onSelect={setSelectedPet}
          />
        );
      case "selectDoctor":
        return (
          <StepSelectDoctor
            selectedDoctor={selectedDoctor}
            onSelect={onDoctorSelect}
            doctors={doctorsForPage as any}
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNext}
            onPrev={handlePrev}
            isLoading={doctorsLoading}
          />
        );
      case "selectSpecialization":
        if (isLoading)
          return (
            <Loading
              isLoading={isLoading}
              message="Loading specializations..."
            />
          );
        if (!selectedDoctor) return <p>Please select a doctor first.</p>;
        return (
          <StepSelectSpecialization
            specializations={doctorSpecializations}
            selectedSpecialization={selectedSpecializationId}
            onSelect={setSelectedSpecializationId}
          />
        );
      case "selectServices":
        if (!selectedSpecializationId)
          return <p>Please select a specialization first.</p>;
        return (
          <StepSelectServices
            services={servicesForSelectedSpec}
            selectedServices={selectedServices}
            onToggle={setSelectedServices}
          />
        );
      case "calendar":
        if (isLoading)
          return (
            <Loading isLoading={isLoading} message="Loading Schedule..." />
          );
        if (!selectedDoctor) return <p>Please select a doctor first.</p>;
        return (
          <StepCalendar
            doctor={selectedDoctor}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        );
      case "confirmation":
        if (!selectedDoctor || !selectedPet || !selectedSlot) return null;
        return (
          <StepConfirmation
            doctor={selectedDoctor}
            pet={pets.find((p) => p.id === selectedPet)!}
            slot={selectedSlot}
            total={totalCost}
          />
        );
      default:
        return null;
    }
  };

  const footerContent = (
    <>
      {selectedServices.length > 0 && (
        <div className="total-cost">
          Total: <strong>${totalCost.toFixed(2)}</strong>
        </div>
      )}
      <div className="footer-buttons">
        {step > 1 && (
          <Button
            text="Back"
            color="secondary"
            size="md"
            onClick={() => setStep((s) => s - 1)}
          />
        )}
        {step < maxSteps ? (
          <Button
            text={step === maxSteps - 1 ? "Confirm Appointment" : "Next"}
            color="primary"
            size="md"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
          />
        ) : (
          <Button
            text="Done"
            size="md"
            color="primary"
            onClick={handleBookingComplete}
          />
        )}
      </div>
    </>
  );

  return (
    <Modal
      title={
        isLoading
          ? "Loading..."
          : step === maxSteps
          ? "Confirmation"
          : selectedDoctor
          ? `Book with ${selectedDoctor.name}`
          : "Book an Appointment"
      }
      onClose={onClose}
      footerContent={footerContent}
    >
      {bookingError && (
        <div className="booking-error-feedback">
          {bookingError}
        </div>
      )}
      {renderStepContent()}
    </Modal>
  );
};
