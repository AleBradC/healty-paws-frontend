
import { useParams } from "react-router-dom";
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
  const appointmentDate = new Date(appointment.datetime);
  const ownerName = appointment.patient?.owner?.name ?? "N/A";
  const doctorName = appointment.doctor?.name ?? "N/A";
  const clinicName = appointment.doctor?.clinic_name ?? "N/A";

  return (
    <ProtectedRoute>
      <div className="summary-page-wrapper">
        <article className="medical-letter">
          <header className="letter-header">
            <p className="letter-kicker">Veterinary Medical Summary</p>
            <h1 className="page-main-title">Appointment Summary</h1>
            <p className="letter-date">
              Issued on{" "}
              {appointmentDate.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          <section className="letter-section">
            <h2>Patient Information</h2>
            <div className="summary-grid">
              <p><strong>Pet:</strong> {appointment.patient?.name ?? "N/A"}</p>
              <p><strong>Owner:</strong> {ownerName}</p>
              <p><strong>Species:</strong> {appointment.patient?.type ?? "N/A"}</p>
              <p><strong>Breed:</strong> {appointment.patient?.breed ?? "N/A"}</p>
              <p><strong>Age:</strong> {appointment.patient?.age ?? "N/A"} years</p>
              <p><strong>Weight:</strong> {appointment.patient?.weight ?? "N/A"} kg</p>
            </div>
          </section>

          <section className="letter-section">
            <h2>Consultation Record</h2>
            <div className="consultation-record-grid">
              <div className="consultation-record-item">
                <h3>Consultation Type</h3>
                <p>{appointment.consultation_type || "General Clinic Visit"}</p>
              </div>

              <div className="consultation-record-item">
                <h3>Reason for Visit</h3>
                <p>{appointment.reason || "No reason specified."}</p>
              </div>

              <div className="consultation-record-item">
                <h3>Investigation Performed</h3>
                <p>{appointment.investigation || "No investigation details recorded."}</p>
              </div>

              <div className="consultation-record-item">
                <h3>Investigation Result</h3>
                <p>{appointment.investigation_result || "No results available."}</p>
              </div>
            </div>
          </section>

          <section className="letter-section">
            <h2>Clinical Findings</h2>
            <h3>Lifelong Conditions</h3>
            {lifelongConditions.length > 0 ? (
              <ul className="summary-list">
                {lifelongConditions.map((condition) => (
                  <li key={condition.id}>
                    <strong>{condition.condition}:</strong> {condition.treatment}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-record-note">No lifelong conditions were recorded.</p>
            )}

            <h3>Active Treatments</h3>
            {activeTreatments.length > 0 ? (
              <ul className="summary-list">
                {activeTreatments.map((treatment) => (
                  <li key={treatment.id}>
                    <strong>{treatment.condition}:</strong> {treatment.treatment}
                    <span className="treatment-dates">
                      {" "}
                      (from {new Date(treatment.start_date).toLocaleDateString()}
                      {treatment.end_date
                        ? ` to ${new Date(treatment.end_date).toLocaleDateString()}`
                        : " - ongoing"})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-record-note">No active treatments were prescribed.</p>
            )}
          </section>

          <footer className="letter-footer">
            <p>Sincerely,</p>
            <p><strong>Dr. {doctorName}</strong></p>
            <p>{clinicName}</p>
          </footer>
        </article>
      </div>
    </ProtectedRoute>
  );
}
