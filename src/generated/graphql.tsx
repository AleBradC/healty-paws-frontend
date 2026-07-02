import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
const defaultOptions = {} as const;
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type ActiveTreatment = {
  __typename?: "ActiveTreatment";
  condition: Scalars["String"]["output"];
  end_date?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  start_date: Scalars["String"]["output"];
  treatment: Scalars["String"]["output"];
};

export type ActiveTreatmentInput = {
  condition: Scalars["String"]["input"];
  end_date?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  start_date: Scalars["String"]["input"];
  treatment: Scalars["String"]["input"];
};

export type AddDoctorAvailabilityInput = {
  availabilities: Array<Scalars["String"]["input"]>;
  doctorId: Scalars["ID"]["input"];
};

export type AddDoctorSpecializationInput = {
  doctorId: Scalars["ID"]["input"];
  services: Array<ServiceInput>;
  specializationName: Scalars["String"]["input"];
};

export type Appointment = {
  __typename?: "Appointment";
  consultation_type?: Maybe<Scalars["String"]["output"]>;
  datetime: Scalars["String"]["output"];
  doctor?: Maybe<Doctor>;
  id: Scalars["ID"]["output"];
  investigation?: Maybe<Scalars["String"]["output"]>;
  investigation_result?: Maybe<Scalars["String"]["output"]>;
  patient?: Maybe<Pet>;
  reason?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<AppointmentStatus>;
};

export type AppointmentPetDetailsInput = {
  age?: InputMaybe<Scalars["Int"]["input"]>;
  breed?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  weight?: InputMaybe<Scalars["Float"]["input"]>;
};

export enum AppointmentStatus {
  Cancelled = "Cancelled",
  Completed = "Completed",
  Confirmed = "Confirmed",
  Denied = "Denied",
  Pending = "Pending",
  Upcoming = "Upcoming",
}

export type Availability = {
  __typename?: "Availability";
  available_datetime: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
};

export type CreateAppointmentInput = {
  appointmentDatetime: Scalars["String"]["input"];
  consultationType: Scalars["String"]["input"];
  doctorId: Scalars["ID"]["input"];
  petId: Scalars["ID"]["input"];
  status: AppointmentStatus;
};

export type CreatePetInput = {
  age: Scalars["Int"]["input"];
  breed: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  ownerId: Scalars["ID"]["input"];
  type: Scalars["String"]["input"];
  weight: Scalars["Float"]["input"];
};

export type Doctor = {
  __typename?: "Doctor";
  appointments?: Maybe<Array<Appointment>>;
  availabilities?: Maybe<Array<Availability>>;
  clinic_address?: Maybe<Scalars["String"]["output"]>;
  clinic_name?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  patients?: Maybe<Array<Pet>>;
  specializations?: Maybe<Array<Specialization>>;
};

export type DoctorsSubList = {
  __typename?: "DoctorsSubList";
  items: Array<Doctor>;
  totalCount: Scalars["Int"]["output"];
};

export type LifelongCondition = {
  __typename?: "LifelongCondition";
  condition: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  treatment: Scalars["String"]["output"];
};

export type LifelongConditionInput = {
  condition: Scalars["String"]["input"];
  id?: InputMaybe<Scalars["ID"]["input"]>;
  treatment: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
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
  __typename?: "Owner";
  appointments?: Maybe<Array<Appointment>>;
  email?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  pets?: Maybe<Array<Pet>>;
};

export type Pet = {
  __typename?: "Pet";
  active_treatments?: Maybe<Array<ActiveTreatment>>;
  age?: Maybe<Scalars["Int"]["output"]>;
  appointments?: Maybe<Array<Appointment>>;
  breed?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  lifelong_conditions?: Maybe<Array<LifelongCondition>>;
  name: Scalars["String"]["output"];
  owner?: Maybe<Owner>;
  type?: Maybe<Scalars["String"]["output"]>;
  weight?: Maybe<Scalars["Float"]["output"]>;
};

export type Query = {
  __typename?: "Query";
  appointment?: Maybe<Appointment>;
  doctor?: Maybe<Doctor>;
  doctors: DoctorsSubList;
  owner?: Maybe<Owner>;
  owners?: Maybe<Array<Owner>>;
  pet?: Maybe<Pet>;
};

export type QueryAppointmentArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryDoctorArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryDoctorsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryOwnerArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPetArgs = {
  id: Scalars["ID"]["input"];
};

export type RemoveAppointmentInput = {
  appointmentId: Scalars["ID"]["input"];
};

export type RemoveDoctorAvailabilityInput = {
  availabilityId: Scalars["ID"]["input"];
  doctorId: Scalars["ID"]["input"];
};

export type RemoveDoctorSpecializationInput = {
  doctorId: Scalars["ID"]["input"];
  specializationId: Scalars["ID"]["input"];
};

export type Service = {
  __typename?: "Service";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  price: Scalars["Float"]["output"];
  specialization_id: Scalars["ID"]["output"];
};

export type ServiceInput = {
  name: Scalars["String"]["input"];
  price: Scalars["Float"]["input"];
};

export type ServiceUpdateInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  name: Scalars["String"]["input"];
  price: Scalars["Float"]["input"];
};

