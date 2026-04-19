import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DoctorDashboardPage from './DoctorDashboardPage';

// Mock ProtectedRoute to just render children (auth tested separately)
vi.mock('../../../router/ProtectedRoute/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../../components/ui/Loading/Loading', () => ({
  Loading: () => <div data-testid="loading" />,
}));

vi.mock('../../../components/features/AvailabilityModal/AvailabilityModal', () => ({
  AvailabilityModal: ({ onClose }: any) => (
    <div data-testid="availability-modal">
      <h2>Manage Your Availability</h2>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('../../../context/AuthenticationContext', () => ({
  useAuthentication: () => ({ user: { id: 'doc-1', role: 'doctor' } }),
}));

// Mock all GraphQL hooks with stable objects to avoid infinite loops
const mockDoctor = {
  id: 'doc-1',
  name: 'Dr. Smith',
  email: 'dr@example.com',
  clinic_name: 'SmithClinic',
  clinic_address: '1 Main St',
  specializations: [],
  availabilities: [],
  appointments: [],
  patients: [],
};

const mockUseDoctor = vi.fn();
vi.mock('../../../lib/graphql/doctors/useDoctor', () => ({
  useDoctor: () => mockUseDoctor(),
}));

vi.mock('../../../lib/graphql/doctors/useUpdateDoctorDetails', () => ({
  useUpdateDoctorDetails: () => ({
    updateDoctorDetails: vi.fn(),
    loading: false,
    error: null,
  }),
}));
vi.mock('../../../lib/graphql/doctors/useAddDoctorSpecialization', () => ({
  useAddDoctorSpecialization: () => ({ addDoctorSpecialization: vi.fn() }),
}));
vi.mock('../../../lib/graphql/doctors/useUpdateDoctorSpecialization', () => ({
  useUpdateDoctorSpecialization: () => ({ updateDoctorSpecialization: vi.fn() }),
}));
vi.mock('../../../lib/graphql/doctors/useRemoveDoctorSpecialization', () => ({
  useRemoveDoctorSpecialization: () => ({ removeDoctorSpecialization: vi.fn() }),
}));
vi.mock('../../../lib/graphql/doctors/useAddDoctorAvailability', () => ({
  useAddDoctorAvailability: () => ({ addDoctorAvailability: vi.fn(), loading: false }),
}));
vi.mock('../../../lib/graphql/doctors/useRemoveDoctorAvailability', () => ({
  useRemoveDoctorAvailability: () => ({ removeDoctorAvailability: vi.fn() }),
}));
vi.mock('../../../lib/graphql/appointments/useRemoveAppointment', () => ({
  useRemoveAppointment: () => ({ removeAppointment: vi.fn() }),
}));

vi.mock('../../../lib/graphql/appointments/useUpdateAppointment', () => ({
  useUpdateAppointment: () => ({ updateAppointmentDetails: vi.fn() }),
}));

// Mock date-fns format to avoid potential issues
vi.mock('date-fns', () => ({
  format: (date: Date, fmt: string) =>
    fmt === 'yyyy-MM-dd' ? '2024-06-01' : fmt === 'HH:mm' ? '09:00' : 'June 1st, 2024',
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

function renderPage() {
  return render(
    <MemoryRouter>
      <DoctorDashboardPage />
    </MemoryRouter>
  );
}

describe('DoctorDashboardPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockUseDoctor.mockReturnValue({
      doctor: mockDoctor,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders the Doctor Dashboard heading', async () => {
    renderPage();
    expect(await screen.findByRole('heading', { name: /doctor dashboard/i })).toBeInTheDocument();
  });

  it('renders the tabs', async () => {
    renderPage();
    expect(await screen.findByRole('button', { name: /my details/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /my services/i })).toBeInTheDocument();
  });

  it('shows profile inputs on the profile tab', async () => {
    renderPage();
    expect(await screen.findByLabelText(/my full name/i)).toBeInTheDocument();
  });

  it('switching to appointments tab shows appointments section', async () => {
    renderPage();
    const appointmentsTab = await screen.findByRole('button', { name: /my appointments/i });
    await userEvent.click(appointmentsTab);
    expect(await screen.findByText(/you have no upcoming appointments/i)).toBeInTheDocument();
  });

  it('switching to availability tab shows Manage Availability button', async () => {
    renderPage();
    const availabilityTab = await screen.findByRole('button', { name: /my availability/i });
    await userEvent.click(availabilityTab);
    expect(await screen.findByRole('button', { name: /manage availability/i })).toBeInTheDocument();
  });

  it('clicking Manage Availability opens the availability modal', async () => {
    renderPage();
    const availabilityTab = await screen.findByRole('button', { name: /my availability/i });
    await userEvent.click(availabilityTab);
    const manageBtn = await screen.findByRole('button', { name: /manage availability/i });
    await userEvent.click(manageBtn);
    expect(await screen.findByText(/manage your availability/i)).toBeInTheDocument();
  });

  it('shows error message when doctor data cannot be loaded', async () => {
    mockUseDoctor.mockReturnValue({
      doctor: null,
      error: new Error('Forbidden'),
      loading: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(await screen.findByText(/could not load your information/i)).toBeInTheDocument();
  });
});
