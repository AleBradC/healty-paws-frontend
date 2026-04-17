import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PatientSummaryPage from './PatientSummaryPage';

vi.mock('../../router/ProtectedRoute/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../lib/graphql/patients/usePet', () => ({
  usePet: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

import { usePet } from '../../lib/graphql/patients/usePet';

const mockPet = {
  id: 'pet-1',
  name: 'Luna',
  type: 'Cat',
  breed: 'Siamese',
  age: '3',
  weight: '4',
  owner: { id: 'o1', name: 'Alice', user_id: 'u1' },
  lifelong_conditions: [{ id: 'lc1', condition: 'Arthritis', treatment: 'Daily supplement' }],
  active_treatments: [
    {
      id: 'at1',
      condition: 'Ear Infection',
      treatment: 'Medicated drops',
      start_date: '2024-01-01',
      end_date: '',
    },
  ],
  appointments: [],
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/patient-summary/pet-1']}>
      <Routes>
        <Route path="/patient-summary/:petId" element={<PatientSummaryPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PatientSummaryPage', () => {
  it('shows "Patient not found" when no pet exists', async () => {
    (usePet as any).mockReturnValue({ pet: null, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText(/patient not found/i)).toBeInTheDocument();
  });

  it('renders the Patient Summary heading', async () => {
    (usePet as any).mockReturnValue({ pet: mockPet, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByRole('heading', { name: /patient summary/i })).toBeInTheDocument();
  });

  it('renders the pet name', async () => {
    (usePet as any).mockReturnValue({ pet: mockPet, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText('Luna')).toBeInTheDocument();
  });

  it('renders owner name', async () => {
    (usePet as any).mockReturnValue({ pet: mockPet, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders lifelong conditions', async () => {
    (usePet as any).mockReturnValue({ pet: mockPet, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText('Arthritis')).toBeInTheDocument();
  });

  it('renders active treatments', async () => {
    (usePet as any).mockReturnValue({ pet: mockPet, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText('Ear Infection')).toBeInTheDocument();
  });

  it('shows "No past appointments" when appointments list is empty', async () => {
    (usePet as any).mockReturnValue({ pet: mockPet, error: null });
    renderPage();
    await act(async () => {});
    expect(screen.getByText(/no past appointments found/i)).toBeInTheDocument();
  });
});