export type Specialization = {
  __typename?: "Specialization";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  services?: Maybe<Array<Service>>;
};

export type UpdateAppointmentInput = {
  activeTreatments?: InputMaybe<Array<ActiveTreatmentInput>>;
  appointmentId: Scalars["ID"]["input"];
  consultationType?: InputMaybe<Scalars["String"]["input"]>;
  investigation?: InputMaybe<Scalars["String"]["input"]>;
  investigationResult?: InputMaybe<Scalars["String"]["input"]>;
  lifelongConditions?: InputMaybe<Array<LifelongConditionInput>>;
  patientDetails?: InputMaybe<AppointmentPetDetailsInput>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateDoctorProfileInput = {
  clinicAddress?: InputMaybe<Scalars["String"]["input"]>;
  clinicName?: InputMaybe<Scalars["String"]["input"]>;
  doctorId: Scalars["ID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateDoctorSpecializationInput = {
  doctorId: Scalars["ID"]["input"];
  services: Array<ServiceUpdateInput>;
  specializationId: Scalars["ID"]["input"];
};

export type UpdateOwnerProfileInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
  ownerId: Scalars["ID"]["input"];
};

export type UpdatePetInput = {
  age?: InputMaybe<Scalars["Int"]["input"]>;
  breed?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  petId: Scalars["ID"]["input"];
  type?: InputMaybe<Scalars["String"]["input"]>;
  weight?: InputMaybe<Scalars["Float"]["input"]>;
};

export type User = {
  __typename?: "User";
  email: Scalars["String"]["output"];
  hash: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  role: UserRole;
  salt: Scalars["String"]["output"];
};

export enum UserRole {
  Doctor = "doctor",
  Owner = "owner",
}

export type GetOwnerQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetOwnerQuery = {
  __typename?: "Query";
  owner?: {
    __typename?: "Owner";
    id: string;
    name: string;
    email?: string | null;
    pets?: Array<{
      __typename?: "Pet";
      id: string;
      name: string;
      type?: string | null;
      breed?: string | null;
      age?: number | null;
      weight?: number | null;
      lifelong_conditions?: Array<{
        __typename?: "LifelongCondition";
        id: string;
        condition: string;
        treatment: string;
      }> | null;
      active_treatments?: Array<{
        __typename?: "ActiveTreatment";
        id: string;
        start_date: string;
        end_date?: string | null;
        condition: string;
        treatment: string;
      }> | null;
      appointments?: Array<{
        __typename?: "Appointment";
        id: string;
        datetime: string;
        status?: AppointmentStatus | null;
        doctor?: { __typename?: "Doctor"; id: string; name: string } | null;
        patient?: { __typename?: "Pet"; id: string; name: string } | null;
      }> | null;
    }> | null;
  } | null;
};

export type GetDoctorsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetDoctorsQuery = {
  __typename?: "Query";
  doctors: {
    __typename?: "DoctorsSubList";
    totalCount: number;
    items: Array<{
      __typename?: "Doctor";
      id: string;
      name: string;
      clinic_address?: string | null;
      clinic_name?: string | null;
      email?: string | null;
      specializations?: Array<{
        __typename?: "Specialization";
        id: string;
        name: string;
      }> | null;
    }>;
  };
};

export type GetDoctorQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetDoctorQuery = {
  __typename?: "Query";
  doctor?: {
    __typename?: "Doctor";
    id: string;
    name: string;
    email?: string | null;
    clinic_name?: string | null;
    clinic_address?: string | null;
    specializations?: Array<{
      __typename?: "Specialization";
      id: string;
      name: string;
      services?: Array<{
        __typename?: "Service";
        id: string;
        name: string;
        price: number;
      }> | null;
    }> | null;
    availabilities?: Array<{
      __typename?: "Availability";
      id: string;
      available_datetime: string;
    }> | null;
    appointments?: Array<{
      __typename?: "Appointment";
      id: string;
      datetime: string;
      status?: AppointmentStatus | null;
      patient?: {
        __typename?: "Pet";
        id: string;
        name: string;
        owner?: { __typename?: "Owner"; id: string; name: string } | null;
      } | null;
    }> | null;
    patients?: Array<{
      __typename?: "Pet";
      id: string;
      name: string;
      owner?: { __typename?: "Owner"; id: string; name: string } | null;
    }> | null;
  } | null;
};

export type GetAppointmentQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetAppointmentQuery = {
  __typename?: "Query";
  appointment?: {
    __typename?: "Appointment";
    id: string;
    datetime: string;
    status?: AppointmentStatus | null;
    reason?: string | null;
    consultation_type?: string | null;
    investigation?: string | null;
    investigation_result?: string | null;
    doctor?: {
      __typename?: "Doctor";
      id: string;
      name: string;
      clinic_name?: string | null;
    } | null;
    patient?: {
      __typename?: "Pet";
      id: string;
      name: string;
      type?: string | null;
      breed?: string | null;
      age?: number | null;
      weight?: number | null;
      owner?: { __typename?: "Owner"; id: string; name: string } | null;
      lifelong_conditions?: Array<{
        __typename?: "LifelongCondition";
        id: string;
        condition: string;
        treatment: string;
      }> | null;
      active_treatments?: Array<{
        __typename?: "ActiveTreatment";
        id: string;
        start_date: string;
        end_date?: string | null;
        treatment: string;
        condition: string;
      }> | null;
    } | null;
  } | null;
};

export type GetPetQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetPetQuery = {
  __typename?: "Query";
  pet?: {
    __typename?: "Pet";
    id: string;
    name: string;
    type?: string | null;
    breed?: string | null;
    age?: number | null;
    weight?: number | null;
    owner?: {
      __typename?: "Owner";
      id: string;
      name: string;
      email?: string | null;
    } | null;
    lifelong_conditions?: Array<{
      __typename?: "LifelongCondition";
      id: string;
      condition: string;
      treatment: string;
    }> | null;
    active_treatments?: Array<{
      __typename?: "ActiveTreatment";
      id: string;
      condition: string;
      treatment: string;
      start_date: string;
    }> | null;
    appointments?: Array<{
      __typename?: "Appointment";
      id: string;
      datetime: string;
      consultation_type?: string | null;
      doctor?: { __typename?: "Doctor"; id: string; name: string } | null;
    }> | null;
  } | null;
};

export type UpdateDoctorProfileMutationVariables = Exact<{
  input: UpdateDoctorProfileInput;
}>;

export type UpdateDoctorProfileMutation = {
  __typename?: "Mutation";
  updateDoctorProfile?: {
    __typename?: "Doctor";
    id: string;
    name: string;
    clinic_name?: string | null;
    clinic_address?: string | null;
  } | null;
};

export type AddDoctorSpecializationMutationVariables = Exact<{
  input: AddDoctorSpecializationInput;
}>;

export type AddDoctorSpecializationMutation = {
  __typename?: "Mutation";
  addDoctorSpecialization?: {
    __typename?: "Doctor";
    id: string;
    name: string;
    specializations?: Array<{
      __typename?: "Specialization";
      id: string;
      name: string;
      services?: Array<{
        __typename?: "Service";
        id: string;
        name: string;
        price: number;
      }> | null;
    }> | null;
  } | null;
};

export type UpdateDoctorSpecializationMutationVariables = Exact<{
  input: UpdateDoctorSpecializationInput;
}>;

export type UpdateDoctorSpecializationMutation = {
  __typename?: "Mutation";
  updateDoctorSpecialization?: {
    __typename?: "Doctor";
    id: string;
    name: string;
    specializations?: Array<{
      __typename?: "Specialization";
      id: string;
      name: string;
      services?: Array<{
        __typename?: "Service";
        id: string;
        name: string;
        price: number;
      }> | null;
    }> | null;
  } | null;
};

export type RemoveDoctorSpecializationMutationVariables = Exact<{
  input: RemoveDoctorSpecializationInput;
}>;

export type RemoveDoctorSpecializationMutation = {
  __typename?: "Mutation";
  removeDoctorSpecialization?: {
    __typename?: "Doctor";
    specializations?: Array<{
      __typename?: "Specialization";
      id: string;
      name: string;
      services?: Array<{
        __typename?: "Service";
        id: string;
        name: string;
        price: number;
        specialization_id: string;
      }> | null;
    }> | null;
  } | null;
};

export type AddDoctorAvailabilityMutationVariables = Exact<{
  input: AddDoctorAvailabilityInput;
}>;

export type AddDoctorAvailabilityMutation = {
  __typename?: "Mutation";
  addDoctorAvailability?: {
    __typename?: "Doctor";
    id: string;
    name: string;
    availabilities?: Array<{
      __typename?: "Availability";
      id: string;
      available_datetime: string;
    }> | null;
  } | null;
};

export type RemoveDoctorAvailabilityMutationVariables = Exact<{
  input: RemoveDoctorAvailabilityInput;
}>;

export type RemoveDoctorAvailabilityMutation = {
  __typename?: "Mutation";
  removeDoctorAvailability?: {
    __typename?: "Doctor";
    id: string;
    name: string;
    availabilities?: Array<{
      __typename?: "Availability";
      id: string;
      available_datetime: string;
    }> | null;
  } | null;
};

export type CreateAppointmentMutationVariables = Exact<{
  input: CreateAppointmentInput;
}>;

export type CreateAppointmentMutation = {
  __typename?: "Mutation";
  createAppointment?: {
    __typename?: "Appointment";
    id: string;
    datetime: string;
    status?: AppointmentStatus | null;
    consultation_type?: string | null;
    doctor?: { __typename?: "Doctor"; id: string; name: string } | null;
    patient?: {
      __typename?: "Pet";
      id: string;
      name: string;
      owner?: { __typename?: "Owner"; id: string; name: string } | null;
    } | null;
  } | null;
};

export type UpdateAppointmentMutationVariables = Exact<{
  input: UpdateAppointmentInput;
}>;

export type UpdateAppointmentMutation = {
  __typename?: "Mutation";
  updateAppointment?: {
    __typename?: "Appointment";
    id: string;
    status?: AppointmentStatus | null;
    reason?: string | null;
    consultation_type?: string | null;
    investigation?: string | null;
    investigation_result?: string | null;
    patient?: {
      __typename?: "Pet";
      id: string;
      name: string;
      weight?: number | null;
      age?: number | null;
      lifelong_conditions?: Array<{
        __typename?: "LifelongCondition";
        id: string;
        condition: string;
        treatment: string;
      }> | null;
      active_treatments?: Array<{
        __typename?: "ActiveTreatment";
        id: string;
        condition: string;
        treatment: string;
        start_date: string;
        end_date?: string | null;
      }> | null;
    } | null;
  } | null;
};

export type RemoveAppointmentMutationVariables = Exact<{
  input: RemoveAppointmentInput;
}>;

export type RemoveAppointmentMutation = {
  __typename?: "Mutation";
  removeAppointment?: {
    __typename?: "Appointment";
    id: string;
    datetime: string;
    status?: AppointmentStatus | null;
    doctor?: { __typename?: "Doctor"; id: string; name: string } | null;
    patient?: { __typename?: "Pet"; id: string; name: string } | null;
  } | null;
};

export type CreatePetMutationVariables = Exact<{
  input: CreatePetInput;
}>;

export type CreatePetMutation = {
  __typename?: "Mutation";
  createPet?: {
    __typename?: "Pet";
    id: string;
    name: string;
    age?: number | null;
    weight?: number | null;
    type?: string | null;
    breed?: string | null;
    lifelong_conditions?: Array<{
      __typename?: "LifelongCondition";
      id: string;
      condition: string;
      treatment: string;
    }> | null;
    active_treatments?: Array<{
      __typename?: "ActiveTreatment";
      id: string;
      condition: string;
      treatment: string;
      start_date: string;
      end_date?: string | null;
    }> | null;
  } | null;
};

export type UpdatePetMutationVariables = Exact<{
  input: UpdatePetInput;
}>;

export type UpdatePetMutation = {
  __typename?: "Mutation";
  updatePet?: {
    __typename?: "Pet";
    id: string;
    name: string;
    age?: number | null;
    weight?: number | null;
    type?: string | null;
    breed?: string | null;
    lifelong_conditions?: Array<{
      __typename?: "LifelongCondition";
      id: string;
      condition: string;
      treatment: string;
    }> | null;
    active_treatments?: Array<{
      __typename?: "ActiveTreatment";
      id: string;
      condition: string;
      treatment: string;
      end_date?: string | null;
      start_date: string;
    }> | null;
  } | null;
};

export type UpdateOwnerProfileMutationVariables = Exact<{
  input: UpdateOwnerProfileInput;
}>;

export type UpdateOwnerProfileMutation = {
  __typename?: "Mutation";
  updateOwnerProfile?: {
    __typename?: "Owner";
    id: string;
    name: string;
  } | null;
};

export const GetOwnerDocument = gql`
  query GetOwner($id: ID!) {
    owner(id: $id) {
      id
      name
      email
      pets {
        id
        name
        type
        breed
        age
        weight
        lifelong_conditions {
          id
          condition
          treatment
        }
        active_treatments {
          id
          start_date
          end_date
          condition
          treatment
        }
        appointments {
          id
          datetime
          status
          doctor {
            id
            name
          }
          patient {
            id
            name
          }
        }
      }
    }
  }
`;

export function useGetOwnerQuery(
  baseOptions: Apollo.QueryHookOptions<GetOwnerQuery, GetOwnerQueryVariables> &
    ({ variables: GetOwnerQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetOwnerQuery, GetOwnerQueryVariables>(
    GetOwnerDocument,
    options,
  );
}
export function useGetOwnerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetOwnerQuery,
    GetOwnerQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetOwnerQuery, GetOwnerQueryVariables>(
    GetOwnerDocument,
    options,
  );
}
export function useGetOwnerSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetOwnerQuery,
    GetOwnerQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<GetOwnerQuery, GetOwnerQueryVariables>;
export function useGetOwnerSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetOwnerQuery, GetOwnerQueryVariables>,
): Apollo.UseSuspenseQueryResult<
  GetOwnerQuery | undefined,
  GetOwnerQueryVariables
>;
export function useGetOwnerSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetOwnerQuery, GetOwnerQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetOwnerQuery, GetOwnerQueryVariables>(
    GetOwnerDocument,
    options,
  );
}
export type GetOwnerQueryHookResult = ReturnType<typeof useGetOwnerQuery>;
export type GetOwnerLazyQueryHookResult = ReturnType<
  typeof useGetOwnerLazyQuery
