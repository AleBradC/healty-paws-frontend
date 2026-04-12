import { useState, useEffect, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { Input } from "../../components/ui/Input/Input";
import { ProtectedRoute } from "../../router/ProtectedRoute/ProtectedRoute";
import { Textarea } from "../../components/ui/Textarea/Textarea";
import { useAppointment } from "../../lib/graphql/appointments/useAppointment";
import { useUpdateAppointment } from "../../lib/graphql/appointments/useUpdateAppointment";
import type { UpdateAppointmentInput } from "../../generated/graphql";
import type { LifelongCondition, ActiveTreatment } from "../../types";
import LabeledInput from "./components/LabeledInput";
import ReadOnlyInfoBlock from "./components/ReadOnlyInfoBlock";
import type {
  EditablePatientDetails,
  EditableAppointmentDetails,
} from "./types";
import { Button } from "../../components/ui/Button/Button";
import "./styles.css";

export default function AppointmentDetailsPage() {
  const params = useParams();
  const appointmentId = params.appointmentId as string;

  const {
    appointment: fetchedAppointment,
    error: fetchError,
    refetch: refetchAppointment,
  } = useAppointment(appointmentId);
  const {
    updateAppointmentDetails,
    loading: isSavingAppointmentDetailsLoading,
  } = useUpdateAppointment();

  const [patientDetails, setPatientDetails] =
    useState<EditablePatientDetails | null>(null);
  const [appointmentDetails, setAppointmentDetails] =
    useState<EditableAppointmentDetails | null>(null);
  const [lifelongConditions, setLifelongConditions] = useState<
    LifelongCondition[]
  >([]);
  const [activeTreatments, setActiveTreatments] = useState<ActiveTreatment[]>(
    []
  );

  const [initialSnapshot, setInitialSnapshot] = useState<any>(null);
  const [editingLifelongCondition, setEditingLifelongCondition] =
    useState<LifelongCondition | null>(null);
  const [editingActiveTreatment, setEditingActiveTreatment] =
    useState<ActiveTreatment | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchedAppointment) {
      const newPatientDetails = {
        name: fetchedAppointment?.patient?.name || "",
        type: fetchedAppointment?.patient?.type || "",
        breed: fetchedAppointment.patient?.breed || "",
        age: String(fetchedAppointment.patient?.age ?? ""),
        weight: String(fetchedAppointment.patient?.weight ?? ""),
      };

      const newAppointmentDetails = {
        reason: fetchedAppointment.reason ?? "",
        consultation_type: fetchedAppointment.consultation_type ?? "",
        investigation: fetchedAppointment.investigation ?? "",
        investigation_result: fetchedAppointment.investigation_result ?? "",
      };

      const newLifelongConditions =
        fetchedAppointment.patient?.lifelong_conditions?.map((lc) => ({
          ...lc,
        })) ?? [];

      const newActiveTreatments =
        fetchedAppointment.patient?.active_treatments?.map((at) => ({
          ...at,
        })) ?? [];

      setPatientDetails(newPatientDetails as unknown as EditablePatientDetails);
      setAppointmentDetails(newAppointmentDetails);
      setLifelongConditions(newLifelongConditions);
      setActiveTreatments(newActiveTreatments as unknown as ActiveTreatment[]);
      setInitialSnapshot({
        patientDetails: JSON.stringify(newPatientDetails),
        appointmentDetails: JSON.stringify(newAppointmentDetails),
        lifelongConditions: JSON.stringify(newLifelongConditions),
        activeTreatments: JSON.stringify(newActiveTreatments),
      });

      setEditingLifelongCondition(null);
      setEditingActiveTreatment(null);
    }
  }, [fetchedAppointment]);

  // --- Handlers ---
  const handlePatientDetailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPatientDetails((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : null
    );
  };

  const handleAppointmentDetailChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAppointmentDetails((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : null
    );
  };

  const handleStartEditing = (type: "lifelong" | "active") => {
    setSaveError(null);
    if (type === "lifelong" && !editingLifelongCondition) {
      setEditingLifelongCondition({
        id: `new-lc-${Date.now()}`,
        condition: "",
        treatment: "",
      });
    } else if (type === "active" && !editingActiveTreatment) {
      setEditingActiveTreatment({
        id: `new-at-${Date.now()}`,
        condition: "",
        treatment: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
      });
    }
  };

  const handleEditingChange = (
    type: "lifelong" | "active",
    field: string,
    value: string
  ) => {
    const setState =
      type === "lifelong"
        ? setEditingLifelongCondition
        : setEditingActiveTreatment;
    setState((prev: any) => (prev ? { ...prev, [field]: value } : null) as any);
  };

  const handleCancelEditing = (type: "lifelong" | "active") => {
    if (type === "lifelong") setEditingLifelongCondition(null);
    else setEditingActiveTreatment(null);
  };

  const handleCommitNewDiagnostic = (type: "lifelong" | "active") => {
    if (
      type === "lifelong" &&
      editingLifelongCondition?.condition &&
      editingLifelongCondition?.treatment
    ) {
      setLifelongConditions((prev) => [...prev, editingLifelongCondition]);
      setEditingLifelongCondition(null);
    } else if (
      type === "active" &&
      editingActiveTreatment?.condition &&
      editingActiveTreatment?.treatment &&
      editingActiveTreatment.start_date
    ) {
      setActiveTreatments((prev) => [...prev, editingActiveTreatment]);
      setEditingActiveTreatment(null);
    }
  };

  const removeDiagnostic = (type: "lifelong" | "active", id: string) => {
    const setState =
      type === "lifelong" ? setLifelongConditions : setActiveTreatments;
    setState((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  // --- CHECK FOR CHANGES ---
  const hasChanges = () => {
    if (!initialSnapshot) return false;

    const currentPatientString = JSON.stringify(patientDetails);
    const currentAppointmentString = JSON.stringify(appointmentDetails);
    const currentLifelongString = JSON.stringify(lifelongConditions);
    const currentActiveString = JSON.stringify(activeTreatments);

    return (
      currentPatientString !== initialSnapshot.patientDetails ||
      currentAppointmentString !== initialSnapshot.appointmentDetails ||
      currentLifelongString !== initialSnapshot.lifelongConditions ||
      currentActiveString !== initialSnapshot.activeTreatments
    );
  };

  const handleSaveAll = async () => {
    if (!fetchedAppointment || !appointmentDetails || !patientDetails) return;
    setSaveError(null);

    if (!hasChanges()) {
      return;
    }

    const lifelongConditionsToUpsert = lifelongConditions?.map((lc) => ({
      id: lc?.id?.startsWith("new-") ? null : lc.id,
      condition: lc?.condition,
      treatment: lc?.treatment,
    }));

    const activeTreatmentsToUpsert = activeTreatments.map((at) => ({
      id: at?.id?.startsWith("new-") ? null : at.id,
      condition: at?.condition,
      treatment: at?.treatment,
      start_date: at?.start_date,
      end_date: at?.end_date || null,
    }));

    const input = {
      appointmentId: fetchedAppointment.id,
      status: "Completed",
      reason: appointmentDetails.reason,
      consultationType: appointmentDetails.consultation_type,
      investigation: appointmentDetails.investigation,
      investigationResult: appointmentDetails.investigation_result,
      patientDetails: {
        name: patientDetails?.name,
        type: patientDetails?.type,
        breed: patientDetails?.breed,
        age: Number(patientDetails?.age),
        weight: Number(patientDetails?.weight),
      },
      lifelongConditions: lifelongConditionsToUpsert,
      activeTreatments: activeTreatmentsToUpsert,
    } as unknown as UpdateAppointmentInput;

    try {
      await updateAppointmentDetails(input);
      refetchAppointment();
    } catch (e: any) {
      setSaveError(
        e.message || "An unexpected error occurred. Please try again."
      );
      console.error("Failed to save changes:", e);
    }
  };

  if (
    fetchError ||
    !fetchedAppointment ||
    !patientDetails ||
    !appointmentDetails
  ) {
    return (
      <div className="details-page-wrapper">
        <h1>Appointment not found.</h1>
      </div>
    );
  }

  const changesDetected = hasChanges();

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="details-page-wrapper">
        <h1 className="page-main-title">Appointment details</h1>
        <div className="page-header-bar">
          <p className="appointment-date">
            For appointment on:
            <strong>
              {" "}{new Date(fetchedAppointment.datetime).toLocaleDateString()}
            </strong>
          </p>
          <Button
            text={
              isSavingAppointmentDetailsLoading
                ? "Saving..."
                : changesDetected
                ? "Save All Changes"
                : "Saved ✓"
            }
            color="primary"
            size="sm"
            onClick={handleSaveAll}
            disabled={!changesDetected || isSavingAppointmentDetailsLoading}
          />
        </div>

        <div className="details-section">
          <h2 className="section-title">Patient Details</h2>
          <div className="patient-details-form">
            <Input
              name="name"
              label="Pet Name"
              value={patientDetails.name ?? ""}
              onChange={handlePatientDetailChange}
            />
            <Input
              name="ownerName"
              label="Owner"
              value={fetchedAppointment.patient?.owner?.name ?? ""}
              readOnly
            />
            <Input
              name="type"
              label="Pet Type"
              value={patientDetails.type ?? ""}
              onChange={handlePatientDetailChange}
            />
            <Input
              name="breed"
              label="Breed"
              value={patientDetails.breed ?? ""}
              onChange={handlePatientDetailChange}
            />
            <Input
              name="age"
              label="Age (years)"
              type="number"
              value={String(patientDetails.age ?? "")}
              onChange={handlePatientDetailChange}
            />
            <Input
              name="weight"
              label="Weight (kg)"
              type="number"
              step="0.1"
              value={String(patientDetails.weight ?? "")}
              onChange={handlePatientDetailChange}
            />
          </div>
        </div>

        <div className="details-section consultation-notes-section">
          <h2 className="section-title">Consultation Notes</h2>

          <div className="diagnostic-category">
            <h4>Type of Consultation</h4>
            <div className="diagnostic-list">
              <div className="diagnostic-row editable">
                <Input
                  name="consultation_type"
                  placeholder="e.g. In-Person, Telehealth"
                  value={appointmentDetails.consultation_type ?? ""}
                  onChange={handleAppointmentDetailChange}
                  fullWidth
                />
              </div>
            </div>
          </div>

          <div className="diagnostic-category">
            <h4>Reason for Visit</h4>
            <div className="diagnostic-list">
              <div className="diagnostic-row editable">
                <Textarea
                  name="reason"
                  placeholder="Enter reason for today's visit..."
                  value={appointmentDetails.reason ?? ""}
                  onChange={handleAppointmentDetailChange}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="diagnostic-category">
            <h4>Investigation</h4>
            <div className="diagnostic-list">
              <div className="diagnostic-row editable">
                <Textarea
                  name="investigation"
                  placeholder="Describe investigation details..."
                  value={appointmentDetails.investigation ?? ""}
                  onChange={handleAppointmentDetailChange}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="diagnostic-category">
            <h4>Investigation Result</h4>
            <div className="diagnostic-list">
              <div className="diagnostic-row editable">
                <Textarea
                  name="investigation_result"
                  placeholder="Provide investigation results..."
                  value={appointmentDetails.investigation_result ?? ""}
                  onChange={handleAppointmentDetailChange}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h2 className="section-title">Diagnostic & Health Record</h2>

          <div className="diagnostic-category">
            <h4>Lifelong Conditions</h4>
            <div className="diagnostic-list">
              {lifelongConditions.map((c) => (
                <div key={c.id} className="diagnostic-row readonly">
                  <ReadOnlyInfoBlock label="Condition" value={c.condition} />
                  <ReadOnlyInfoBlock label="Treatment" value={c.treatment} />
                  <button
                    className="delete-diagnostic-row-btn"
                    onClick={() => removeDiagnostic("lifelong", c.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            {editingLifelongCondition ? (
              <div className="diagnostic-row editable">
                <LabeledInput
                  label="Condition"
                  placeholder="e.g. Arthritis"
                  value={editingLifelongCondition.condition}
                  onChange={(e) =>
                    handleEditingChange("lifelong", "condition", e.target.value)
                  }
                  required
                />
                <LabeledInput
                  label="Treatment"
                  placeholder="e.g. Daily supplement"
                  value={editingLifelongCondition.treatment}
                  onChange={(e) =>
                    handleEditingChange("lifelong", "treatment", e.target.value)
                  }
                  required
                />
                <div className="edit-row-actions">
                  <Button
                    text="Save"
                    size="sm"
                    color="accent"
                    onClick={() => handleCommitNewDiagnostic("lifelong")}
                  />
                  <Button
                    text="Cancel"
                    size="sm"
                    color="secondary"
                    onClick={() => handleCancelEditing("lifelong")}
                  />
                </div>
              </div>
            ) : (
              <Button
                text="Add New Lifelong Condition"
                color="primary"
                size="sm"
                onClick={() => handleStartEditing("lifelong")}
              />
            )}
          </div>

          <div className="diagnostic-category">
            <h4>Active Treatments</h4>
            <div className="diagnostic-list">
              {activeTreatments.map((t) => (
                <div
                  key={t.id}
                  className="diagnostic-row readonly active-treatment"
                >
                  <ReadOnlyInfoBlock label="Condition" value={t.condition} />
                  <ReadOnlyInfoBlock label="Treatment" value={t.treatment} />
                  <ReadOnlyInfoBlock
                    label="Start Date"
                    value={new Date(t.start_date).toLocaleDateString()}
                  />
                  <ReadOnlyInfoBlock
                    label="End Date"
                    value={
                      t.end_date
                        ? new Date(t.end_date).toLocaleDateString()
                        : "Ongoing"
                    }
                  />
                  <button
                    className="delete-diagnostic-row-btn"
                    onClick={() => removeDiagnostic("active", t.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            {editingActiveTreatment ? (
              <div className="diagnostic-row editable active-treatment-edit">
                <LabeledInput
                  label="Condition"
                  placeholder="e.g. Ear Infection"
                  value={editingActiveTreatment.condition}
                  onChange={(e) =>
                    handleEditingChange("active", "condition", e.target.value)
                  }
                  required
                />
                <LabeledInput
                  label="Treatment"
                  placeholder="e.g. Medicated drops"
                  value={editingActiveTreatment.treatment}
                  onChange={(e) =>
                    handleEditingChange("active", "treatment", e.target.value)
                  }
                  required
                />
                <LabeledInput
                  label="Start Date"
                  type="date"
                  value={editingActiveTreatment.start_date}
                  onChange={(e) =>
                    handleEditingChange("active", "start_date", e.target.value)
                  }
                  required
                />
                <LabeledInput
                  label="End Date"
                  type="date"
                  value={editingActiveTreatment.end_date || ""}
                  onChange={(e) =>
                    handleEditingChange("active", "end_date", e.target.value)
                  }
                />
                <div className="edit-row-actions">
                  <Button
                    text="Save"
                    size="sm"
                    color="accent"
                    onClick={() => handleCommitNewDiagnostic("active")}
                  />
                  <Button
                    text="Cancel"
                    size="sm"
                    color="secondary"
                    onClick={() => handleCancelEditing("active")}
                  />
                </div>
              </div>
            ) : (
              <Button
                text="Add New Treatment"
                color="primary"
                size="sm"
                onClick={() => handleStartEditing("active")}
              />
            )}
          </div>
        </div>

        {saveError && <div className="error-banner">{saveError}</div>}
      </div>
    </ProtectedRoute>
  );
}
