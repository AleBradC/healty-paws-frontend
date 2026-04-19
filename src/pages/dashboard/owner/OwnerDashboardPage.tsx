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
import { getAppointmentDisplayStatus } from "../../../utils/appointment-status";
import { useAuthentication } from "../../../context/AuthenticationContext";
import { Button } from "../../../components/ui/Button/Button";
import { Loading } from "../../../components/ui/Loading/Loading";
import { AvatarImage } from "../../../components/ui/AvatarImage/AvatarImage";
import { useOwner } from "../../../lib/graphql/owner/useOwner";
import { DashboardSection } from "../../../components/ui/DashboardSection/DashboardSection";
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

export default function OwnerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthentication();

  // --- STATE: UI & Tabs ---
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("owner_dashboard_active_tab") || "owner";
  });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // --- STATE: Data ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [ownerDetails, setOwnerDetails] = useState({ name: "" });
  const [ownerError, setOwnerError] = useState<string | null>(null);

  // --- STATE: Pet Forms ---
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

  // --- HOOKS: Data Fetching ---
  const {
    owner,
    error: fetchOwnerError,
    refetch: refetchOwner,
  } = useOwner(user?.id ?? null);

  const { createAppointment } = useCreateAppointment();
  const { removeAppointment } = useRemoveAppointment();
  const { createPet, loading: isCreatingPet } = useCreatePet();
  const { updatePet, loading: isUpdatingPet } = useUpdatePet();
  const { updateOwner, loading: isUpdatingOwner } = useUpdateOwner();
  const { doctor: detailedDoctor, loading: detailedDoctorLoading } =
    useDoctor(selectedDoctorId);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem("owner_dashboard_active_tab", activeTab);
  }, [activeTab]);

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
          age: petToEdit.age?.toString() || "",
          weight: petToEdit.weight?.toString() || "",
        });
      }
    } else {
      setEditPetId(null);
      setEditPetDetails({ name: "", type: "", breed: "", age: "", weight: "" });
    }
  }, [activeTab, owner?.pets]);

  // --- EARLY RETURNS ---
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

  const ownerHasChanges = owner.name !== ownerDetails.name;
  const isOwnerDetailsValid = ownerDetails.name.trim().length > 0;
  const canSaveOwnerDetails = ownerHasChanges && isOwnerDetailsValid;

  const currentPet = owner.pets?.find((p) => p.id === activeTab);
  const isPetDetailsValid =
    editPetDetails.name.trim().length > 0 &&
    editPetDetails.type.trim().length > 0 &&
    editPetDetails.breed.trim().length > 0 &&
    Number(editPetDetails.age) > 0 &&
    Number(editPetDetails.weight) > 0;
  const petHasChanges =
    currentPet &&
    (currentPet.name !== editPetDetails.name ||
      currentPet.type !== editPetDetails.type ||
      currentPet.breed !== editPetDetails.breed ||
      currentPet.age?.toString() !== editPetDetails.age ||
      currentPet.weight?.toString() !== editPetDetails.weight);
  const canSavePetDetails = Boolean(petHasChanges && isPetDetailsValid);

  const pets = owner.pets ?? [];
  const newPetHasChanges = Object.values(newPetDetails).some(
    (value) => value.trim() !== ""
  );
  const isNewPetValid =
    newPetDetails.name.trim().length > 0 &&
    newPetDetails.type.trim().length > 0 &&
    newPetDetails.breed.trim().length > 0 &&
    Number(newPetDetails.age) > 0 &&
    Number(newPetDetails.weight) > 0;
  const patientTabs = [
    { id: "owner", label: "My Details" },
    ...pets.map((pet) => ({ id: pet.id, label: pet.name })),
    { id: "appointments", label: "Appointments" },
  ];
  const petsForBookingModal = pets.map((pet) => ({
    id: pet.id,
    name: pet.name,
  })) as unknown as Pet[];
  const ownerAvatarStorageKey = user?.id ? `avatar-owner-${user.id}` : undefined;

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
    const sanitizedValue =
      name === "age" || name === "weight"
        ? String(Math.max(0, Number(value) || 0))
        : value;
    setNewPetDetails((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (newPetError) setNewPetError(null);
  };

  const handleEditPetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "age" || name === "weight"
        ? String(Math.max(0, Number(value) || 0))
        : value;
    setEditPetDetails((prev) => ({ ...prev, [name]: sanitizedValue }));
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

  const handleAppointmentClick = (
    appointmentId: string | number,
    baseStatus: string | null | undefined,
    datetime: string
  ) => {
    const displayStatus = getAppointmentDisplayStatus(baseStatus, datetime);

    if (displayStatus === "Completed") {
      navigate(`${appointmentSummaryPath}/${appointmentId}`);
    }
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
            <DashboardSection title="My Details" as="form" className="profile-form">
              {ownerError && <p className="global-error">{ownerError}</p>}

              <div className="profile-layout-grid">
                <div className="profile-sidebar">
                  <AvatarImage
                    alt="Profile Preview"
                    size={160}
                    editable
                    storageKey={ownerAvatarStorageKey}
                  />
                  <p className="profile-info-text">Update your professional profile picture to personalize your dashboard.</p>
                </div>

                <div className="profile-main-info">
                  <div className="inputs-grid">
                    <Input
                      name="name"
                      label="My full name"
                      value={ownerDetails.name}
                      onChange={handleOwnerChange}
                    />
                    <Input
                      name="email"
                      label="Email Address"
                      value={owner.email ?? ""}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="profile-actions">
                    <Button
                      text="Add New Pet"
                      color="secondary"
                      onClick={() => setIsAddPetModalOpen(true)}
                      size="md"
                      type="button"
                    />
                    <Button
                      text="Save changes"
                      color="primary"
                      size="md"
                      onClick={handleSaveOwnerDetails}
                      disabled={isUpdatingOwner || !canSaveOwnerDetails}
                      type="button"
                    />
                  </div>
                </div>
              </div>
            </DashboardSection>
          )}

          {pets.map((pet) =>
            activeTab === pet.id ? (
              <DashboardSection key={pet.id} title={`${pet.name}'s Information`} className="profile-form">
                {editPetError && <p className="global-error">{editPetError}</p>}

                <div className="profile-layout-grid">
                  <div className="profile-sidebar">
                  <AvatarImage
                    alt="Pet Preview"
                    size={160}
                    editable
                    storageKey={`avatar-pet-${pet.id}`}
                  />
                    <p className="profile-info-text">Update {pet.name}'s photo and general information to keep their health records up to date.</p>
                  </div>

                  <div className="profile-main-info">
                    <div className="inputs-grid">
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
                        min="0"
                        value={editPetDetails.age}
                        onChange={handleEditPetChange}
                      />
                      <Input
                        name="weight"
                        label="Pet's Weight (kg)"
                        type="number"
                        step="0.1"
                        min="0"
                        value={editPetDetails.weight}
                        onChange={handleEditPetChange}
                      />
                    </div>

                    <div className="profile-actions">
                      <Button
                        text="Save Pet Details"
                        color="primary"
                        size="md"
                        onClick={handleSavePetDetails}
                        disabled={isUpdatingPet || !canSavePetDetails}
                      />
                    </div>
                  </div>
                </div>

                <DashboardSection title="Health Record" className="health-section">
                  <div className="health-record-grid">
                    <div className="health-category stable">
                      <div className="category-header">
                        <h4>Lifelong Conditions</h4>
                      </div>
                      {(pet.lifelong_conditions ?? []).length > 0 ? (
                        (pet.lifelong_conditions ?? []).map(
                          (condition, index) => (
                            <ConditionSummaryCard
                              key={index}
                              disease={condition.condition}
                              treatment={condition.treatment}
                              variant="stable"
                            />
                          )
                        )
                      ) : (
                        <p className="no-record-note">
                          No lifelong conditions recorded.
                        </p>
                      )}
                    </div>

                    <div className="health-category active">
                      <div className="category-header">
                        <h4>Active Treatments</h4>
                      </div>
                      {(pet.active_treatments ?? []).length > 0 ? (
                        (pet.active_treatments ?? []).map((condition, index) => (
                          <ConditionSummaryCard
                            key={index}
                            disease={condition.condition}
                            treatment={condition.treatment}
                            variant="active"
                          />
                        ))
                      ) : (
                        <p className="no-record-note">No active treatments.</p>
                      )}
                    </div>
                  </div>
                </DashboardSection>
              </DashboardSection>
            ) : null
          )}

          {activeTab === "appointments" && (
            <DashboardSection title="My Appointments" className="appointments-section">
              <div className="appointments-header">
                <Button
                  text="Book New Appointment"
                  color="primary"
                  size="md"
                  onClick={handleOpenBookingModal}
                />
              </div>
              <div className="appointments-list">
                {appointments.length > 0 ? (
                  appointments.map((app) => {
                    const appointmentStatus = app.status ?? "Upcoming";
                    const isCompleted = appointmentStatus === "Completed";
                    const isCancelled = appointmentStatus === "Cancelled";
                    const isDenied = appointmentStatus === "Denied";
                    const isPending = appointmentStatus === "Pending";
                    const isConfirmed = appointmentStatus === "Confirmed";
                    const isUpcoming = appointmentStatus === "Upcoming";

                    const canCancel = isPending || isConfirmed || isUpcoming;

                    return (
                      <AppointmentCard
                        key={app.id}
                        id={app.id}
                        status={appointmentStatus}
                        doctorName={`Dr. ${app.doctor.name}`}
                        petName={app.patient.name}
                        date={new Date(app.datetime).toLocaleDateString()}
                        time={new Date(app.datetime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        datetime={app.datetime}
                        isDisabled={isCancelled || isDenied}
                        onClick={() =>
                          handleAppointmentClick(
                            app.id,
                            appointmentStatus,
                            app.datetime
                          )
                        }
                        onDelete={
                          canCancel
                            ? () => handleDeleteAppointment(app.id)
                            : undefined
                        }
                      />
                    );
                  })
                ) : (
                  <p>You have no upcoming appointments.</p>
                )}
              </div>
            </DashboardSection>
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
                  disabled={!newPetHasChanges || !isNewPetValid || isCreatingPet}
                />
              </>
            }
          >
            <form
              id="add-pet-form"
              className="profile-form add-pet-form"
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
                min="0"
                value={newPetDetails.age}
                onChange={handleNewPetChange}
              />
              <Input
                name="weight"
                label="Pet's Weight (kg)"
                type="number"
                step="0.1"
                min="0"
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
