import { useState } from "react";
import { BookingModal } from "../../components/features/BookingModal/BookingModal";
import { DoctorCard } from "../../components/features/DoctorCard/DoctorCard";
import { ProtectedRoute } from "../../router/ProtectedRoute/ProtectedRoute";
import { useCreateAppointment } from "../../lib/graphql/appointments/useCreateAppointment";
import type { queryInput } from "../../lib/graphql/appointments/useCreateAppointment";
import { useDoctor } from "../../lib/graphql/doctors/useDoctor";
import { useDoctors } from "../../lib/graphql/doctors/useDoctors";
import { useOwner } from "../../lib/graphql/owner/useOwner";
import type { Pet } from "../../types";
import { DOCTORS_PER_PAGE } from "../../utils/constants";
import { useAuthentication } from "../../context/AuthenticationContext";
import { Button } from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/Input/Input";
import { Select } from "../../components/ui/Select/Select";
import { useSpecializations } from "../../lib/graphql/doctors/useSpecializations";
import { useEffect } from "react";
import "./styles.css";

interface DoctorSummary {
  id: string;
  name: string;
  clinic_name: string;
  clinic_address: string;
  imageUrl?: string;
  specializations: { name: string }[];
}

const formatSpecializationsForDisplay = (doctor: DoctorSummary): string => {
  if (!doctor.specializations || doctor.specializations.length === 0) {
    return "No specializations listed.";
  }
  return doctor.specializations.map((spec) => spec.name).join(", ");
};

const DoctorsPage = () => {
  const { user } = useAuthentication();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const { specializations, loading: specializationsLoading } =
    useSpecializations();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const handleSpecializationChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedSpecialization(e.target.value);
    setCurrentPage(1);
  };

  const skip = (currentPage - 1) * DOCTORS_PER_PAGE;
  const {
    doctors: doctorsList,
    loading: doctorsLoading,
    error: doctorsError,
  } = useDoctors(
    DOCTORS_PER_PAGE,
    skip,
    debouncedSearch,
    selectedSpecialization,
  );

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const { doctor: detailedDoctor, loading: detailedDoctorLoading } =
    useDoctor(selectedDoctorId);

  const { owner } = useOwner(user?.id ?? null);
  const { createAppointment } = useCreateAppointment();

  const petsForBookingModal = owner?.pets ?? [];

  if (doctorsError) {
    return (
      <div className="doctors-page-wrapper">Data unavailable at this time.</div>
    );
  }

  const totalPages = Math.ceil(
    ((doctorsList as any)?.totalCount || 0) / DOCTORS_PER_PAGE,
  );
  const visibleDoctors =
    (doctorsList as any)?.items?.filter(
      (doctor: any) => (doctor.specializations?.length ?? 0) > 0,
    ) ?? [];

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctorId(null);
  };

  const handleBookingSave = async (input: queryInput) => {
    await createAppointment(input);
  };

  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <div className="doctors-page-wrapper">
        <h1 className="doctors-page-title">Our Doctors</h1>

        <div className="filters-container">
          <div className="search-wrapper">
            <Input
              name="search"
              placeholder="Search by name or clinic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="doctor-search-input"
              fullWidth={true}
              aria-label="Search by doctor name or clinic"
            />
            {search && (
              <Button
                size="sm"
                onClick={() => setSearch("")}
                text="Clear"
                className="clear-search-btn"
              />
            )}
          </div>

          <div className="specialization-filter-wrapper">
            <Select
              name="specialization"
              label="Specialization"
              options={[
                { value: "", label: "Filter by Specialization" },
                ...specializations.map((s: any) => ({
                  value: s.id,
                  label: s.name,
                })),
              ]}
              value={selectedSpecialization}
              onChange={handleSpecializationChange}
              disabled={specializationsLoading}
              className="specialization-select"
              hideDefaultPlaceholder={true}
              aria-label="Filter by specialization"
            />
          </div>
        </div>

        <div className="doctors-list-container">
          <div
            className={`doctors-list ${doctorsLoading ? "content-dimmed" : ""}`}
          >
            {visibleDoctors.length > 0
              ? visibleDoctors.map((doctor: any) => (
                  <DoctorCard
                    key={doctor.id}
                    id={doctor.id}
                    name={doctor.name}
                    specializations={formatSpecializationsForDisplay(
                      doctor as DoctorSummary,
                    )}
                    clinic={doctor.clinic_name ?? ""}
                    address={doctor.clinic_address ?? ""}
                    imageUrl={"/profile-placeholder.jpg"}
                    onSelect={() => handleSelectDoctor(doctor.id)}
                  />
                ))
              : !doctorsLoading && (
                  <div className="no-results-message">
                    <p>No results found.</p>
                  </div>
                )}
          </div>
        </div>

        {visibleDoctors.length > 0 && (
          <div className="pagination-bar">
            <Button
              className="pagination-btn"
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 1 || doctorsLoading}
              text="Prev"
            />
            <span className="pagination-current">
              {`${currentPage} of ${totalPages}`}
            </span>
            <Button
              className="pagination-btn"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage === totalPages || doctorsLoading}
              text="Next"
            />
          </div>
        )}

        {isModalOpen && (
          <BookingModal
            pets={petsForBookingModal as unknown as Pet[]}
            doctor={detailedDoctor as any}
            isLoading={detailedDoctorLoading}
            onClose={handleCloseModal}
            showStepSelectDoctor={false}
            onBookingSave={handleBookingSave}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DoctorsPage;
