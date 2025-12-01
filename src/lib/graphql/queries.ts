import { gql } from "@apollo/client";

export const ownerQuery = gql`
  query ($id: ID!) {
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
export const doctorsQuery = gql`
  query ($limit: Int, $skip: Int) {
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
export const doctorQuery = gql`
  query ($id: ID!) {
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
export const appointmentQuery = gql`
  query ($id: ID!) {
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
export const petQuery = gql`
  query ($id: ID!) {
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

// ---------------------- Mutations ----------------------

export const updateDoctorDetailsMutation = gql`
  mutation ($input: UpdateDoctorProfileInput!) {
    updateDoctorProfile(input: $input) {
      id
      name
      clinic_name
      clinic_address
    }
  }
`;
export const addDoctorSpecializationMutation = gql`
  mutation ($input: AddDoctorSpecializationInput!) {
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
export const updateDoctorSpecializationMutation = gql`
  mutation ($input: UpdateDoctorSpecializationInput!) {
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
export const removeDoctorSpecializationMutation = gql`
  mutation ($input: RemoveDoctorSpecializationInput!) {
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
export const addDoctorAvailabilityMutation = gql`
  mutation ($input: AddDoctorAvailabilityInput!) {
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
export const removeDoctorAvailabilityMutation = gql`
  mutation ($input: RemoveDoctorAvailabilityInput!) {
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
export const createAppointmentMutation = gql`
  mutation ($input: CreateAppointmentInput!) {
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
export const updateAppointment = gql`
  mutation ($input: UpdateAppointmentInput!) {
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
export const removeAppointmentMutation = gql`
  mutation ($input: RemoveAppointmentInput!) {
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
export const createPetMutation = gql`
  mutation ($input: CreatePetInput!) {
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
export const updatePetMutation = gql`
  mutation ($input: UpdatePetInput!) {
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
export const updateOwnerDetailsMutation = gql`
  mutation ($input: UpdateOwnerProfileInput!) {
    updateOwnerProfile(input: $input) {
      id
      name
    }
  }
`;
