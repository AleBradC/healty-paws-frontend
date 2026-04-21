/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ActiveTreatment = {
  __typename?: 'ActiveTreatment';
  condition: Scalars['String']['output'];
  end_date?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  start_date: Scalars['String']['output'];
  treatment: Scalars['String']['output'];
};

export type ActiveTreatmentInput = {
  condition: Scalars['String']['input'];
  end_date?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  start_date: Scalars['String']['input'];
  treatment: Scalars['String']['input'];
};

export type AddDoctorAvailabilityInput = {
  availabilities: Array<Scalars['String']['input']>;
  doctorId: Scalars['ID']['input'];
};

export type AddDoctorSpecializationInput = {
  doctorId: Scalars['ID']['input'];
  services: Array<ServiceInput>;
  specializationName: Scalars['String']['input'];
};

export type Appointment = {
  __typename?: 'Appointment';
  consultation_type?: Maybe<Scalars['String']['output']>;
  datetime: Scalars['String']['output'];
  doctor?: Maybe<Doctor>;
  id: Scalars['ID']['output'];
  investigation?: Maybe<Scalars['String']['output']>;
  investigation_result?: Maybe<Scalars['String']['output']>;
  patient?: Maybe<Pet>;
  reason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<AppointmentStatus>;
};

export type AppointmentPetDetailsInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  breed?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type AppointmentStatus =
  | 'Cancelled'
  | 'Completed'
  | 'Confirmed'
  | 'Denied'
  | 'Pending'
  | 'Start'
  | 'Upcoming';

