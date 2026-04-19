import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import OwnerDashboardPage from './OwnerDashboardPage';

vi.mock('../../../router/ProtectedRoute/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../../components/ui/Loading/Loading', () => ({
  Loading: () => <div data-testid="loading" />,
}));

vi.mock('../../../context/AuthenticationContext', () => ({
  useAuthentication: () => ({ user: { id: 'owner-1', role: 'owner' } }),
}));

const mockRefetchOwner = vi.fn();
const mockOwner = {
  id: 'owner-1',
  name: 'Alice',
  email: 'alice@example.com',
  user_id: 'u1',
  pets: [
    {
      id: 'pet-1',
      name: 'Luna',
      type: 'Cat',
      breed: 'Siamese',
      age: '3',
      weight: '4',
      owner: { id: 'owner-1', name: 'Alice', user_id: 'u1' },
      appointments: [],
      lifelong_conditions: [],
      active_treatments: [],
    },
  ],
};

const mockUseOwner = vi.fn();
vi.mock('../../../lib/graphql/owner/useOwner', () => ({
  useOwner: () => mockUseOwner(),
}));

const mockUseDoctor = vi.fn();
vi.mock('../../../lib/graphql/doctors/useDoctor', () => ({
  useDoctor: () => mockUseDoctor(),
}));
vi.mock('../../../lib/graphql/appointments/useCreateAppointment', () => ({
  useCreateAppointment: () => ({ createAppointment: vi.fn() }),
}));
vi.mock('../../../lib/graphql/appointments/useRemoveAppointment', () => ({
  useRemoveAppointment: () => ({ removeAppointment: vi.fn() }),
}));
vi.mock('../../../lib/graphql/patients/useCreatePet', () => ({
  useCreatePet: () => ({ createPet: vi.fn(), loading: false }),
}));
vi.mock('../../../lib/graphql/patients/useUpdatePet', () => ({
  useUpdatePet: () => ({ updatePet: vi.fn(), loading: false }),
}));
vi.mock('../../../lib/graphql/owner/useUpdateOwner', () => ({
  useUpdateOwner: () => ({ updateOwner: vi.fn(), loading: false }),
}));

// Mock BookingModal to avoid complexity
vi.mock('../../../components/features/BookingModal/BookingModal', () => ({
  BookingModal: ({ onClose }: any) => (
    <div data-testid="booking-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

function renderPage() {
  return render(
    <MemoryRouter>
      <OwnerDashboardPage />
    </MemoryRouter>
  );
}

describe('OwnerDashboardPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockUseOwner.mockReturnValue({
      owner: mockOwner,
      error: null,
      refetch: mockRefetchOwner,
    });
    mockUseDoctor.mockReturnValue({ doctor: null, loading: false });
  });

  it('renders the My Dashboard heading', async () => {
    renderPage();
    expect(await screen.findByRole('heading', { name: /my dashboard/i })).toBeInTheDocument();
  });

  it('renders the tabs including the owner name input', async () => {
    renderPage();
    expect(await screen.findByLabelText(/my full name/i)).toBeInTheDocument();
  });

  it('shows a tab for each pet', async () => {
    renderPage();
    expect(await screen.findByRole('button', { name: 'Luna' })).toBeInTheDocument();
  });

  it('shows appointments tab', async () => {
    renderPage();
    expect(await screen.findByRole('button', { name: /appointments/i })).toBeInTheDocument();
  });

  it('switching to appointments tab shows Book New Appointment button', async () => {
    renderPage();
    const apptsTab = await screen.findByRole('button', { name: /appointments/i });
    await userEvent.click(apptsTab);
    expect(await screen.findByRole('button', { name: /book new appointment/i })).toBeInTheDocument();
  });

  it('clicking Book New Appointment opens the booking modal', async () => {
    renderPage();
    const apptsTab = await screen.findByRole('button', { name: /appointments/i });
    await userEvent.click(apptsTab);
    const bookBtn = await screen.findByRole('button', { name: /book new appointment/i });
    await userEvent.click(bookBtn);
    expect(await screen.findByTestId('booking-modal')).toBeInTheDocument();
  });

  it('clicking Add New Pet opens the add pet modal', async () => {
    renderPage();
    const detailsTab = await screen.findByRole('button', { name: /my details/i });
    await userEvent.click(detailsTab);
    const addPetBtn = await screen.findByRole('button', { name: /add new pet/i });
    await userEvent.click(addPetBtn);
    expect(await screen.findByRole('heading', { name: /add a new pet/i })).toBeInTheDocument();
  });

  it('shows error message when owner data cannot be loaded', async () => {
    mockUseOwner.mockReturnValue({
      owner: null,
      error: new Error('Forbidden'),
      refetch: vi.fn(),
    });

    renderPage();
    expect(await screen.findByText(/could not load your information/i)).toBeInTheDocument();
  });
});
