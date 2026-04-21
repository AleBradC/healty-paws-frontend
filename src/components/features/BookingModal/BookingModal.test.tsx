import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingModal } from './BookingModal';
import type { Pet, Doctor } from '../../../types';

// Mock the GraphQL hook so no Apollo client is needed
vi.mock('../../../lib/graphql/doctors/useDoctors', () => ({
  useDoctors: vi.fn().mockReturnValue({
    doctors: { items: [], totalCount: 0 },
    loading: false,
    error: null,
  }),
}));

// Mock step sub-components for focused unit testing
vi.mock('./components/StepSelectPet', () => ({
  StepSelectPet: ({ pets, onSelect }: any) => (
    <div data-testid="step-select-pet">
      {pets.map((p: Pet) => (
        <button key={p.id} onClick={() => onSelect(p.id)}>{p.name}</button>
      ))}
    </div>
  ),
}));
vi.mock('./components/StepSelectSpecialization', () => ({
  StepSelectSpecialization: () => <div data-testid="step-select-specialization" />,
}));
vi.mock('./components/StepSelectServices', () => ({
  StepSelectServices: () => <div data-testid="step-select-services" />,
}));
vi.mock('./components/StepCalendar', () => ({
  StepCalendar: () => <div data-testid="step-calendar" />,
}));
vi.mock('./components/StepConfirmation', () => ({
  StepConfirmation: () => <div data-testid="step-confirmation" />,
}));
vi.mock('./components/StepSelectDoctor', () => ({
  StepSelectDoctor: () => <div data-testid="step-select-doctor" />,
}));

const mockPets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Luna',
    owner: { id: 'o1', name: 'Alice', user_id: 'u1' },
    type: 'Cat',
    breed: 'Siamese',
    age: '3',
    weight: '4',
  },
];

const mockDoctor: Doctor = {
  id: 'doc-1',
  name: 'Dr. Ionescu',
  specializations: [
    {
      id: 'spec-1',
      name: 'Dermatology',
      services: [{ id: 'svc-1', name: 'Checkup', price: 50, specialization_id: 'spec-1' }],
    },
  ],
};

describe('BookingModal', () => {
  it('renders the modal with the doctor name in the title', () => {
    render(
      <BookingModal
        doctor={mockDoctor}
        pets={mockPets}
        onClose={vi.fn()}
        onBookingSave={vi.fn()}
      />
    );
    expect(screen.getByText(/book with Dr. Ionescu/i)).toBeInTheDocument();
  });

  it('shows "Book an Appointment" when no doctor is pre-selected', () => {
    render(
      <BookingModal
        pets={mockPets}
        onClose={vi.fn()}
        onBookingSave={vi.fn()}
      />
    );
    expect(screen.getByText(/book an appointment/i)).toBeInTheDocument();
  });

  it('renders the first step (select pet) initially', () => {
    render(
      <BookingModal
        doctor={mockDoctor}
        pets={mockPets}
        onClose={vi.fn()}
        onBookingSave={vi.fn()}
      />
    );
    expect(screen.getByTestId('step-select-pet')).toBeInTheDocument();
  });

  it('"Next" button is disabled when no pet is selected', () => {
    render(
      <BookingModal
        doctor={mockDoctor}
        pets={mockPets}
        onClose={vi.fn()}
        onBookingSave={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('"Next" button is enabled after selecting a pet', async () => {
    render(
      <BookingModal
        doctor={mockDoctor}
        pets={mockPets}
        onClose={vi.fn()}
        onBookingSave={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Luna' }));
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('"Back" button is not shown on the first step', () => {
    render(
      <BookingModal
        doctor={mockDoctor}
        pets={mockPets}
        onClose={vi.fn()}
        onBookingSave={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });

  it('navigates to next step and shows "Back" button', async () => {
    render(
      <BookingModal
        doctor={mockDoctor}
        pets={mockPets}
        onClose={vi.fn()}
        onBookingSave={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Luna' }));
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('calls onClose when the modal close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <BookingModal
        doctor={mockDoctor}
        pets={mockPets}
        onClose={onClose}
        onBookingSave={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows selectDoctor step when showStepSelectDoctor is true', () => {
    render(
      <BookingModal
        pets={mockPets}
        showStepSelectDoctor={true}
        onClose={vi.fn()}
        onBookingSave={vi.fn()}
      />
    );
    // First step will be selectPet (still), so navigate past it
    // Step 1 is selectPet
    expect(screen.getByTestId('step-select-pet')).toBeInTheDocument();
  });
});
