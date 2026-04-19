import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvailabilityModal } from './AvailabilityModal';

// Mock react-day-picker and date-fns as they require DOM APIs unavailable in jsdom
vi.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect, selected }: any) => (
    <div data-testid="day-picker">
      <button
        onClick={() => onSelect(new Date('2024-06-01'))}
        type="button"
      >
        Select Day
      </button>
    </div>
  ),
}));

vi.mock('date-fns', () => ({
  format: (date: Date, fmt: string) => {
    if (fmt === 'yyyy-MM-dd') return '2024-06-01';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  },
}));

const initialAvailability = {
  '2024-06-01': ['09:00', '10:00'],
};

describe('AvailabilityModal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-05-31T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the modal title', () => {
    render(
      <AvailabilityModal
        initialAvailability={initialAvailability}
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText(/manage your availability/i)).toBeInTheDocument();
  });

  it('Save Changes is disabled when no changes are made', () => {
    render(
      <AvailabilityModal
        initialAvailability={initialAvailability}
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
  });

  it('Cancel button calls onClose', async () => {
    const onClose = vi.fn();
    render(
      <AvailabilityModal
        initialAvailability={initialAvailability}
        onSave={vi.fn()}
        onClose={onClose}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave and onClose when Save Changes is clicked after a change', async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();

    // Start with empty availability so toggling a slot creates a change
    render(
      <AvailabilityModal
        initialAvailability={{}}
        onSave={onSave}
        onClose={onClose}
      />
    );

    // Click a time slot to toggle it
    const slot = screen.getByRole('button', { name: '09:00' });
    await userEvent.click(slot);

    // Save Changes should now be enabled
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    expect(saveBtn).not.toBeDisabled();
    await userEvent.click(saveBtn);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
