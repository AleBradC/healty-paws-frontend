// Payload types for registration
export interface DoctorServicePayload {
  name: string;
  price: number;
}

export interface DoctorPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  specializationName: string;
  clinicName: string;
  clinicAddress: string;
  services: DoctorServicePayload[];
}

export interface OwnerPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PetPayload {
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
}

export interface RegisterDoctorPayload {
  role: "doctor";
  doctor: DoctorPayload;
}

export interface RegisterOwnerPayload {
  role: "owner";
  owner: OwnerPayload;
  pet: PetPayload;
}

export type UnifiedRegisterPayload =
  | RegisterDoctorPayload
  | RegisterOwnerPayload;

// User and domain entities
export interface Users {
  id: string | undefined;
  email: string;
  hash: string;
  salt: string;
  role: "owner" | "doctor";
}
export interface Specialization {
  id: string;
  name: string;
  services: Service[];
}

export interface Service {
  id: string;
  specialization_id: string;
  name: string;
  price: number;
}

export interface Availability {
  id: string;
  available_datetime: string;
}

export interface LifelongCondition {
  id: string;
  condition: string;
  treatment: string;
}

export interface ActiveTreatment {
  id: string;
  condition: string;
  treatment: string;
  start_date: string;
  end_date: string;
}

// Owner, Pet, Doctor entities with relationships
export interface Owner {
  id: string | undefined;
  name: string;
  user_id: string;
  email?: string;
  pets?: Pet[];
  appointments?: Appointment[];
}

export interface Pet {
  id: string;
  name: string;
  owner: Owner;
  type: string;
  breed: string;
  age: string;
  weight: string;
  lifelong_conditions?: LifelongCondition[];
  active_treatments?: ActiveTreatment[];
  appointments?: Appointment[];
}

export interface Doctor {
  id: string;
  name: string;
  user_id?: string;
  imageUrl?: string;
  email?: string;
  clinic_name?: string;
  clinic_address?: string;
  specializations?: Specialization[];
  availabilities?: Availability[];
  appointments?: Appointment[];
  patients?: Pet[];
}

// Appointment entity with nested relations
export interface Appointment {
  id: string;
  datetime: string;
  status: string;
  reason: string;
  consultation_type: string;
  investigation: string;
  investigation_result: string;
  doctor: {
    id: string;
    name: string;
    clinic_name: string;
  };
  patient: {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: string;
    weight: string;
    owner: {
      id: string;
      name: string;
    };
    lifelong_conditions: LifelongCondition[];
    active_treatments: ActiveTreatment[];
  };
}

// Utility types
export interface Slot {
  date: string;
  time: string;
  datetime: string;
}

export interface AppointmentPetDetails {
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
}

export interface LifelongConditionInput {
  id: string;
  condition: string;
  treatment: string;
}

export interface ActiveTreatmentInput {
  id: string;
  condition: string;
  treatment: string;
  start_date: string;
  end_date: string;
}