>;
export type GetOwnerSuspenseQueryHookResult = ReturnType<
  typeof useGetOwnerSuspenseQuery
>;
export type GetOwnerQueryResult = Apollo.QueryResult<
  GetOwnerQuery,
  GetOwnerQueryVariables
>;
export const GetDoctorsDocument = gql`
  query GetDoctors($limit: Int, $skip: Int) {
    doctors(limit: $limit, skip: $skip) {
      items {
        id
        name
        clinic_address
        clinic_name
        email
        specializations {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export function useGetDoctorsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetDoctorsQuery,
    GetDoctorsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetDoctorsQuery, GetDoctorsQueryVariables>(
    GetDoctorsDocument,
    options,
  );
}
export function useGetDoctorsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDoctorsQuery,
    GetDoctorsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetDoctorsQuery, GetDoctorsQueryVariables>(
    GetDoctorsDocument,
    options,
  );
}
export function useGetDoctorsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetDoctorsQuery,
    GetDoctorsQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<GetDoctorsQuery, GetDoctorsQueryVariables>;
export function useGetDoctorsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetDoctorsQuery,
        GetDoctorsQueryVariables
      >,
): Apollo.UseSuspenseQueryResult<
  GetDoctorsQuery | undefined,
  GetDoctorsQueryVariables
>;
export function useGetDoctorsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetDoctorsQuery,
        GetDoctorsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetDoctorsQuery, GetDoctorsQueryVariables>(
    GetDoctorsDocument,
    options,
  );
}
export type GetDoctorsQueryHookResult = ReturnType<typeof useGetDoctorsQuery>;
export type GetDoctorsLazyQueryHookResult = ReturnType<
  typeof useGetDoctorsLazyQuery
>;
export type GetDoctorsSuspenseQueryHookResult = ReturnType<
  typeof useGetDoctorsSuspenseQuery
>;
export type GetDoctorsQueryResult = Apollo.QueryResult<
  GetDoctorsQuery,
  GetDoctorsQueryVariables
>;
export const GetDoctorDocument = gql`
  query GetDoctor($id: ID!) {
    doctor(id: $id) {
      id
      name
      email
      clinic_name
      clinic_address
      specializations {
        id
        name
        services {
          id
          name
          price
        }
      }
      availabilities {
        id
        available_datetime
      }
      appointments {
        id
        datetime
        status
        patient {
          id
          name
          owner {
            id
            name
          }
        }
      }
      patients {
        id
        name
        owner {
          id
          name
        }
      }
    }
  }
