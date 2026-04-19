import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
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
  const setupUser = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
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
    const user = setupUser();
    const onClose = vi.fn();
    render(
      <AvailabilityModal
        initialAvailability={initialAvailability}
        onSave={vi.fn()}
        onClose={onClose}
      />
    );
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
