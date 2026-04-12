
import { useParams } from "react-router-dom";
import { ConditionSummaryCard } from "../../components/features/ConditionSummaryCard/ConditionSummaryCard";
import InfoBlock from "../../components/features/InfoBlock/InfoBlock";
import { ProtectedRoute } from "../../router/ProtectedRoute/ProtectedRoute";
import { useAppointment } from "../../lib/graphql/appointments/useAppointment";
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

        <div className="details-section">
          <div className="summary-grid">
            <InfoBlock
              label="Patient Name"
              value={appointment?.patient?.name}
            />
            <InfoBlock
              label="Owner"
              value={appointment?.patient?.owner?.name}
            />
            <InfoBlock label="Doctor" value={appointment?.doctor?.name} />
            <InfoBlock
              label="Appointment Date"
              value={new Date(appointment?.datetime).toLocaleDateString()}
            />
          </div>
        </div>

        <div className="details-section">
          <h2 className="section-title">Consultation Details</h2>
          <div className="summary-grid">
            <InfoBlock label="Reason for Visit" value={appointment?.reason} />
            <InfoBlock
              label="Type of Consult"
              value={appointment?.consultation_type}
            />
            <InfoBlock
              label="Investigation"
              value={appointment?.investigation}
            />
            <InfoBlock
              label="Investigation Result"
              value={appointment?.investigation_result}
            />
          </div>
        </div>

        <div className="details-section">
          <h2 className="section-title">Doctor's Diagnostic</h2>
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