`;

export function useGetDoctorQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDoctorQuery,
    GetDoctorQueryVariables
  > &
    (
      | { variables: GetDoctorQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetDoctorQuery, GetDoctorQueryVariables>(
    GetDoctorDocument,
    options,
  );
}
export function useGetDoctorLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDoctorQuery,
    GetDoctorQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetDoctorQuery, GetDoctorQueryVariables>(
    GetDoctorDocument,
    options,
  );
}
export function useGetDoctorSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetDoctorQuery,
    GetDoctorQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<GetDoctorQuery, GetDoctorQueryVariables>;
export function useGetDoctorSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetDoctorQuery, GetDoctorQueryVariables>,
): Apollo.UseSuspenseQueryResult<
  GetDoctorQuery | undefined,
  GetDoctorQueryVariables
>;
export function useGetDoctorSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetDoctorQuery, GetDoctorQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetDoctorQuery, GetDoctorQueryVariables>(
    GetDoctorDocument,
    options,
  );
}
export type GetDoctorQueryHookResult = ReturnType<typeof useGetDoctorQuery>;
export type GetDoctorLazyQueryHookResult = ReturnType<
  typeof useGetDoctorLazyQuery
>;
export type GetDoctorSuspenseQueryHookResult = ReturnType<
  typeof useGetDoctorSuspenseQuery
>;
export type GetDoctorQueryResult = Apollo.QueryResult<
  GetDoctorQuery,
  GetDoctorQueryVariables
>;
export const GetAppointmentDocument = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
      id
      datetime
      status
      reason
      consultation_type
      investigation
      investigation_result
      doctor {
        id
        name
        clinic_name
      }
      patient {
        id
        name
        type
        breed
        age
        weight
        owner {
          id
          name
        }
        lifelong_conditions {
          id
          condition
          treatment
        }
        active_treatments {
          id
          start_date
          end_date
          treatment
          condition
        }
      }
    }
  }
`;

