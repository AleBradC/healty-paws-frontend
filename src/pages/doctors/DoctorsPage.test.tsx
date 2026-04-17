import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DoctorsPage from './DoctorsPage';

vi.mock('../../router/ProtectedRoute/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../context/AuthenticationContext', () => ({
  useAuthentication: () => ({ user: { id: 'owner-1', role: 'owner' } }),
}));

vi.mock('../../lib/graphql/doctors/useDoctors', () => ({
  useDoctors: vi.fn(),
}));
vi.mock('../../lib/graphql/doctors/useDoctor', () => ({
  useDoctor: () => ({ doctor: null, loading: false }),
}));
vi.mock('../../lib/graphql/owner/useOwner', () => ({
  useOwner: () => ({ owner: { pets: [] } }),
}));
vi.mock('../../lib/graphql/appointments/useCreateAppointment', () => ({
  useCreateAppointment: () => ({ createAppointment: vi.fn() }),
}));

import { useDoctors } from '../../lib/graphql/doctors/useDoctors';

vi.mock('../../components/features/BookingModal/BookingModal', () => ({
  BookingModal: () => <div data-testid="booking-modal" />,
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/doctors']}>
      <Routes>
        <Route path="/doctors" element={<DoctorsPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DoctorsPage', () => {
  it('renders the page heading', async () => {
    (useDoctors as any).mockReturnValue({
      doctors: { items: [], totalCount: 0 },
      loading: false,
      error: null,
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByRole('heading', { name: /our doctors/i })).toBeInTheDocument();
  });

  it('renders DoctorCards for each doctor with specializations', async () => {
    (useDoctors as any).mockReturnValue({
      doctors: {
        items: [
          {
            id: 'd1',
            name: 'Dr. Pop',
            clinic_name: 'Clinic A',
            clinic_address: '1 St',
            specializations: [{ name: 'Dermatology' }],
          },
          {
            id: 'd2',
            name: 'Dr. Ionescu',
            clinic_name: 'Clinic B',
            clinic_address: '2 St',
            specializations: [{ name: 'Surgery' }],
          },
        ],
        totalCount: 2,
      },
      loading: false,
      error: null,
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByRole('heading', { name: 'Dr. Pop' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dr. Ionescu' })).toBeInTheDocument();
  });

  it('shows error message when doctors query fails', async () => {
    (useDoctors as any).mockReturnValue({
      doctors: null,
      loading: false,
      error: new Error('Network error'),
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByText(/data unavailable/i)).toBeInTheDocument();
  });

  it('renders pagination controls', async () => {
    (useDoctors as any).mockReturnValue({
      doctors: { items: [], totalCount: 0 },
      loading: false,
      error: null,
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });
});
