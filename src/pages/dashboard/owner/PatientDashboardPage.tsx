import {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { AppointmentCard } from "../../../components/features/AppointmentCard/AppointmentCard";
import { BookingModal } from "../../../components/features/BookingModal/BookingModal";
import { ConditionSummaryCard } from "../../../components/features/ConditionSummaryCard/ConditionSummaryCard";
import { Input } from "../../../components/ui/Input/Input";
import { Modal } from "../../../components/ui/Modal/Modal";
import { ProtectedRoute } from "../../../router/ProtectedRoute/ProtectedRoute";
import { Tabs } from "../../../components/ui/Tabs/Tabs";
import {
  useCreateAppointment,
  type queryInput,
} from "../../../lib/graphql/appointments/useCreateAppointment";
import { useRemoveAppointment } from "../../../lib/graphql/appointments/useRemoveAppointment";
import { useDoctor } from "../../../lib/graphql/doctors/useDoctor";
import { useCreatePet } from "../../../lib/graphql/patients/useCreatePet";
import { useUpdatePet } from "../../../lib/graphql/patients/useUpdatePet";
import { useUpdateOwner } from "../../../lib/graphql/owner/useUpdateOwner";
import type { Pet } from "../../../types";
import { appointmentSummaryPath } from "../../../utils/path";
import { useAuthentication } from "../../../context/AuthenticationContext";
import { Button } from "../../../components/ui/Button/Button";
import { Loading } from "../../../components/ui/Loading/Loading";
import { useOwner } from "../../../lib/graphql/owner/useOwner";
import "./styles.css";

interface Appointment {
  id: string;
  datetime: string;
  status: string;
  doctor: {
    id: string;
    name: string;
  };
  patient: {
    name: string;
  };
}

export default function PatientDashboardPage() {
  const navigate = useNavigate();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState("owner");
  const [ownerDetails, setOwnerDetails] = useState({
    name: "",
  });
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [newPetDetails, setNewPetDetails] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
  });
  const [newPetError, setNewPetError] = useState<string | null>(null);
  const [editPetId, setEditPetId] = useState<string | null>(null);
  const [editPetDetails, setEditPetDetails] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
  });
  const [editPetError, setEditPetError] = useState<string | null>(null);

  const { user } = useAuthentication();
  const {
    owner,
    error: fetchOwnerError,
    refetch: refetchOwner,
  } = useOwner(user?.id ?? null);

  const { createAppointment } = useCreateAppointment();
  const { removeAppointment } = useRemoveAppointment();
  const { createPet } = useCreatePet();
  const { updatePet } = useUpdatePet();
  const { updateOwner } = useUpdateOwner();

  const { doctor: detailedDoctor, loading: detailedDoctorLoading } =
    useDoctor(selectedDoctorId);

  useEffect(() => {
    if (owner) {
      setOwnerDetails({
        name: owner.name ?? "",
      });

      if (owner.pets) {
        const allAppointments = owner.pets.flatMap(
          (pet) => pet.appointments || []
        ) as Appointment[];
        setAppointments(allAppointments);
      }
    }
  }, [owner]);

  useEffect(() => {
    setEditPetError(null);
    if (activeTab !== "owner" && activeTab !== "appointments") {
      const petToEdit = owner?.pets?.find((pet) => pet.id === activeTab);
      if (petToEdit) {
        setEditPetId(petToEdit.id);
        setEditPetDetails({
          name: petToEdit.name ?? "",
          type: petToEdit.type ?? "",
          breed: petToEdit.breed ?? "",
          age: petToEdit.age ? petToEdit.age.toString() : "",
          weight: petToEdit.weight ? petToEdit.weight.toString() : "",
        });
      }
    } else {
      setEditPetId(null);
      setEditPetDetails({ name: "", type: "", breed: "", age: "", weight: "" });
    }
  }, [activeTab, owner?.pets]);

  if (fetchOwnerError) {
    return (
      <div className="dashboard-wrapper">
        Could not load your information. Please try again.
      </div>
    );
  }

  if (!owner) {
    return (
      <Loading
        isLoading={true}
        message="Loading..."
        variant="fullscreen"
        minDuration={1000}
      />
    );
  }

  const pets = owner.pets ?? [];
  const patientTabs = [
    { id: "owner", label: "My Details" },
    ...pets.map((pet) => ({ id: pet.id, label: pet.name })),
    { id: "appointments", label: "Appointments" },
  ];
  const petsForBookingModal = pets.map((pet) => ({
    id: pet.id,
    name: pet.name,
  })) as unknown as Pet[];

  // --- Handlers ---

  const handleOwnerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerDetails((prev) => ({ ...prev, [name]: value }));
    if (ownerError) setOwnerError(null);
  };

  const handleSaveOwnerDetails = async () => {
    if (!owner?.id) return;

    setOwnerError(null);

    const hasChanges = ownerDetails.name !== owner.name;

    if (!hasChanges) {
      return;
    }

    try {
      await updateOwner({
        ownerId: owner.id,
        name: ownerDetails.name,
      });
      await refetchOwner();
    } catch (e) {
      console.error("Failed to update owner", e);
      setOwnerError("Failed to update details. Please try again.");
    }
  };

  const handleNewPetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPetDetails((prev) => ({ ...prev, [name]: value }));
    if (newPetError) setNewPetError(null);
  };

  const handleEditPetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditPetDetails((prev) => ({ ...prev, [name]: value }));
    if (editPetError) setEditPetError(null);
  };

  const validateNewPet = (): boolean => {
    const { name, type, breed, age, weight } = newPetDetails;
    if (!name.trim() || !type.trim() || !breed.trim() || !age || !weight) {
      setNewPetError("Please fill in all required fields.");
      return false;
    }
    if (Number(age) <= 0 || Number(weight) <= 0) {
      setNewPetError("Age and Weight must be greater than 0.");
      return false;
    }
    return true;
  };

  const handleAddNewPet = async (e: FormEvent) => {
    e.preventDefault();
    setNewPetError(null);

    if (!validateNewPet()) return;

    try {
      await createPet({
        ownerId: user?.id ?? "",
        name: newPetDetails.name,
        type: newPetDetails.type,
        breed: newPetDetails.breed,
        age: Number(newPetDetails.age),
        weight: Number(newPetDetails.weight),
      });
      setIsAddPetModalOpen(false);
      setNewPetDetails({ name: "", type: "", breed: "", age: "", weight: "" });
      await refetchOwner();
    } catch (error) {
      console.error("Failed to add new pet:", error);
      setNewPetError("Failed to add pet. Please try again.");
    }
  };

  const validateEditPet = (): boolean => {
    const { name, type, breed, age, weight } = editPetDetails;
    if (!name.trim() || !type.trim() || !breed.trim() || !age || !weight) {
      setEditPetError("Please fill in all required fields.");
      return false;
    }
    if (Number(age) <= 0 || Number(weight) <= 0) {
      setEditPetError("Age and Weight must be greater than 0.");
      return false;
    }
    return true;
  };

  const handleSavePetDetails = async () => {
    if (!editPetId) return;
    setEditPetError(null);

    if (!validateEditPet()) return;

    const originalPet = owner.pets?.find((p) => p.id === editPetId);
    if (!originalPet) return;

    const hasChanges =
      editPetDetails.name !== originalPet.name ||
      editPetDetails.type !== originalPet.type ||
      editPetDetails.breed !== originalPet.breed ||
      Number(editPetDetails.age) !== Number(originalPet.age) ||
      Number(editPetDetails.weight) !== Number(originalPet.weight);

    if (!hasChanges) {
      return;
    }

    try {
      await updatePet({
        petId: editPetId,
        name: editPetDetails.name,
        type: editPetDetails.type,
        breed: editPetDetails.breed,
        age: Number(editPetDetails.age),
        weight: Number(editPetDetails.weight),
      });
      await refetchOwner();
    } catch (error) {
      console.error("Failed to update pet details:", error);
      setEditPetError("Failed to update pet. Please try again.");
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await removeAppointment({
        appointmentId,
      });
      await refetchOwner();
    } catch (error) {
      throw error;
    }
  };

  const handleAppointmentClick = (appointmentId: string | number) => {
    navigate(`${appointmentSummaryPath}/${appointmentId}`);
  };

  const handleOpenBookingModal = () => {
    setSelectedDoctorId(null);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDoctorId(null);
  };

  const handleBookingSave = async (input: queryInput) => {
    try {
      await createAppointment(input);
      await refetchOwner();
    } catch (error) {
      throw error;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">My Dashboard</h1>
        <Tabs
          tabs={patientTabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
        <div className="dashboard-content">
          {activeTab === "owner" && (
            <form className="profile-form">
              <h2 className="section-title">My Information</h2>

              {ownerError && <p className="global-error">{ownerError}</p>}

              <Input
                name="name"
                label="My Name"
                value={ownerDetails.name}
                onChange={handleOwnerChange}
              />
              <Input
                name="email"
                label="My Email"
                defaultValue={owner.email ?? ""}
                readOnly
              />
              <div className="form-actions aligned-end">
                <Button
                  text="Add New Pet"
                  color="secondary"
                  onClick={() => setIsAddPetModalOpen(true)}
                  size="md"
                  type="button"
                />
                <Button
                  text="Save My Details"
                  color="accent"
                  size="lg"
                  onClick={handleSaveOwnerDetails}
                  type="button"
                />
              </div>
            </form>
          )}

          {pets.map((pet) =>
            activeTab === pet.id ? (
              <div key={pet.id} className="profile-form">
                <h2 className="section-title">{`${pet.name}'s Information`}</h2>

                {editPetError && <p className="global-error">{editPetError}</p>}

                <div className="pet-details-grid">
                  <div className="image-upload-wrapper">
                    <img
                      src="/profile-placeholder.jpg"
                      alt="Pet Preview"
                      width={120}
                      height={120}
                      className="profile-image-preview"
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                    />
                    <label
                      htmlFor={`petImage-${pet.id}`}
                      className="upload-button"
                    >
                      Change Photo
                    </label>
                    <input
                      id={`petImage-${pet.id}`}
                      name="petImage"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                  <div className="general-details-inputs">
                    <Input
                      name="name"
                      label="Pet's Name"
                      value={editPetDetails.name}
                      onChange={handleEditPetChange}
                    />
                    <Input
                      name="type"
                      label="Pet Type"
                      value={editPetDetails.type}
                      onChange={handleEditPetChange}
                    />
                    <Input
                      name="breed"
                      label="Pet's Breed"
                      value={editPetDetails.breed}
                      onChange={handleEditPetChange}
                    />
                    <Input
                      name="age"
                      label="Pet's Age (years)"
                      type="number"
                      value={editPetDetails.age}
                      onChange={handleEditPetChange}
                    />
                    <Input
                      name="weight"
                      label="Pet's Weight (kg)"
                      type="number"
                      step="0.1"
                      value={editPetDetails.weight}
                      onChange={handleEditPetChange}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <Button
                    text="Save Pet Details"
                    color="accent"
                    size="lg"
                    onClick={handleSavePetDetails}
                  />
                </div>

                <div className="health-section">
                  <h3 className="sub-section-title">Health Record</h3>
                  <div className="health-category">
                    <h4>Lifelong Conditions</h4>
                    {(pet.lifelong_conditions ?? []).length > 0 ? (
                      (pet.lifelong_conditions ?? []).map(
                        (condition, index) => (
                          <ConditionSummaryCard
                            key={index}
                            disease={condition.condition}
                            treatment={condition.treatment}
                          />
                        )
                      )
                    ) : (
                      <p className="no-record-note">
                        No lifelong conditions recorded.
                      </p>
                    )}
                  </div>
                  <div className="health-category">
                    <h4>Active Treatments</h4>
                    {(pet.active_treatments ?? []).length > 0 ? (
                      (pet.active_treatments ?? []).map((condition, index) => (
                        <ConditionSummaryCard
                          key={index}
                          disease={condition.condition}
                          treatment={condition.treatment}
                          active
                        />
                      ))
                    ) : (
                      <p className="no-record-note">No active treatments.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null
          )}

          {activeTab === "appointments" && (
            <div className="appointments-section">
              <div className="appointments-header">
                <h2 className="section-title no-border">My Appointments</h2>
                <Button
                  text="Book New Appointment"
                  color="primary"
                  size="md"
                  onClick={handleOpenBookingModal}
                />
              </div>
              <div className="appointments-list">
                {appointments.length > 0 ? (
                  appointments.map((app) => (
                    <AppointmentCard
                      key={app.id}
                      id={app.id}
                      status={app.status}
                      doctorName={`Dr. ${app.doctor.name}`}
                      petName={app.patient.name}
                      date={new Date(app.datetime).toLocaleDateString()}
                      time={new Date(app.datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      onClick={() => handleAppointmentClick(app.id)}
                      onDelete={() => handleDeleteAppointment(app.id)}
                    />
                  ))
                ) : (
                  <p>You have no upcoming appointments.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {isBookingModalOpen && (
          <BookingModal
            pets={petsForBookingModal}
            doctor={detailedDoctor as any}
            isLoading={detailedDoctorLoading}
            onDoctorSelect={(doctor) => setSelectedDoctorId(doctor.id)}
            onClose={handleCloseBookingModal}
            showStepSelectDoctor={true}
            onBookingSave={handleBookingSave}
          />
        )}

        {isAddPetModalOpen && (
          <Modal
            title="Add a New Pet"
            onClose={() => {
              setIsAddPetModalOpen(false);
              setNewPetError(null);
            }}
            footerContent={
              <>
                <Button
                  text="Cancel"
                  color="secondary"
                  size="md"
                  onClick={() => {
                    setIsAddPetModalOpen(false);
                    setNewPetError(null);
                  }}
                />
                <Button
                  text="Save Pet"
                  color="primary"
                  size="md"
                  onClick={handleAddNewPet}
                  form="add-pet-form"
                  type="submit"
                />
              </>
            }
          >
            <form
              id="add-pet-form"
              className="profile-form"
              onSubmit={handleAddNewPet}
            >
              {newPetError && <p className="global-error">{newPetError}</p>}
              <Input
                name="name"
                label="Pet's Name"
                value={newPetDetails.name}
                onChange={handleNewPetChange}
              />
              <Input
                name="type"
                label="Pet Type (e.g., Dog, Cat)"
                value={newPetDetails.type}
                onChange={handleNewPetChange}
              />
              <Input
                name="breed"
                label="Pet's Breed"
                value={newPetDetails.breed}
                onChange={handleNewPetChange}
              />
              <Input
                name="age"
                label="Pet's Age (years)"
                type="number"
                value={newPetDetails.age}
                onChange={handleNewPetChange}
              />
              <Input
                name="weight"
                label="Pet's Weight (kg)"
                type="number"
                step="0.1"
                value={newPetDetails.weight}
                onChange={handleNewPetChange}
              />
            </form>
          </Modal>
        )}
      </div>
    </ProtectedRoute>
  );
}
