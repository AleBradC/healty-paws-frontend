import {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { getAppointmentDisplayStatus } from "../../../utils/appointment-status";
import { AppointmentCard } from "../../../components/features/AppointmentCard/AppointmentCard";
import { AvailabilityModal } from "../../../components/features/AvailabilityModal/AvailabilityModal";
import { Input } from "../../../components/ui/Input/Input";
import { Loading } from "../../../components/ui/Loading/Loading";
import { Modal } from "../../../components/ui/Modal/Modal";
import { ProtectedRoute } from "../../../router/ProtectedRoute/ProtectedRoute";
import { Tabs } from "../../../components/ui/Tabs/Tabs";
import { specializationsData } from "../../../data/specialization";
import { useUpdateAppointment } from "../../../lib/graphql/appointments/useUpdateAppointment";
import { useRemoveAppointment } from "../../../lib/graphql/appointments/useRemoveAppointment";
import { useAddDoctorAvailability } from "../../../lib/graphql/doctors/useAddDoctorAvailability";
import type { AddDoctorAvailabilityInput } from "../../../generated/graphql";
import { useAddDoctorSpecialization } from "../../../lib/graphql/doctors/useAddDoctorSpecialization";
import { useDoctor } from "../../../lib/graphql/doctors/useDoctor";
import { useRemoveDoctorAvailability } from "../../../lib/graphql/doctors/useRemoveDoctorAvailability";
import { useRemoveDoctorSpecialization } from "../../../lib/graphql/doctors/useRemoveDoctorSpecialization";
import { useUpdateDoctorDetails } from "../../../lib/graphql/doctors/useUpdateDoctorDetails";
import { useUpdateDoctorSpecialization } from "../../../lib/graphql/doctors/useUpdateDoctorSpecialization";
import type { Specialization } from "../../../types";
import {
  appointmentDetailsPath,
  appointmentSummaryPath,
  patientSummaryPath,
} from "../../../utils/path";
import { useAuthentication } from "../../../context/AuthenticationContext";
import { SpecializationEditor } from "./components/SpecializationEditor";
import { Button } from "../../../components/ui/Button/Button";
import { Select } from "../../../components/ui/Select/Select";
import { AvatarImage } from "../../../components/ui/AvatarImage/AvatarImage";
import { DashboardSection } from "../../../components/ui/DashboardSection/DashboardSection";
import "./styles.css";

const doctorTabs = [
  { id: "profile", label: "My details" },
  { id: "services", label: "My Services" },
  { id: "availability", label: "My Availability" },
  { id: "appointments", label: "My Appointments" },
  { id: "patients", label: "My Patients" },
];

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthentication();

  // --- HOOKS: Data Fetching ---
  const {
    doctor,
    error: doctorError,
    refetch: doctorRefetch,
  } = useDoctor(user?.id ?? null);

  const {
    updateDoctorDetails,
    loading: isUpdatingProfile,
    error: updateDoctorDetailsError,
  } = useUpdateDoctorDetails();

  const { addDoctorSpecialization } = useAddDoctorSpecialization();
  const { updateDoctorSpecialization } = useUpdateDoctorSpecialization();
  const { removeDoctorSpecialization } = useRemoveDoctorSpecialization();
  const { addDoctorAvailability, loading: availabilityLoading } =
    useAddDoctorAvailability();
  const { removeDoctorAvailability } = useRemoveDoctorAvailability();
  const { removeAppointment } = useRemoveAppointment();
  const { updateAppointmentDetails } = useUpdateAppointment();

  // --- STATE: UI & Tabs ---
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("doctor_dashboard_active_tab") || "profile";
  });
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  // --- STATE: Profile Details ---
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    clinicName: "",
    clinicAddress: "",
  });
  const [profileError, setProfileError] = useState<string | null>(null);

  // --- STATE: Services ---
  const [isAddingSpecialization, setIsAddingSpecialization] = useState(false);
  const [newSpecializationSelectionId, setNewSpecializationSelectionId] =
    useState("");
  const [draftSpecializations, setDraftSpecializations] = useState<
    Specialization[]
  >([]);
  const [savedSpecializations, setSavedSpecializations] = useState<
    Specialization[]
  >([]);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // --- STATE: Availability ---
  const [doctorAvailability, setDoctorAvailability] = useState<
    Record<string, string[]>
  >({});

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem("doctor_dashboard_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const availabilityMap: Record<string, string[]> = {};
    (doctor?.availabilities ?? []).forEach(
      (avail: { available_datetime: string }) => {
        const dateObj = new Date(avail.available_datetime);
        const date = format(dateObj, "yyyy-MM-dd");
        const time = format(dateObj, "HH:mm");

        if (!availabilityMap[date]) {
          availabilityMap[date] = [];
        }
        availabilityMap[date].push(time);
      }
    );
    setDoctorAvailability(availabilityMap);

    if (doctor) {
      setProfileDetails({
        name: doctor.name,
        clinicName: doctor.clinic_name ?? "",
        clinicAddress: doctor.clinic_address ?? "",
      });

      const specs = JSON.parse(JSON.stringify(doctor.specializations));
      setSavedSpecializations(specs);
      setDraftSpecializations(specs);
    }
  }, [doctor]);

  useEffect(() => {
    setProfileError(null);
    setServicesError(null);
  }, [activeTab]);

  const profileHasChanges =
    doctor?.name !== profileDetails.name ||
    doctor?.clinic_name !== profileDetails.clinicName ||
    doctor?.clinic_address !== profileDetails.clinicAddress;
  const isProfileValid =
    profileDetails.name.trim().length > 0 &&
    profileDetails.clinicName.trim().length > 0 &&
    profileDetails.clinicAddress.trim().length > 0;
  const canSaveProfile = profileHasChanges && isProfileValid;

  const servicesHaveChanges =
    JSON.stringify(savedSpecializations) !==
    JSON.stringify(draftSpecializations);
  const hasEmptyServiceData = draftSpecializations.some(
    (spec) =>
      spec.name.trim().length === 0 ||
      spec.services.some(
        (service) => !service.name.trim() || Number(service.price) <= 0
      )
  );
  const canSaveServices = servicesHaveChanges && !hasEmptyServiceData;

  const existingSpecNames = draftSpecializations?.map((ds) => ds.name);
  const availableSpecsToAdd = specializationsData?.filter(
    (spec) => !existingSpecNames?.includes(spec?.name)
  );
  const appointments = doctor?.appointments ?? [];
  const completedPatientIds = new Set(
    appointments
      .filter((app) => app.status === "Completed")
      .map((app) => app.patient?.id)
      .filter((id): id is string => Boolean(id))
  );
  const patientsWithCompletedConsultation = (doctor?.patients ?? []).filter(
    (patient) => completedPatientIds.has(patient.id)
  );
  const doctorAvatarStorageKey = user?.id
    ? `avatar-doctor-${user.id}`
    : undefined;

  if (doctorError || updateDoctorDetailsError) {
    return (
      <div className="dashboard-wrapper">
        Could not load your information. Please try again.
      </div>
    );
  }

  if (!doctor) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <Loading
          isLoading={true}
          message="Loading..."
          variant="fullscreen"
          minDuration={1000}
        />
      </ProtectedRoute>
    );
  }

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileDetails((prev) => ({ ...prev, [name]: value }));
    if (profileError) setProfileError(null);
  };

  const handleSaveDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileError(null);

    if (!profileHasChanges) return;

    if (
      !profileDetails.name.trim() ||
      !profileDetails.clinicName.trim() ||
      !profileDetails.clinicAddress.trim()
    ) {
      setProfileError("All fields are required.");
      return;
    }

    try {
      await updateDoctorDetails({
        doctorId: doctor?.id,
        name: profileDetails.name,
        clinicName: profileDetails.clinicName,
        clinicAddress: profileDetails.clinicAddress,
      });
      doctorRefetch();
    } catch (e) {
      console.error("Failed to update profile:", e);
      setProfileError("Failed to save changes.");
    }
  };

  const handleAddToDraft = () => {
    if (!newSpecializationSelectionId) return;

    const selectedSpecializationData = specializationsData?.find(
      (spec) => spec?.id === newSpecializationSelectionId
    );

    if (!selectedSpecializationData) {
      setIsAddingSpecialization(false);
      return;
    }

    const newSpec: Specialization = {
      id: `draft-${selectedSpecializationData?.id}`,
      name: selectedSpecializationData?.name,
      services: selectedSpecializationData?.services?.map((s) => ({
        ...s,
        price: 0,
        specialization_id: selectedSpecializationData?.id,
      })),
    };

    setDraftSpecializations((prev) => [...prev, newSpec]);
    setIsAddingSpecialization(false);
    setNewSpecializationSelectionId("");
  };

  const handleUpdateDraftSpecialization = (updatedSpec: Specialization) => {
    setDraftSpecializations((prev) =>
      prev.map((existingSpec) =>
        existingSpec.id === updatedSpec.id ? updatedSpec : existingSpec
      )
    );
    if (servicesError) setServicesError(null);
  };

  const handleRemoveSpecialization = async (specId: string) => {
    setDraftSpecializations((prev) => prev.filter((spec) => spec.id !== specId));
    if (servicesError) setServicesError(null);
  };

  const validateServices = (): boolean => {
    for (const spec of draftSpecializations) {
      for (const service of spec.services) {
        if (service.price <= 0) {
          setServicesError(
            `Price for "${service.name}" in ${spec.name} must be greater than 0.`
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSaveSpecializationAndServices = async () => {
    if (!doctor) return;
    setServicesError(null);

    if (!validateServices()) return;

    try {
      const mutationPromises = [];
      const draftSpecIds = new Set(draftSpecializations.map((spec) => spec.id));

      for (const savedSpec of savedSpecializations) {
        if (!draftSpecIds.has(savedSpec.id)) {
          mutationPromises.push(
            removeDoctorSpecialization({
              doctorId: doctor.id,
              specializationId: savedSpec.id,
            })
          );
        }
      }

      for (const draftSpec of draftSpecializations) {
        if (draftSpec.id.startsWith("draft-")) {
          mutationPromises.push(
            addDoctorSpecialization({
              doctorId: doctor.id,
              specializationName: draftSpec.name,
              services: draftSpec.services.map((s) => ({
                name: s.name,
                price: s.price,
              })),
            })
          );
        } else {
          const originalSpec = savedSpecializations.find(
            (s) => s.id === draftSpec.id
          );
          if (
            originalSpec &&
            JSON.stringify(originalSpec) !== JSON.stringify(draftSpec)
          ) {
            mutationPromises.push(
              updateDoctorSpecialization({
                doctorId: doctor.id,
                specializationId: draftSpec.id,
                services: draftSpec.services.map((s) => ({
                  id: s.id.startsWith("custom-") ? null : s.id,
                  name: s.name,
                  price: s.price,
                })),
              })
            );
          }
        }
      }

      if (mutationPromises.length === 0) return;

      await Promise.all(mutationPromises);
      doctorRefetch();
    } catch (e) {
      console.error("An error occurred while saving changes:", e);
      setServicesError("Failed to save services.");
    }
  };

  const handleSaveAvailability = async (
    newAvailability: Record<string, string[]>
  ) => {
    if (
      JSON.stringify(newAvailability) === JSON.stringify(doctorAvailability)
    ) {
      setIsAvailabilityModalOpen(false);
      return;
    }

    const availabilitiesAsISOStrings = Object.entries(newAvailability).flatMap(
      ([date, times]) =>
        times.map((time) => new Date(`${date}T${time}:00`).toISOString())
    );

    const input: AddDoctorAvailabilityInput = {
      doctorId: doctor.id,
      availabilities: availabilitiesAsISOStrings,
    };

    try {
      await addDoctorAvailability(input);
      setDoctorAvailability(newAvailability);
      setIsAvailabilityModalOpen(false);
    } catch (e) {
      console.error("Failed to save availability:", e);
    }
  };

  const handleDeleteAvailabilitySlot = async (date: string, time: string) => {
    const slotToDeleteISO = new Date(`${date}T${time}:00`).toISOString();
    const availabilityObject = doctor?.availabilities?.find(
      (availability) => availability.available_datetime === slotToDeleteISO
    );

    if (!availabilityObject) return;

    try {
      await removeDoctorAvailability({
        doctorId: doctor?.id,
        availabilityId: availabilityObject?.id,
      });
      doctorRefetch();
    } catch (error) {
      console.error("Failed to delete availability slot:", error);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await removeAppointment({ appointmentId });
      await doctorRefetch();
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      await updateAppointmentDetails({
        appointmentId,
        status,
      });
      await doctorRefetch();
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
  };

  const handleAppointmentClick = (
    appointmentId: string | number,
    baseStatus: string | null | undefined,
    datetime: string
  ) => {
    const displayStatus = getAppointmentDisplayStatus(baseStatus, datetime);

    switch (displayStatus) {
      case "Completed":
        navigate(`${appointmentSummaryPath}/${appointmentId}`);
        return;
      case "Start":
        navigate(`${appointmentDetailsPath}/${appointmentId}`);
        return;
      case "Confirmed":
      case "Upcoming":
      case "Cancelled":
      default:
        return;
    }
  };

  const handlePatientClick = (patientId: string | number) => {
    navigate(`${patientSummaryPath}/${patientId}`);
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">Doctor Dashboard</h1>
        <Tabs
          tabs={doctorTabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
        <div className="dashboard-content">
          {activeTab === "profile" && (
            <DashboardSection 
              title="My details" 
              as="form" 
              className="profile-form" 
              onSubmit={handleSaveDetails}
            >
              {profileError && <p className="global-error">{profileError}</p>}

              <div className="profile-layout-grid">
                <div className="profile-sidebar">
                  <AvatarImage
                    alt="Profile Preview"
                    size={160}
                    editable
                    storageKey={doctorAvatarStorageKey}
                  />
                  <p className="profile-info-text">Update your professional profile picture for your clinic profile.</p>
                </div>

                <div className="profile-main-info">
                  <div className="inputs-grid">
                    <Input
                      name="name"
                      label="My full name"
                      value={profileDetails.name}
                      onChange={handleProfileChange}
                    />
                    <Input
                      name="email"
                      label="Email Address"
                      value={doctor.email ?? ""}
                      readOnly
                      disabled
                    />
                    <div className="full-width-input">
                      <Input
                        name="clinicName"
                        label="Clinic Name"
                        value={profileDetails.clinicName ?? ""}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="full-width-input">
                      <Input
                        name="clinicAddress"
                        label="Clinic Address"
                        value={profileDetails.clinicAddress ?? ""}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="profile-actions">
                    <Button
                      text="Save changes"
                      type="submit"
                      color="primary"
                      size="md"
                      disabled={isUpdatingProfile || !canSaveProfile}
                    />
                  </div>
                </div>
              </div>
            </DashboardSection>
          )}

          {activeTab === "services" && (
            <DashboardSection title="My Specializations & Services" className="services-section-wrapper">
              {servicesError && <p className="global-error">{servicesError}</p>}

              <div className="add-specialization-controls">
                {isAddingSpecialization ? (
                  <div className="add-specialization-form">
                    <Select
                      id="new-specialization-select"
                      label="New Specialization"
                      name="new-specialization"
                      className="specialization-select-dropdown"
                      value={newSpecializationSelectionId}
                      onChange={(e) =>
                        setNewSpecializationSelectionId(e.target.value)
                      }
                      options={availableSpecsToAdd.map((spec) => ({
                        value: spec.id,
                        label: spec.name,
                      }))}
                    />
                    <Button
                      text="Add to Draft"
                      size="sm"
                      color="primary"
                      onClick={handleAddToDraft}
                      disabled={!newSpecializationSelectionId}
                    />
                    <Button
                      text="Cancel"
                      color="secondary"
                      size="sm"
                      onClick={() => setIsAddingSpecialization(false)}
                    />
                  </div>
                ) : (
                  <Button
                    text="New specialization"
                    size="md"
                    onClick={() => setIsAddingSpecialization(true)}
                    color="primary"
                  />
                )}
              </div>
              <div className="doctor-specializations-list">
                {draftSpecializations.map((spec) => (
                  <SpecializationEditor
                    key={spec.id}
                    specialization={spec}
                    onUpdate={handleUpdateDraftSpecialization}
                    onDelete={handleRemoveSpecialization}
                  />
                ))}
                {draftSpecializations.length === 0 && (
                  <p>
                    You haven't added any specializations yet. Click "Add New
                    Specialization" to begin.
                  </p>
                )}
              </div>
              <div className="services-actions-footer">
                <Button
                  text="Save all"
                  color="primary"
                  size="md"
                  onClick={handleSaveSpecializationAndServices}
                  disabled={!canSaveServices}
                />
              </div>
            </DashboardSection>
          )}
          {activeTab === "availability" && (
            <DashboardSection title="My Availability" className="availability-section-wrapper">

              <div className="availability-controls">
                <Button
                  text="Manage Availability"
                  color="primary"
                  size="md"
                  onClick={() => setIsAvailabilityModalOpen(true)}
                  disabled={availabilityLoading}
                />
              </div>
              <div className="availability-display">
                {Object.keys(doctorAvailability).length > 0 ? (
                  Object.entries(doctorAvailability).map(([date, slots]) => (
                    <div key={date} className="availability-day">
                      <h3 className="availability-date">
                        {format(new Date(date), "MMMM do, yyyy")}
                      </h3>
                      <div className="slots-container">
                        {slots.map((time) => (
                          <div key={time} className="slot-tag">
                            {time}
                            <button
                              onClick={() =>
                                handleDeleteAvailabilitySlot(date, time)
                              }
                              className="delete-slot-btn"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>You have not set any available slots.</p>
                )}
              </div>
            </DashboardSection>
          )}

          {activeTab === "appointments" && (
            <DashboardSection title="My Appointments" className="appointments-section">
              <div className="appointments-list">
                {appointments.length > 0 ? (
                  appointments.map((app) => (
                    (() => {
                      const appointmentStatus: string = app.status ?? "Upcoming";
                      const isPending = appointmentStatus === "Pending";
                      const isCompleted = appointmentStatus === "Completed";
                      const isCancelled = appointmentStatus === "Cancelled";
                      const isDenied = appointmentStatus === "Denied";
                      const isDisabled = isCancelled || isDenied;

                      return (
                        <AppointmentCard
                          key={app.id}
                          id={app.id}
                          status={appointmentStatus}
                          doctorName={app.patient?.owner?.name ?? "Unknown Owner"}
                          petName={app.patient?.name ?? "Unknown Pet"}
                          date={new Date(app.datetime).toLocaleDateString()}
                          time={new Date(app.datetime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          datetime={app.datetime}
                          isDisabled={isDisabled}
                          onClick={
                            isDisabled
                              ? undefined
                              : () =>
                                  handleAppointmentClick(
                                    app.id,
                                    appointmentStatus,
                                    app.datetime
                                  )
                          }
                          onDelete={
                            isDisabled
                              ? undefined
                              : () => handleDeleteAppointment(app.id)
                          }
                          onAccept={
                            isPending
                              ? () => handleUpdateStatus(app.id, "Confirmed")
                              : undefined
                          }
                          onDeny={
                            isPending
                              ? () => handleUpdateStatus(app.id, "Denied")
                              : undefined
                          }
                        />
                      );
                    })()
                  ))
                ) : (
                  <p>You have no upcoming appointments.</p>
                )}
              </div>
            </DashboardSection>
          )}

          {activeTab === "patients" && (
            <DashboardSection title="My Patients" className="patients-list-section">
              <div className="patient-list">
                {patientsWithCompletedConsultation.length > 0 ? (
                  patientsWithCompletedConsultation.map((patient: { id: string; name: string; owner?: { name: string } | null }) => (
                    <div
                      key={patient.id}
                      className="patient-card"
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      <div className="patient-info">
                        <span className="patient-name">
                          {patient.owner?.name}
                        </span>
                        <span className="pet-info"> (Pet: {patient.name})</span>
                      </div>
                      <Button text="View Details" color="secondary" size="sm" />
                    </div>
                  ))
                ) : (
                  <p>You don't have any patients yet. Patients will appear here after their consultation is completed.</p>
                )}
              </div>
            </DashboardSection>
          )}
        </div>

        {isAvailabilityModalOpen && (
          <AvailabilityModal
            initialAvailability={doctorAvailability}
            onSave={handleSaveAvailability}
            onClose={() => setIsAvailabilityModalOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
