import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DoctorsPage from './DoctorsPage';
import { useDoctors } from '../../lib/graphql/doctors/useDoctors';
import { useSpecializations } from '../../lib/graphql/doctors/useSpecializations';

vi.mock('../../router/ProtectedRoute/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../context/AuthenticationContext', () => ({
  useAuthentication: () => ({ user: { id: 'owner-1', role: 'owner' } }),
}));

vi.mock('../../lib/graphql/doctors/useDoctors', () => ({
  useDoctors: vi.fn(),
}));
vi.mock('../../lib/graphql/doctors/useSpecializations', () => ({
  useSpecializations: vi.fn(),
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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders the page heading and search input', async () => {
    (useDoctors as any).mockReturnValue({
      doctors: { items: [], totalCount: 0 },
      loading: false,
      error: null,
    });
    (useSpecializations as any).mockReturnValue({
      specializations: [],
      loading: false,
      error: null,
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByRole('heading', { name: /our doctors/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by name or clinic/i)).toBeInTheDocument();
  });

  it('updates search and calls useDoctors with specialization filter', async () => {
    vi.useFakeTimers();
    (useDoctors as any).mockReturnValue({
      doctors: { items: [], totalCount: 0 },
      loading: false,
      error: null,
    });
    (useSpecializations as any).mockReturnValue({
      specializations: [{ id: 's1', name: 'Surgery' }],
      loading: false,
      error: null,
    });

    renderPage();
    await act(async () => {});

    const specSelect = screen.getByRole('combobox');
    fireEvent.change(specSelect, { target: { value: 's1' } });

    expect(useDoctors).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), '', 's1');
  });

  it('updates search and calls useDoctors with debounced value', async () => {
    vi.useFakeTimers();
    (useDoctors as any).mockReturnValue({
      doctors: { items: [], totalCount: 0 },
      loading: false,
      error: null,
    });

    renderPage();
    await act(async () => {});

    const input = screen.getByPlaceholderText(/search by name or clinic/i);
    fireEvent.change(input, { target: { value: 'Pop' } });

    // useDoctors should NOT be called with 'Pop' immediately due to debounce
    expect(useDoctors).not.toHaveBeenCalledWith(expect.any(Number), expect.any(Number), 'Pop', '');

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(useDoctors).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), 'Pop', '');
  });

  it('clears search when clear button is clicked', async () => {
    vi.useFakeTimers();
    (useDoctors as any).mockReturnValue({
      doctors: { items: [], totalCount: 0 },
      loading: false,
      error: null,
    });

    renderPage();
    await act(async () => {});

    const input = screen.getByPlaceholderText(/search by name or clinic/i);
    fireEvent.change(input, { target: { value: 'Pop' } });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await act(async () => {
      fireEvent.click(clearButton);
    });

    expect(input).toHaveValue('');
    
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(useDoctors).toHaveBeenLastCalledWith(expect.any(Number), expect.any(Number), '', '');
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
    (useSpecializations as any).mockReturnValue({
      specializations: [],
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
    (useSpecializations as any).mockReturnValue({
      specializations: [],
      loading: false,
      error: null,
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByText(/data unavailable/i)).toBeInTheDocument();
  });

  it('renders pagination controls', async () => {
    (useDoctors as any).mockReturnValue({
      doctors: {
        items: [
          {
            id: 'd1',
            name: 'Dr. Pop',
            specializations: [{ name: 'General' }],
          },
        ],
        totalCount: 1,
      },
      loading: false,
      error: null,
    });
    (useSpecializations as any).mockReturnValue({
      specializations: [],
      loading: false,
      error: null,
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });
});