export function useGetAppointmentQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetAppointmentQuery,
    GetAppointmentQueryVariables
  > &
    (
      | { variables: GetAppointmentQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAppointmentQuery, GetAppointmentQueryVariables>(
    GetAppointmentDocument,
    options,
  );
}
export function useGetAppointmentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAppointmentQuery,
    GetAppointmentQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAppointmentQuery, GetAppointmentQueryVariables>(
    GetAppointmentDocument,
    options,
  );
}
export function useGetAppointmentSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetAppointmentQuery,
    GetAppointmentQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<
  GetAppointmentQuery,
  GetAppointmentQueryVariables
>;
export function useGetAppointmentSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAppointmentQuery,
        GetAppointmentQueryVariables
      >,
): Apollo.UseSuspenseQueryResult<
  GetAppointmentQuery | undefined,
  GetAppointmentQueryVariables
>;
export function useGetAppointmentSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAppointmentQuery,
        GetAppointmentQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetAppointmentQuery,
    GetAppointmentQueryVariables
  >(GetAppointmentDocument, options);
}
export type GetAppointmentQueryHookResult = ReturnType<
  typeof useGetAppointmentQuery
>;
export type GetAppointmentLazyQueryHookResult = ReturnType<
  typeof useGetAppointmentLazyQuery
>;
export type GetAppointmentSuspenseQueryHookResult = ReturnType<
  typeof useGetAppointmentSuspenseQuery
