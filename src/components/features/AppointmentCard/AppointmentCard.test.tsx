import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppointmentCard } from './AppointmentCard';

describe('AppointmentCard', () => {
  const defaultProps = {
    id: '1',
    status: 'Upcoming',
    petName: 'Luna',
    date: '2024-06-01',
    time: '10:00',
    datetime: '2024-06-01T10:00:00Z',
  };

  it('renders the pet name', () => {
    render(<AppointmentCard {...defaultProps} />);
    expect(screen.getByText(/Luna/)).toBeInTheDocument();
  });

  it('renders the date', () => {
    render(<AppointmentCard {...defaultProps} />);
    expect(screen.getByText('2024-06-01')).toBeInTheDocument();
  });

  it('renders the time', () => {
    render(<AppointmentCard {...defaultProps} />);
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('renders the status text', () => {
    render(<AppointmentCard {...defaultProps} />);
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('applies status CSS class based on status', () => {
    const { container } = render(<AppointmentCard {...defaultProps} status="Completed" />);
    expect(container.firstChild).toHaveClass('status-completed');
  });

  it('renders the doctorName when provided', () => {
    render(<AppointmentCard {...defaultProps} doctorName="Dr. Smith" />);
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked (not disabled)', async () => {
    const onClick = vi.fn();
    render(<AppointmentCard {...defaultProps} onClick={onClick} />);
    await userEvent.click(screen.getByText(/Luna/));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<AppointmentCard {...defaultProps} onClick={onClick} isDisabled={true} />);
    await userEvent.click(screen.getByText(/Luna/));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders the cancel button when onDelete is provided', () => {
    render(<AppointmentCard {...defaultProps} onDelete={vi.fn()} />);
    expect(screen.getByRole('button', { name: /cancel appointment/i })).toBeInTheDocument();
  });

  it('calls onDelete and stops propagation when cancel button is clicked', async () => {
    const onDelete = vi.fn();
    const onClick = vi.fn();
    render(<AppointmentCard {...defaultProps} onDelete={onDelete} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel appointment/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders Accept/Deny buttons when in Pending status with handlers', () => {
    render(
      <AppointmentCard 
        {...defaultProps} 
        status="Pending" 
        onAccept={vi.fn()} 
        onDeny={vi.fn()} 
      />
    );
    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deny/i })).toBeInTheDocument();
  });

  it('calls onAccept and onDeny when buttons are clicked', async () => {
    const onAccept = vi.fn();
    const onDeny = vi.fn();
    render(
      <AppointmentCard 
        {...defaultProps} 
        status="Pending" 
        onAccept={onAccept} 
        onDeny={onDeny} 
      />
    );
    
    await userEvent.click(screen.getByRole('button', { name: /accept/i }));
    expect(onAccept).toHaveBeenCalledTimes(1);
    
    await userEvent.click(screen.getByRole('button', { name: /deny/i }));
    expect(onDeny).toHaveBeenCalledTimes(1);
  });

  it('applies clickable class when onClick is provided', () => {
    const { container } = render(<AppointmentCard {...defaultProps} onClick={vi.fn()} />);
    expect(container.firstChild).toHaveClass('clickable');
  });

  it('applies disabled class when isDisabled is true', () => {
    const { container } = render(<AppointmentCard {...defaultProps} isDisabled={true} />);
    expect(container.firstChild).toHaveClass('disabled');
  });
});
