import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppointmentDetailsPage from './AppointmentDetailsPage';

vi.mock('../../router/ProtectedRoute/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../lib/graphql/appointments/useAppointment', () => ({
  useAppointment: vi.fn(),
}));
vi.mock('../../lib/graphql/appointments/useUpdateAppointment', () => ({
  useUpdateAppointment: () => ({
    updateAppointmentDetails: vi.fn(),
    loading: false,
  }),
}));

import { useAppointment } from '../../lib/graphql/appointments/useAppointment';

const mockAppointment = {
  id: 'appt-1',
  datetime: '2024-06-01T10:00:00Z',
  status: 'Upcoming',
  reason: 'Annual checkup',
  consultation_type: 'In-Person',
  investigation: 'Blood test',
  investigation_result: 'Normal',
  doctor: { id: 'd1', name: 'Smith', clinic_name: 'PawsClinic' },
  patient: {
    id: 'pet-1',
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese',
    age: '3',
    weight: '4',
    owner: { id: 'o1', name: 'Alice' },
    lifelong_conditions: [],
    active_treatments: [],
  },
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/appointment-details/appt-1']}>
      <Routes>
        <Route path="/appointment-details/:appointmentId" element={<AppointmentDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AppointmentDetailsPage', () => {
  it('shows "Appointment not found" when fetch fails', async () => {
    (useAppointment as any).mockReturnValue({
      appointment: null,
      error: new Error('Not found'),
      refetch: vi.fn(),
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByText(/appointment not found/i)).toBeInTheDocument();
  });

  it('renders the Appointment details heading', async () => {
    (useAppointment as any).mockReturnValue({
      appointment: mockAppointment,
      error: null,
      refetch: vi.fn(),
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByRole('heading', { name: /appointment details/i })).toBeInTheDocument();
  });

  it('pre-populates patient name input', async () => {
    (useAppointment as any).mockReturnValue({
      appointment: mockAppointment,
      error: null,
      refetch: vi.fn(),
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByDisplayValue('Luna')).toBeInTheDocument();
  });

  it('shows the "Add New Lifelong Condition" button', async () => {
    (useAppointment as any).mockReturnValue({
      appointment: mockAppointment,
      error: null,
      refetch: vi.fn(),
    });
    renderPage();
    await act(async () => {});
    expect(screen.getByRole('button', { name: /add new lifelong condition/i })).toBeInTheDocument();
  });

  it('clicking "Add New Lifelong Condition" shows condition inputs', async () => {
    (useAppointment as any).mockReturnValue({
      appointment: mockAppointment,
      error: null,
      refetch: vi.fn(),
    });
    renderPage();
    await act(async () => {});
    await userEvent.click(screen.getByRole('button', { name: /add new lifelong condition/i }));
    expect(screen.getByPlaceholderText(/e.g. Arthritis/i)).toBeInTheDocument();
  });

  it('Save All Changes button is disabled initially (no changes)', async () => {
    (useAppointment as any).mockReturnValue({
      appointment: { ...mockAppointment, status: 'Completed' },
      error: null,
      refetch: vi.fn(),
    });
    renderPage();
    await act(async () => {});
    const saveBtn = screen.getByRole('button', { name: /saved/i });
    expect(saveBtn).toBeDisabled();
  });
});
