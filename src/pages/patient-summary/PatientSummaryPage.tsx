
import { useParams, useNavigate } from "react-router-dom";
import InfoBlock from "../../components/features/InfoBlock/InfoBlock";
import { ConditionSummaryCard } from "../../components/features/ConditionSummaryCard/ConditionSummaryCard";
import { ProtectedRoute } from "../../router/ProtectedRoute/ProtectedRoute";
import { usePet } from "../../lib/graphql/patients/usePet";
import { appointmentSummaryPath } from "../../utils/path";
import { Button } from "../../components/ui/Button/Button";
import "./styles.css";

export default function PatientSummaryPage() {
  const navigate = useNavigate();
  const params = useParams() as { petId?: string };

  const petId = params.petId ?? "";
  const { pet, error } = usePet(petId);

  if (error || !pet) {
    return (
      <ProtectedRoute>
        <div className="summary-page-wrapper">
          <h1>Patient not found.</h1>
        </div>
      </ProtectedRoute>
    );
  }

  const lifelongConditions = pet?.lifelong_conditions ?? [];
  const activeTreatments = pet?.active_treatments ?? [];
  const appointments = pet?.appointments ?? [];

  const handleAppointmentClick = (appointmentId: string | number) => {
    navigate(`${appointmentSummaryPath}/${appointmentId}`);
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="summary-page-wrapper">
        <h1 className="page-main-title">Patient Summary</h1>

        <div className="details-section">
          <h2 className="section-title">Patient Details</h2>
          <div className="summary-grid">
            <InfoBlock label="Pet Name" value={pet.name} />
            <InfoBlock label="Owner" value={pet.owner?.name ?? "Unknown"} />
            <InfoBlock label="Pet Type" value={pet.type ?? "Unknown"} />
            <InfoBlock label="Breed" value={pet.breed ?? "Unknown"} />
            <InfoBlock label="Age (years)" value={String(pet.age ?? "")} />
            <InfoBlock label="Weight (kg)" value={String(pet.weight ?? "")} />
          </div>
        </div>

        <div className="details-section">
          <h2 className="section-title">Health Record</h2>
          <div className="diagnostic-summary">
            <h4>Lifelong Conditions</h4>
            {lifelongConditions.length > 0 ? (
              lifelongConditions.map((condition) => (
                <ConditionSummaryCard
                  key={condition.id}
                  disease={condition.condition}
                  treatment={condition.treatment}
                />
              ))
            ) : (
              <p className="no-record-note">No lifelong conditions recorded.</p>
            )}
          </div>
          <div className="diagnostic-summary">
            <h4>Active Treatments</h4>
            {activeTreatments.length > 0 ? (
              activeTreatments.map((condition) => (
                <ConditionSummaryCard
                  key={condition.id}
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

        <div className="details-section">
          <h2 className="section-title">Appointment History</h2>
          <div className="appointment-history-list">
            {appointments.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Consultation Type</th>
                    <th>Doctor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app.id}>
                      <td>{app.datetime}</td>
                      <td>{app.consultation_type ?? "General"}</td>
                      <td>{app.doctor?.name ?? "Unknown"}</td>
                      <td>
                        <Button
                          text="View Details"
                          size="sm"
                          color="secondary"
                          onClick={() => handleAppointmentClick(app.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-record-note">No past appointments found.</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
