
import { useParams } from "react-router-dom";
import { ConditionSummaryCard } from "../../components/features/ConditionSummaryCard/ConditionSummaryCard";
import InfoBlock from "../../components/features/InfoBlock/InfoBlock";
import { ProtectedRoute } from "../../router/ProtectedRoute/ProtectedRoute";
import { useAppointment } from "../../lib/graphql/appointments/useAppointment";
import { DetailsSection } from "../../components/ui/DetailsSection/DetailsSection";
import "./styles.css";

export default function AppointmentSummaryPage() {
  const params = useParams() as { appointmentId?: string };
  const appointmentId = params.appointmentId ?? "";

  const { appointment, error: fetchError } = useAppointment(appointmentId);

  if (fetchError || !appointment) {
    return (
      <ProtectedRoute>
        <div className="summary-page-wrapper">
          <h1>Appointment not found.</h1>
        </div>
      </ProtectedRoute>
    );
  }

  const lifelongConditions = appointment.patient?.lifelong_conditions ?? [];
  const activeTreatments = appointment.patient?.active_treatments ?? [];

  return (
    <ProtectedRoute>
      <div className="summary-page-wrapper">
        <h1 className="page-main-title">Appointment Summary</h1>

        <DetailsSection title="Visit Information">
          <div className="summary-grid">
            <InfoBlock label="Doctor" value={appointment?.doctor?.name} />
            <InfoBlock
              label="Clinic"
              value={appointment?.doctor?.clinic_name}
            />
            <InfoBlock
              label="Appointment Date"
              value={new Date(appointment?.datetime).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            />
          </div>
        </DetailsSection>

        <DetailsSection title="Patient Details">
          <div className="summary-grid">
            <InfoBlock
              label="Patient Name"
              value={appointment?.patient?.name}
            />
            <InfoBlock
              label="Owner"
              value={appointment?.patient?.owner?.name}
            />
            <InfoBlock
              label="Pet Type"
              value={appointment?.patient?.type}
            />
            <InfoBlock
              label="Breed"
              value={appointment?.patient?.breed}
            />
            <InfoBlock
              label="Age"
              value={`${appointment?.patient?.age} years`}
            />
            <InfoBlock
              label="Weight"
              value={`${appointment?.patient?.weight} kg`}
            />
          </div>
        </DetailsSection>

        <DetailsSection title="Consultation Details">
          <div className="diagnostic-summary">
            <h4>Type of Consultation</h4>
            <p className="detailed-note-text">
              {appointment?.consultation_type || "General Clinic Visit"}
            </p>
          </div>

          <div className="diagnostic-summary">
            <h4>Reason for Visit</h4>
            <p className="detailed-note-text">
              {appointment?.reason || "No reason specified."}
            </p>
          </div>

          <div className="diagnostic-summary">
            <h4>Investigation</h4>
            <p className="detailed-note-text">
              {appointment?.investigation || "No investigation details recorded."}
            </p>
          </div>

          <div className="diagnostic-summary">
            <h4>Investigation Result</h4>
            <p className="detailed-note-text">
              {appointment?.investigation_result || "No results available."}
            </p>
          </div>
        </DetailsSection>

        <DetailsSection title="Doctor's Diagnostic">
          <div className="diagnostic-summary">
            <h4>Lifelong Conditions</h4>
            {lifelongConditions.length > 0 ? (
              lifelongConditions.map((condition) => (
                <ConditionSummaryCard
                  key={condition?.id}
                  disease={condition?.condition}
                  treatment={condition?.treatment}
                />
              ))
            ) : (
              <p className="no-record-note">
                No lifelong conditions were recorded for this visit.
              </p>
            )}
          </div>
          <div className="diagnostic-summary">
            <h4>Active Treatments</h4>
            {activeTreatments?.length > 0 ? (
              activeTreatments?.map((treatment) => (
                <ConditionSummaryCard
                  key={treatment?.id}
                  disease={treatment?.condition}
                  treatment={treatment?.treatment}
                  active
                />
              ))
            ) : (
              <p className="no-record-note">
                No active treatments were prescribed for this visit.
              </p>
            )}
          </div>
        </DetailsSection>
      </div>
    </ProtectedRoute>
  );
}