export type Availability = {
  __typename?: 'Availability';
  available_datetime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type CreateAppointmentInput = {
  appointmentDatetime: Scalars['String']['input'];
  consultationType: Scalars['String']['input'];
  doctorId: Scalars['ID']['input'];
  petId: Scalars['ID']['input'];
  status: AppointmentStatus;
};

export type CreatePetInput = {
  age: Scalars['Int']['input'];
  breed: Scalars['String']['input'];
  name: Scalars['String']['input'];
  ownerId: Scalars['ID']['input'];
  type: Scalars['String']['input'];
  weight: Scalars['Float']['input'];
};

export type Doctor = {
  __typename?: 'Doctor';
  appointments?: Maybe<Array<Appointment>>;
  availabilities?: Maybe<Array<Availability>>;
  clinic_address?: Maybe<Scalars['String']['output']>;
  clinic_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  patients?: Maybe<Array<Pet>>;
  specializations?: Maybe<Array<Specialization>>;
};

export type DoctorsSubList = {
  __typename?: 'DoctorsSubList';
  items: Array<Doctor>;
  totalCount: Scalars['Int']['output'];
};

export type LifelongCondition = {
  __typename?: 'LifelongCondition';
  condition: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  treatment: Scalars['String']['output'];
};

export type LifelongConditionInput = {
  condition: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  treatment: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addDoctorAvailability?: Maybe<Doctor>;
  addDoctorSpecialization?: Maybe<Doctor>;
  createAppointment?: Maybe<Appointment>;
  createPet?: Maybe<Pet>;
  removeAppointment?: Maybe<Appointment>;
  removeDoctorAvailability?: Maybe<Doctor>;
  removeDoctorSpecialization?: Maybe<Doctor>;
  updateAppointment?: Maybe<Appointment>;
  updateDoctorProfile?: Maybe<Doctor>;
  updateDoctorSpecialization?: Maybe<Doctor>;
  updateOwnerProfile?: Maybe<Owner>;
  updatePet?: Maybe<Pet>;
};


export type MutationAddDoctorAvailabilityArgs = {
  input: AddDoctorAvailabilityInput;
};


export type MutationAddDoctorSpecializationArgs = {
  input: AddDoctorSpecializationInput;
};


export type MutationCreateAppointmentArgs = {
  input: CreateAppointmentInput;
};


export type MutationCreatePetArgs = {
  input: CreatePetInput;
};


export type MutationRemoveAppointmentArgs = {
  input: RemoveAppointmentInput;
};


export type MutationRemoveDoctorAvailabilityArgs = {
  input: RemoveDoctorAvailabilityInput;
};


export type MutationRemoveDoctorSpecializationArgs = {
  input: RemoveDoctorSpecializationInput;
};


export type MutationUpdateAppointmentArgs = {
  input: UpdateAppointmentInput;
};


export type MutationUpdateDoctorProfileArgs = {
  input: UpdateDoctorProfileInput;
};


export type MutationUpdateDoctorSpecializationArgs = {
  input: UpdateDoctorSpecializationInput;
};


export type MutationUpdateOwnerProfileArgs = {
  input: UpdateOwnerProfileInput;
};


export type MutationUpdatePetArgs = {
  input: UpdatePetInput;
};

export type Owner = {
  __typename?: 'Owner';
  appointments?: Maybe<Array<Appointment>>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  pets?: Maybe<Array<Pet>>;
};

export type Pet = {
  __typename?: 'Pet';
  active_treatments?: Maybe<Array<ActiveTreatment>>;
  age?: Maybe<Scalars['Int']['output']>;
  appointments?: Maybe<Array<Appointment>>;
  breed?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lifelong_conditions?: Maybe<Array<LifelongCondition>>;
  name: Scalars['String']['output'];
  owner?: Maybe<Owner>;
  type?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  appointment?: Maybe<Appointment>;
  doctor?: Maybe<Doctor>;
  doctors: DoctorsSubList;
  owner?: Maybe<Owner>;
  owners?: Maybe<Array<Owner>>;
  pet?: Maybe<Pet>;
};


export type QueryAppointmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDoctorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDoctorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOwnerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPetArgs = {
  id: Scalars['ID']['input'];
};

export type RemoveAppointmentInput = {
  appointmentId: Scalars['ID']['input'];
};

export type RemoveDoctorAvailabilityInput = {
  availabilityId: Scalars['ID']['input'];
  doctorId: Scalars['ID']['input'];
};

export type RemoveDoctorSpecializationInput = {
  doctorId: Scalars['ID']['input'];
  specializationId: Scalars['ID']['input'];
};

export type Service = {
  __typename?: 'Service';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  specialization_id: Scalars['ID']['output'];
};

export type ServiceInput = {
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type ServiceUpdateInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type Specialization = {
  __typename?: 'Specialization';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  services?: Maybe<Array<Service>>;
};

export type UpdateAppointmentInput = {
  activeTreatments?: InputMaybe<Array<ActiveTreatmentInput>>;
  appointmentId: Scalars['ID']['input'];
  consultationType?: InputMaybe<Scalars['String']['input']>;
  investigation?: InputMaybe<Scalars['String']['input']>;
  investigationResult?: InputMaybe<Scalars['String']['input']>;
  lifelongConditions?: InputMaybe<Array<LifelongConditionInput>>;
  patientDetails?: InputMaybe<AppointmentPetDetailsInput>;
  reason?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDoctorProfileInput = {
  clinicAddress?: InputMaybe<Scalars['String']['input']>;
  clinicName?: InputMaybe<Scalars['String']['input']>;
  doctorId: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDoctorSpecializationInput = {
  doctorId: Scalars['ID']['input'];
  services: Array<ServiceUpdateInput>;
  specializationId: Scalars['ID']['input'];
};

export type UpdateOwnerProfileInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  ownerId: Scalars['ID']['input'];
};

export type UpdatePetInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  breed?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  petId: Scalars['ID']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: UserRole;
  salt: Scalars['String']['output'];
};

export type UserRole =
  | 'doctor'
  | 'owner';

export type GetOwnerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOwnerQuery = { __typename?: 'Query', owner?: { __typename?: 'Owner', id: string, name: string, email?: string | null, pets?: Array<{ __typename?: 'Pet', id: string, name: string, type?: string | null, breed?: string | null, age?: number | null, weight?: number | null, lifelong_conditions?: Array<{ __typename?: 'LifelongCondition', id: string, condition: string, treatment: string }> | null, active_treatments?: Array<{ __typename?: 'ActiveTreatment', id: string, start_date: string, end_date?: string | null, condition: string, treatment: string }> | null, appointments?: Array<{ __typename?: 'Appointment', id: string, datetime: string, status?: AppointmentStatus | null, doctor?: { __typename?: 'Doctor', id: string, name: string } | null, patient?: { __typename?: 'Pet', id: string, name: string } | null }> | null }> | null } | null };

export type GetDoctorsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDoctorsQuery = { __typename?: 'Query', doctors: { __typename?: 'DoctorsSubList', totalCount: number, items: Array<{ __typename?: 'Doctor', id: string, name: string, clinic_address?: string | null, clinic_name?: string | null, email?: string | null, specializations?: Array<{ __typename?: 'Specialization', id: string, name: string }> | null }> } };

export type GetDoctorQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDoctorQuery = { __typename?: 'Query', doctor?: { __typename?: 'Doctor', id: string, name: string, email?: string | null, clinic_name?: string | null, clinic_address?: string | null, specializations?: Array<{ __typename?: 'Specialization', id: string, name: string, services?: Array<{ __typename?: 'Service', id: string, name: string, price: number }> | null }> | null, availabilities?: Array<{ __typename?: 'Availability', id: string, available_datetime: string }> | null, appointments?: Array<{ __typename?: 'Appointment', id: string, datetime: string, status?: AppointmentStatus | null, patient?: { __typename?: 'Pet', id: string, name: string, owner?: { __typename?: 'Owner', id: string, name: string } | null } | null }> | null, patients?: Array<{ __typename?: 'Pet', id: string, name: string, owner?: { __typename?: 'Owner', id: string, name: string } | null }> | null } | null };

export type GetAppointmentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAppointmentQuery = { __typename?: 'Query', appointment?: { __typename?: 'Appointment', id: string, datetime: string, status?: AppointmentStatus | null, reason?: string | null, consultation_type?: string | null, investigation?: string | null, investigation_result?: string | null, doctor?: { __typename?: 'Doctor', id: string, name: string, clinic_name?: string | null } | null, patient?: { __typename?: 'Pet', id: string, name: string, type?: string | null, breed?: string | null, age?: number | null, weight?: number | null, owner?: { __typename?: 'Owner', id: string, name: string } | null, lifelong_conditions?: Array<{ __typename?: 'LifelongCondition', id: string, condition: string, treatment: string }> | null, active_treatments?: Array<{ __typename?: 'ActiveTreatment', id: string, start_date: string, end_date?: string | null, treatment: string, condition: string }> | null } | null } | null };

export type GetPetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPetQuery = { __typename?: 'Query', pet?: { __typename?: 'Pet', id: string, name: string, type?: string | null, breed?: string | null, age?: number | null, weight?: number | null, owner?: { __typename?: 'Owner', id: string, name: string, email?: string | null } | null, lifelong_conditions?: Array<{ __typename?: 'LifelongCondition', id: string, condition: string, treatment: string }> | null, active_treatments?: Array<{ __typename?: 'ActiveTreatment', id: string, condition: string, treatment: string, start_date: string }> | null, appointments?: Array<{ __typename?: 'Appointment', id: string, datetime: string, consultation_type?: string | null, doctor?: { __typename?: 'Doctor', id: string, name: string } | null }> | null } | null };

export type UpdateDoctorProfileMutationVariables = Exact<{
  input: UpdateDoctorProfileInput;
}>;


export type UpdateDoctorProfileMutation = { __typename?: 'Mutation', updateDoctorProfile?: { __typename?: 'Doctor', id: string, name: string, clinic_name?: string | null, clinic_address?: string | null } | null };

export type AddDoctorSpecializationMutationVariables = Exact<{
  input: AddDoctorSpecializationInput;
}>;


export type AddDoctorSpecializationMutation = { __typename?: 'Mutation', addDoctorSpecialization?: { __typename?: 'Doctor', id: string, name: string, specializations?: Array<{ __typename?: 'Specialization', id: string, name: string, services?: Array<{ __typename?: 'Service', id: string, name: string, price: number }> | null }> | null } | null };

export type UpdateDoctorSpecializationMutationVariables = Exact<{
  input: UpdateDoctorSpecializationInput;
}>;


export type UpdateDoctorSpecializationMutation = { __typename?: 'Mutation', updateDoctorSpecialization?: { __typename?: 'Doctor', id: string, name: string, specializations?: Array<{ __typename?: 'Specialization', id: string, name: string, services?: Array<{ __typename?: 'Service', id: string, name: string, price: number }> | null }> | null } | null };

export type RemoveDoctorSpecializationMutationVariables = Exact<{
  input: RemoveDoctorSpecializationInput;
}>;


export type RemoveDoctorSpecializationMutation = { __typename?: 'Mutation', removeDoctorSpecialization?: { __typename?: 'Doctor', specializations?: Array<{ __typename?: 'Specialization', id: string, name: string, services?: Array<{ __typename?: 'Service', id: string, name: string, price: number, specialization_id: string }> | null }> | null } | null };

export type AddDoctorAvailabilityMutationVariables = Exact<{
  input: AddDoctorAvailabilityInput;
}>;


export type AddDoctorAvailabilityMutation = { __typename?: 'Mutation', addDoctorAvailability?: { __typename?: 'Doctor', id: string, name: string, availabilities?: Array<{ __typename?: 'Availability', id: string, available_datetime: string }> | null } | null };

export type RemoveDoctorAvailabilityMutationVariables = Exact<{
  input: RemoveDoctorAvailabilityInput;
}>;


export type RemoveDoctorAvailabilityMutation = { __typename?: 'Mutation', removeDoctorAvailability?: { __typename?: 'Doctor', id: string, name: string, availabilities?: Array<{ __typename?: 'Availability', id: string, available_datetime: string }> | null } | null };

export type CreateAppointmentMutationVariables = Exact<{
  input: CreateAppointmentInput;
}>;


export type CreateAppointmentMutation = { __typename?: 'Mutation', createAppointment?: { __typename?: 'Appointment', id: string, datetime: string, status?: AppointmentStatus | null, consultation_type?: string | null, doctor?: { __typename?: 'Doctor', id: string, name: string } | null, patient?: { __typename?: 'Pet', id: string, name: string, owner?: { __typename?: 'Owner', id: string, name: string } | null } | null } | null };

export type UpdateAppointmentMutationVariables = Exact<{
  input: UpdateAppointmentInput;
}>;


export type UpdateAppointmentMutation = { __typename?: 'Mutation', updateAppointment?: { __typename?: 'Appointment', id: string, status?: AppointmentStatus | null, reason?: string | null, consultation_type?: string | null, investigation?: string | null, investigation_result?: string | null, patient?: { __typename?: 'Pet', id: string, name: string, weight?: number | null, age?: number | null, lifelong_conditions?: Array<{ __typename?: 'LifelongCondition', id: string, condition: string, treatment: string }> | null, active_treatments?: Array<{ __typename?: 'ActiveTreatment', id: string, condition: string, treatment: string, start_date: string, end_date?: string | null }> | null } | null } | null };

export type RemoveAppointmentMutationVariables = Exact<{
  input: RemoveAppointmentInput;
}>;


export type RemoveAppointmentMutation = { __typename?: 'Mutation', removeAppointment?: { __typename?: 'Appointment', id: string, datetime: string, status?: AppointmentStatus | null, doctor?: { __typename?: 'Doctor', id: string, name: string } | null, patient?: { __typename?: 'Pet', id: string, name: string } | null } | null };

export type CreatePetMutationVariables = Exact<{
  input: CreatePetInput;
}>;


export type CreatePetMutation = { __typename?: 'Mutation', createPet?: { __typename?: 'Pet', id: string, name: string, age?: number | null, weight?: number | null, type?: string | null, breed?: string | null, lifelong_conditions?: Array<{ __typename?: 'LifelongCondition', id: string, condition: string, treatment: string }> | null, active_treatments?: Array<{ __typename?: 'ActiveTreatment', id: string, condition: string, treatment: string, start_date: string, end_date?: string | null }> | null } | null };

export type UpdatePetMutationVariables = Exact<{
  input: UpdatePetInput;
}>;


export type UpdatePetMutation = { __typename?: 'Mutation', updatePet?: { __typename?: 'Pet', id: string, name: string, age?: number | null, weight?: number | null, type?: string | null, breed?: string | null, lifelong_conditions?: Array<{ __typename?: 'LifelongCondition', id: string, condition: string, treatment: string }> | null, active_treatments?: Array<{ __typename?: 'ActiveTreatment', id: string, condition: string, treatment: string, end_date?: string | null, start_date: string }> | null } | null };

export type UpdateOwnerProfileMutationVariables = Exact<{
  input: UpdateOwnerProfileInput;
}>;


export type UpdateOwnerProfileMutation = { __typename?: 'Mutation', updateOwnerProfile?: { __typename?: 'Owner', id: string, name: string } | null };


export const GetOwnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOwner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"lifelong_conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active_treatments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appointments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"datetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOwnerQuery, GetOwnerQueryVariables>;
export const GetDoctorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDoctors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"doctors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"clinic_address"}},{"kind":"Field","name":{"kind":"Name","value":"clinic_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"specializations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetDoctorsQuery, GetDoctorsQueryVariables>;
export const GetDoctorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDoctor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"doctor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"clinic_name"}},{"kind":"Field","name":{"kind":"Name","value":"clinic_address"}},{"kind":"Field","name":{"kind":"Name","value":"specializations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"availabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"available_datetime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appointments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"datetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"patients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetDoctorQuery, GetDoctorQueryVariables>;
export const GetAppointmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAppointment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"datetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"consultation_type"}},{"kind":"Field","name":{"kind":"Name","value":"investigation"}},{"kind":"Field","name":{"kind":"Name","value":"investigation_result"}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"clinic_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lifelong_conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active_treatments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAppointmentQuery, GetAppointmentQueryVariables>;
export const GetPetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lifelong_conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active_treatments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appointments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"datetime"}},{"kind":"Field","name":{"kind":"Name","value":"consultation_type"}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPetQuery, GetPetQueryVariables>;
export const UpdateDoctorProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDoctorProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDoctorProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDoctorProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"clinic_name"}},{"kind":"Field","name":{"kind":"Name","value":"clinic_address"}}]}}]}}]} as unknown as DocumentNode<UpdateDoctorProfileMutation, UpdateDoctorProfileMutationVariables>;
export const AddDoctorSpecializationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddDoctorSpecialization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddDoctorSpecializationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addDoctorSpecialization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"specializations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddDoctorSpecializationMutation, AddDoctorSpecializationMutationVariables>;
export const UpdateDoctorSpecializationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDoctorSpecialization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDoctorSpecializationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDoctorSpecialization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"specializations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDoctorSpecializationMutation, UpdateDoctorSpecializationMutationVariables>;
export const RemoveDoctorSpecializationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveDoctorSpecialization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveDoctorSpecializationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeDoctorSpecialization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"specializations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"specialization_id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RemoveDoctorSpecializationMutation, RemoveDoctorSpecializationMutationVariables>;
export const AddDoctorAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddDoctorAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddDoctorAvailabilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addDoctorAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"availabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"available_datetime"}}]}}]}}]}}]} as unknown as DocumentNode<AddDoctorAvailabilityMutation, AddDoctorAvailabilityMutationVariables>;
export const RemoveDoctorAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveDoctorAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveDoctorAvailabilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeDoctorAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"availabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"available_datetime"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveDoctorAvailabilityMutation, RemoveDoctorAvailabilityMutationVariables>;
export const CreateAppointmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAppointment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAppointmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"datetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"consultation_type"}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateAppointmentMutation, CreateAppointmentMutationVariables>;
export const UpdateAppointmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAppointment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAppointmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"consultation_type"}},{"kind":"Field","name":{"kind":"Name","value":"investigation"}},{"kind":"Field","name":{"kind":"Name","value":"investigation_result"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"lifelong_conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active_treatments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>;
export const RemoveAppointmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAppointment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveAppointmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"datetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"doctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveAppointmentMutation, RemoveAppointmentMutationVariables>;
export const CreatePetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"lifelong_conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active_treatments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePetMutation, CreatePetMutationVariables>;
export const UpdatePetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"lifelong_conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active_treatments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"treatment"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePetMutation, UpdatePetMutationVariables>;
export const UpdateOwnerProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOwnerProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOwnerProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOwnerProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateOwnerProfileMutation, UpdateOwnerProfileMutationVariables>;