>;
export type GetAppointmentQueryResult = Apollo.QueryResult<
  GetAppointmentQuery,
  GetAppointmentQueryVariables
>;
export const GetPetDocument = gql`
  query GetPet($id: ID!) {
    pet(id: $id) {
      id
      name
      type
      breed
      age
      weight
      owner {
        id
        name
        email
      }
      lifelong_conditions {
        id
        condition
        treatment
      }
      active_treatments {
        id
        condition
        treatment
        start_date
      }
      appointments {
        id
        datetime
        consultation_type
        doctor {
          id
          name
        }
      }
    }
  }
`;

export function useGetPetQuery(
  baseOptions: Apollo.QueryHookOptions<GetPetQuery, GetPetQueryVariables> &
    ({ variables: GetPetQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPetQuery, GetPetQueryVariables>(
    GetPetDocument,
    options,
  );
}
export function useGetPetLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPetQuery, GetPetQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPetQuery, GetPetQueryVariables>(
    GetPetDocument,
    options,
  );
}
export function useGetPetSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetPetQuery,
    GetPetQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<GetPetQuery, GetPetQueryVariables>;
export function useGetPetSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPetQuery, GetPetQueryVariables>,
): Apollo.UseSuspenseQueryResult<GetPetQuery | undefined, GetPetQueryVariables>;
export function useGetPetSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPetQuery, GetPetQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetPetQuery, GetPetQueryVariables>(
    GetPetDocument,
    options,
  );
}
export type GetPetQueryHookResult = ReturnType<typeof useGetPetQuery>;
export type GetPetLazyQueryHookResult = ReturnType<typeof useGetPetLazyQuery>;
export type GetPetSuspenseQueryHookResult = ReturnType<
  typeof useGetPetSuspenseQuery
>;
export type GetPetQueryResult = Apollo.QueryResult<
  GetPetQuery,
  GetPetQueryVariables
>;
export const UpdateDoctorProfileDocument = gql`
  mutation UpdateDoctorProfile($input: UpdateDoctorProfileInput!) {
    updateDoctorProfile(input: $input) {
      id
      name
      clinic_name
      clinic_address
    }
  }
`;
export type UpdateDoctorProfileMutationFn = Apollo.MutationFunction<
  UpdateDoctorProfileMutation,
  UpdateDoctorProfileMutationVariables
>;

export function useUpdateDoctorProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateDoctorProfileMutation,
    UpdateDoctorProfileMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateDoctorProfileMutation,
    UpdateDoctorProfileMutationVariables
  >(UpdateDoctorProfileDocument, options);
}
export type UpdateDoctorProfileMutationHookResult = ReturnType<
  typeof useUpdateDoctorProfileMutation
>;
export type UpdateDoctorProfileMutationResult =
  Apollo.MutationResult<UpdateDoctorProfileMutation>;
export type UpdateDoctorProfileMutationOptions = Apollo.BaseMutationOptions<
  UpdateDoctorProfileMutation,
  UpdateDoctorProfileMutationVariables
>;
export const AddDoctorSpecializationDocument = gql`
  mutation AddDoctorSpecialization($input: AddDoctorSpecializationInput!) {
    addDoctorSpecialization(input: $input) {
      id
      name
      specializations {
        id
        name
        services {
          id
          name
          price
        }
      }
    }
  }
`;
export type AddDoctorSpecializationMutationFn = Apollo.MutationFunction<
  AddDoctorSpecializationMutation,
  AddDoctorSpecializationMutationVariables
>;

export function useAddDoctorSpecializationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddDoctorSpecializationMutation,
    AddDoctorSpecializationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddDoctorSpecializationMutation,
    AddDoctorSpecializationMutationVariables
  >(AddDoctorSpecializationDocument, options);
}
export type AddDoctorSpecializationMutationHookResult = ReturnType<
  typeof useAddDoctorSpecializationMutation
>;
export type AddDoctorSpecializationMutationResult =
  Apollo.MutationResult<AddDoctorSpecializationMutation>;
export type AddDoctorSpecializationMutationOptions = Apollo.BaseMutationOptions<
  AddDoctorSpecializationMutation,
  AddDoctorSpecializationMutationVariables
>;
export const UpdateDoctorSpecializationDocument = gql`
  mutation UpdateDoctorSpecialization(
    $input: UpdateDoctorSpecializationInput!
  ) {
    updateDoctorSpecialization(input: $input) {
      id
      name
      specializations {
        id
        name
        services {
          id
          name
          price
        }
      }
    }
  }
`;
export type UpdateDoctorSpecializationMutationFn = Apollo.MutationFunction<
  UpdateDoctorSpecializationMutation,
  UpdateDoctorSpecializationMutationVariables
>;

export function useUpdateDoctorSpecializationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateDoctorSpecializationMutation,
    UpdateDoctorSpecializationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateDoctorSpecializationMutation,
    UpdateDoctorSpecializationMutationVariables
  >(UpdateDoctorSpecializationDocument, options);
}
export type UpdateDoctorSpecializationMutationHookResult = ReturnType<
  typeof useUpdateDoctorSpecializationMutation
