import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppointmentSummaryPage from './AppointmentSummaryPage';

vi.mock('../../router/ProtectedRoute/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../lib/graphql/appointments/useAppointment', () => ({
  useAppointment: vi.fn(),
}));

import { useAppointment } from '../../lib/graphql/appointments/useAppointment';

const mockAppointment = {
  id: 'appt-1',
  datetime: '2024-06-01T10:00:00Z',
  status: 'Completed',
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
    <MemoryRouter initialEntries={['/appointment-summary/appt-1']}>
      <Routes>
        <Route path="/appointment-summary/:appointmentId" element={<AppointmentSummaryPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AppointmentSummaryPage', () => {
  it('shows "Appointment not found" when no appointment exists', async () => {
    (useAppointment as any).mockReturnValue({ appointment: null, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText(/appointment not found/i)).toBeInTheDocument();
  });

  it('renders the Appointment Summary heading', async () => {
    (useAppointment as any).mockReturnValue({ appointment: mockAppointment, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByRole('heading', { name: /appointment summary/i })).toBeInTheDocument();
  });

  it('renders patient name', async () => {
    (useAppointment as any).mockReturnValue({ appointment: mockAppointment, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText(/luna/i)).toBeInTheDocument();
  });

  it('renders doctor name in the footer', async () => {
    (useAppointment as any).mockReturnValue({ appointment: mockAppointment, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText(/Dr. Smith/)).toBeInTheDocument();
  });

  it('renders consultation type', async () => {
    (useAppointment as any).mockReturnValue({ appointment: mockAppointment, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText('In-Person')).toBeInTheDocument();
  });

  it('renders reason for visit', async () => {
    (useAppointment as any).mockReturnValue({ appointment: mockAppointment, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText('Annual checkup')).toBeInTheDocument();
  });

  it('shows "No lifelong conditions" when list is empty', async () => {
    (useAppointment as any).mockReturnValue({ appointment: mockAppointment, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText(/no lifelong conditions were recorded/i)).toBeInTheDocument();
  });
});
