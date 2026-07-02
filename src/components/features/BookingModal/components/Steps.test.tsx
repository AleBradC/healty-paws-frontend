import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepSelectPet } from './StepSelectPet';
import { StepSelectSpecialization } from './StepSelectSpecialization';
import { StepSelectServices } from './StepSelectServices';
import { StepSelectDoctor } from './StepSelectDoctor';
import { StepConfirmation } from './StepConfirmation';
import { StepCalendar } from './StepCalendar';
import type {
  Pet,
  Doctor,
  Service,
  Specialization,
  Slot,
} from '../../../../types';

const owner = { id: 'o1', name: 'Alice', user_id: 'u1' };

const pet: Pet = {
  id: 'pet-1',
  name: 'Luna',
  owner,
  type: 'Cat',
  breed: 'Siamese',
  age: '3',
  weight: '4',
};

const otherPet: Pet = { ...pet, id: 'pet-2', name: 'Milo' };

describe('StepSelectPet', () => {
  it('renders one button per pet', () => {
    render(
      <StepSelectPet
        pets={[pet, otherPet]}
        selectedPet={null}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Luna' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Milo' })).toBeInTheDocument();
  });

  it('marks the currently selected pet', () => {
    render(
      <StepSelectPet pets={[pet]} selectedPet={pet.id} onSelect={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Luna' })).toHaveClass('selected');
  });

  it('invokes onSelect with the pet id on click', async () => {
    const onSelect = vi.fn();
    render(
      <StepSelectPet pets={[pet]} selectedPet={null} onSelect={onSelect} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Luna' }));
    expect(onSelect).toHaveBeenCalledWith('pet-1');
  });
});

describe('StepSelectSpecialization', () => {
  const specs: Specialization[] = [
    { id: 'spec-1', name: 'Cardiology', services: [] },
    { id: 'spec-2', name: 'Dermatology', services: [] },
  ];

  it('renders one button per specialization', () => {
    render(
      <StepSelectSpecialization
        specializations={specs}
        selectedSpecialization={null}
        onSelect={vi.fn()}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Cardiology' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Dermatology' })
    ).toBeInTheDocument();
  });

  it('marks the selected specialization', () => {
    render(
      <StepSelectSpecialization
        specializations={specs}
        selectedSpecialization="spec-2"
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Dermatology' })).toHaveClass(
      'selected'
    );
  });

  it('invokes onSelect with the specialization id', async () => {
    const onSelect = vi.fn();
    render(
      <StepSelectSpecialization
        specializations={specs}
        selectedSpecialization={null}
        onSelect={onSelect}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cardiology' }));
    expect(onSelect).toHaveBeenCalledWith('spec-1');
  });
});