>;
export type UpdateDoctorSpecializationMutationResult =
  Apollo.MutationResult<UpdateDoctorSpecializationMutation>;
export type UpdateDoctorSpecializationMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateDoctorSpecializationMutation,
    UpdateDoctorSpecializationMutationVariables
  >;
export const RemoveDoctorSpecializationDocument = gql`
  mutation RemoveDoctorSpecialization(
    $input: RemoveDoctorSpecializationInput!
  ) {
    removeDoctorSpecialization(input: $input) {
      specializations {
        id
        name
        services {
          id
          name
          price
          specialization_id
        }
      }
    }
  }
`;
export type RemoveDoctorSpecializationMutationFn = Apollo.MutationFunction<
  RemoveDoctorSpecializationMutation,
  RemoveDoctorSpecializationMutationVariables
>;

export function useRemoveDoctorSpecializationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveDoctorSpecializationMutation,
    RemoveDoctorSpecializationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveDoctorSpecializationMutation,
    RemoveDoctorSpecializationMutationVariables
  >(RemoveDoctorSpecializationDocument, options);
}
export type RemoveDoctorSpecializationMutationHookResult = ReturnType<
  typeof useRemoveDoctorSpecializationMutation
>;
export type RemoveDoctorSpecializationMutationResult =
  Apollo.MutationResult<RemoveDoctorSpecializationMutation>;
export type RemoveDoctorSpecializationMutationOptions =
  Apollo.BaseMutationOptions<
    RemoveDoctorSpecializationMutation,
    RemoveDoctorSpecializationMutationVariables
  >;
export const AddDoctorAvailabilityDocument = gql`
  mutation AddDoctorAvailability($input: AddDoctorAvailabilityInput!) {
    addDoctorAvailability(input: $input) {
      id
      name
      availabilities {
        id
        available_datetime
      }
    }
  }
`;
export type AddDoctorAvailabilityMutationFn = Apollo.MutationFunction<
  AddDoctorAvailabilityMutation,
  AddDoctorAvailabilityMutationVariables
>;

export function useAddDoctorAvailabilityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddDoctorAvailabilityMutation,
    AddDoctorAvailabilityMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddDoctorAvailabilityMutation,
    AddDoctorAvailabilityMutationVariables
  >(AddDoctorAvailabilityDocument, options);
}
export type AddDoctorAvailabilityMutationHookResult = ReturnType<
  typeof useAddDoctorAvailabilityMutation
>;
export type AddDoctorAvailabilityMutationResult =
  Apollo.MutationResult<AddDoctorAvailabilityMutation>;
export type AddDoctorAvailabilityMutationOptions = Apollo.BaseMutationOptions<
  AddDoctorAvailabilityMutation,
  AddDoctorAvailabilityMutationVariables
>;
export const RemoveDoctorAvailabilityDocument = gql`
  mutation RemoveDoctorAvailability($input: RemoveDoctorAvailabilityInput!) {
    removeDoctorAvailability(input: $input) {
      id
      name
      availabilities {
        id
        available_datetime
      }
    }
  }
`;
export type RemoveDoctorAvailabilityMutationFn = Apollo.MutationFunction<
  RemoveDoctorAvailabilityMutation,
  RemoveDoctorAvailabilityMutationVariables
>;

export function useRemoveDoctorAvailabilityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveDoctorAvailabilityMutation,
    RemoveDoctorAvailabilityMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveDoctorAvailabilityMutation,
    RemoveDoctorAvailabilityMutationVariables
  >(RemoveDoctorAvailabilityDocument, options);
}
export type RemoveDoctorAvailabilityMutationHookResult = ReturnType<
  typeof useRemoveDoctorAvailabilityMutation
>;
export type RemoveDoctorAvailabilityMutationResult =
  Apollo.MutationResult<RemoveDoctorAvailabilityMutation>;
export type RemoveDoctorAvailabilityMutationOptions =
  Apollo.BaseMutationOptions<
    RemoveDoctorAvailabilityMutation,
    RemoveDoctorAvailabilityMutationVariables
  >;
export const CreateAppointmentDocument = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      id
      datetime
      status
      consultation_type
      doctor {
        id
        name
      }
      patient {
        id
        name
        owner {
          id
          name
        }
      }
    }
  }
`;
export type CreateAppointmentMutationFn = Apollo.MutationFunction<
  CreateAppointmentMutation,
  CreateAppointmentMutationVariables
>;

export function useCreateAppointmentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateAppointmentMutation,
    CreateAppointmentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateAppointmentMutation,
    CreateAppointmentMutationVariables
  >(CreateAppointmentDocument, options);
}
export type CreateAppointmentMutationHookResult = ReturnType<
  typeof useCreateAppointmentMutation
>;
export type CreateAppointmentMutationResult =
  Apollo.MutationResult<CreateAppointmentMutation>;
export type CreateAppointmentMutationOptions = Apollo.BaseMutationOptions<
  CreateAppointmentMutation,
  CreateAppointmentMutationVariables
>;
export const UpdateAppointmentDocument = gql`
  mutation UpdateAppointment($input: UpdateAppointmentInput!) {
    updateAppointment(input: $input) {
      id
      status
      reason
      consultation_type
      investigation
      investigation_result
      patient {
        id
        name
        weight
        age
        lifelong_conditions {
          id
          condition
          treatment
        }
        active_treatments {
          id
          condition
          treatment
          start_date
          end_date
        }
      }
    }
  }
