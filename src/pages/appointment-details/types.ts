import type { Pet } from "../../types";

export type EditableAppointmentDetails = {
  reason: string;
  consultation_type: string;
  investigation: string;
  investigation_result: string;
};

export type EditablePatientDetails = Omit<
  Pet,
  "id" | "owner" | "appointments" | "lifelong_conditions" | "active_treatments"
>;