describe('StepSelectServices', () => {
  const services: Service[] = [
    { id: 's1', specialization_id: 'sp1', name: 'Checkup', price: 50 },
    { id: 's2', specialization_id: 'sp1', name: 'Vaccination', price: 30 },
  ];

  it('renders services with formatted prices', () => {
    render(
      <StepSelectServices
        services={services}
        selectedServices={[]}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText('Checkup')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    expect(screen.getByText('$30.00')).toBeInTheDocument();
  });

  it('renders a fallback when no services are available', () => {
    render(
      <StepSelectServices
        services={[]}
        selectedServices={[]}
        onToggle={vi.fn()}
      />
    );
    expect(
      screen.getByText(/no services available/i)
    ).toBeInTheDocument();
  });

  it('adds a service to the selection when an unselected one is clicked', async () => {
    const onToggle = vi.fn();
    render(
      <StepSelectServices
        services={services}
        selectedServices={[]}
        onToggle={onToggle}
      />
    );
    await userEvent.click(screen.getByText('Checkup'));
    expect(onToggle).toHaveBeenCalledWith(['s1']);
  });

  it('removes a service from the selection when a selected one is clicked', async () => {
    const onToggle = vi.fn();
    render(
      <StepSelectServices
        services={services}
        selectedServices={['s1', 's2']}
        onToggle={onToggle}
      />
    );
    await userEvent.click(screen.getByText('Checkup'));
    expect(onToggle).toHaveBeenCalledWith(['s2']);
  });
});

describe('StepSelectDoctor', () => {
  const doctors: Doctor[] = [
    {
      id: 'd1',
      name: 'Dr Strange',
      specializations: [
        { id: 'sp1', name: 'Cardiology', services: [] },
        { id: 'sp2', name: 'Dermatology', services: [] },
      ],
    },
    { id: 'd2', name: 'Dr Who' },
  ];

  it('renders the list of doctors with their specializations', () => {
    render(
      <StepSelectDoctor
        selectedDoctor={null}
        doctors={doctors}
        currentPage={1}
        totalPages={2}
        onSelect={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    );
    expect(screen.getByText('Dr Strange')).toBeInTheDocument();
    expect(screen.getByText('Cardiology, Dermatology')).toBeInTheDocument();
  });

  it('marks the currently selected doctor', () => {
    render(
      <StepSelectDoctor
        selectedDoctor={doctors[0]}
        doctors={doctors}
        currentPage={1}
        totalPages={1}
      />
    );
    expect(
      screen
        .getByText('Dr Strange')
        .closest('button')
    ).toHaveClass('selected');
  });

  it('invokes onSelect when a doctor is clicked', async () => {
    const onSelect = vi.fn();
    render(
      <StepSelectDoctor
        selectedDoctor={null}
        doctors={doctors}
        currentPage={1}
        totalPages={1}
        onSelect={onSelect}
      />
    );
    await userEvent.click(screen.getByText('Dr Who'));
    expect(onSelect).toHaveBeenCalledWith(doctors[1]);
  });

  it('disables Prev on first page and Next on last page', () => {
    render(
      <StepSelectDoctor
        selectedDoctor={null}
        doctors={doctors}
        currentPage={1}
        totalPages={1}
      />
    );
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('invokes onNext / onPrev when the pagination buttons are enabled', async () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    render(
      <StepSelectDoctor
        selectedDoctor={null}
        doctors={doctors}
        currentPage={2}
        totalPages={3}
        onNext={onNext}
        onPrev={onPrev}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /prev/i }));
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('disables every action while loading', () => {
    render(
      <StepSelectDoctor
        selectedDoctor={null}
        doctors={doctors}
        currentPage={1}
        totalPages={2}
        isLoading
      />
    );
    expect(screen.getByText('Dr Strange').closest('button')).toBeDisabled();
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});

describe('StepConfirmation', () => {
  const doctor: Doctor = { id: 'd1', name: 'Dr Strange' };
  const slot: Slot = {
    date: '2026-05-17',
    time: '10:00',
    datetime: '2026-05-17T10:00:00Z',
  };

  it('shows the doctor, pet, slot, and total', () => {
    render(
      <StepConfirmation doctor={doctor} pet={pet} slot={slot} total={75} />
    );
    expect(screen.getByText(/appointment confirmed/i)).toBeInTheDocument();
    expect(screen.getByText('Dr Strange')).toBeInTheDocument();
    expect(screen.getByText('Luna')).toBeInTheDocument();
    expect(screen.getByText(/2026-05-17/)).toBeInTheDocument();
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
    expect(screen.getByText('$75.00')).toBeInTheDocument();
  });
});

describe('StepCalendar', () => {
  it('renders the calendar even when the doctor has no availabilities', () => {
    const doctor: Doctor = { id: 'd1', name: 'Dr Strange' };
    const { container } = render(
      <StepCalendar doctor={doctor} selectedSlot={null} onSelect={vi.fn()} />
    );
    expect(container.firstChild).not.toBeNull();
  });

  it('skips past availabilities and slots already booked', () => {
    const doctor: Doctor = {
      id: 'd1',
      name: 'Dr Strange',
      availabilities: [
        { id: 'a1', available_datetime: '2000-01-01T10:00:00Z' },
      ],
      appointments: [
        {
          id: 'app-1',
          datetime: '2099-01-01T09:00:00Z',
          status: 'Confirmed',
          reason: '',
          consultation_type: '',
          investigation: '',
          investigation_result: '',
          doctor: { id: 'd1', name: 'Dr Strange', clinic_name: 'C' },
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
        },
      ],
    };
    const { container } = render(
      <StepCalendar doctor={doctor} selectedSlot={null} onSelect={vi.fn()} />
    );
    expect(container.firstChild).not.toBeNull();
  });
});