`;
export type UpdateAppointmentMutationFn = Apollo.MutationFunction<
  UpdateAppointmentMutation,
  UpdateAppointmentMutationVariables
>;

export function useUpdateAppointmentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateAppointmentMutation,
    UpdateAppointmentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateAppointmentMutation,
    UpdateAppointmentMutationVariables
  >(UpdateAppointmentDocument, options);
}
export type UpdateAppointmentMutationHookResult = ReturnType<
  typeof useUpdateAppointmentMutation
>;
export type UpdateAppointmentMutationResult =
  Apollo.MutationResult<UpdateAppointmentMutation>;
export type UpdateAppointmentMutationOptions = Apollo.BaseMutationOptions<
  UpdateAppointmentMutation,
  UpdateAppointmentMutationVariables
>;
export const RemoveAppointmentDocument = gql`
  mutation RemoveAppointment($input: RemoveAppointmentInput!) {
    removeAppointment(input: $input) {
      id
      datetime
      status
      doctor {
        id
        name
      }
      patient {
        id
        name
      }
    }
  }
`;
export type RemoveAppointmentMutationFn = Apollo.MutationFunction<
  RemoveAppointmentMutation,
  RemoveAppointmentMutationVariables
>;

export function useRemoveAppointmentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveAppointmentMutation,
    RemoveAppointmentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveAppointmentMutation,
    RemoveAppointmentMutationVariables
  >(RemoveAppointmentDocument, options);
}
export type RemoveAppointmentMutationHookResult = ReturnType<
  typeof useRemoveAppointmentMutation
>;
export type RemoveAppointmentMutationResult =
  Apollo.MutationResult<RemoveAppointmentMutation>;
export type RemoveAppointmentMutationOptions = Apollo.BaseMutationOptions<
  RemoveAppointmentMutation,
  RemoveAppointmentMutationVariables
>;
export const CreatePetDocument = gql`
  mutation CreatePet($input: CreatePetInput!) {
    createPet(input: $input) {
      id
      name
      age
      weight
      type
      breed
      lifelong_conditions {
        id
        condition
        treatment
      }
      active_treatments {
        id
        condition
        treatment
        start_date
        end_date
      }
    }
  }
`;
export type CreatePetMutationFn = Apollo.MutationFunction<
  CreatePetMutation,
  CreatePetMutationVariables
>;

export function useCreatePetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePetMutation,
    CreatePetMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreatePetMutation, CreatePetMutationVariables>(
    CreatePetDocument,
    options,
  );
}
export type CreatePetMutationHookResult = ReturnType<
  typeof useCreatePetMutation
>;
export type CreatePetMutationResult = Apollo.MutationResult<CreatePetMutation>;
export type CreatePetMutationOptions = Apollo.BaseMutationOptions<
  CreatePetMutation,
  CreatePetMutationVariables
>;
export const UpdatePetDocument = gql`
  mutation UpdatePet($input: UpdatePetInput!) {
    updatePet(input: $input) {
      id
      name
      age
      weight
      type
      breed
      lifelong_conditions {
        id
        condition
        treatment
      }
      active_treatments {
        id
        condition
        treatment
        end_date
        start_date
      }
    }
  }
`;
export type UpdatePetMutationFn = Apollo.MutationFunction<
  UpdatePetMutation,
  UpdatePetMutationVariables
>;
export function useUpdatePetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePetMutation,
    UpdatePetMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdatePetMutation, UpdatePetMutationVariables>(
    UpdatePetDocument,
    options,
  );
}
export type UpdatePetMutationHookResult = ReturnType<
  typeof useUpdatePetMutation
>;
export type UpdatePetMutationResult = Apollo.MutationResult<UpdatePetMutation>;
export type UpdatePetMutationOptions = Apollo.BaseMutationOptions<
  UpdatePetMutation,
  UpdatePetMutationVariables
>;
export const UpdateOwnerProfileDocument = gql`
  mutation UpdateOwnerProfile($input: UpdateOwnerProfileInput!) {
    updateOwnerProfile(input: $input) {
      id
      name
    }
  }
`;
export type UpdateOwnerProfileMutationFn = Apollo.MutationFunction<
  UpdateOwnerProfileMutation,
  UpdateOwnerProfileMutationVariables
>;
export function useUpdateOwnerProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateOwnerProfileMutation,
    UpdateOwnerProfileMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateOwnerProfileMutation,
    UpdateOwnerProfileMutationVariables
  >(UpdateOwnerProfileDocument, options);
}
export type UpdateOwnerProfileMutationHookResult = ReturnType<
  typeof useUpdateOwnerProfileMutation
>;
export type UpdateOwnerProfileMutationResult =
  Apollo.MutationResult<UpdateOwnerProfileMutation>;
export type UpdateOwnerProfileMutationOptions = Apollo.BaseMutationOptions<
  UpdateOwnerProfileMutation,
  UpdateOwnerProfileMutationVariables
>;
