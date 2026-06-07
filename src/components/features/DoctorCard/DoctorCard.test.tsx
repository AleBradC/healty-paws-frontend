import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoctorCard } from './DoctorCard';

const defaultProps = {
  id: 'doc-1',
  name: 'Elena Pop',
  specializations: 'Dermatology',
  clinic: 'PawsClinic',
  address: '123 Main St',
  imageUrl: '/doc.png',
  onSelect: vi.fn(),
};

describe('DoctorCard', () => {
  it('renders the doctor name', () => {
    render(<DoctorCard {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Dr. Elena Pop' })).toBeInTheDocument();
  });

  it('renders specializations', () => {
    render(<DoctorCard {...defaultProps} />);
    expect(screen.getByText('Dermatology')).toBeInTheDocument();
  });

  it('renders the clinic name', () => {
    render(<DoctorCard {...defaultProps} />);
    expect(screen.getByText('PawsClinic')).toBeInTheDocument();
  });

  it('renders the address', () => {
    render(<DoctorCard {...defaultProps} />);
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('renders the doctor image with correct alt text', () => {
    render(<DoctorCard {...defaultProps} />);
    expect(screen.getByAltText('Photo of Elena Pop')).toHaveAttribute('src', '/doc.png');
  });

  it('calls onSelect with the doctor id when "Choose this Doctor" is clicked', async () => {
    const onSelect = vi.fn();
    render(<DoctorCard {...defaultProps} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /choose this doctor/i }));
    expect(onSelect).toHaveBeenCalledWith('doc-1');
  });

  it('renders as an article element', () => {
    const { container } = render(<DoctorCard {...defaultProps} />);
    expect(container.querySelector('article.doctor-card')).toBeInTheDocument();
  });
});
