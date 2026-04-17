import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import InfoBlock from './InfoBlock';

describe('InfoBlock', () => {
  it('renders the label', () => {
    render(<InfoBlock label="Owner" value="John" />);
    expect(screen.getByText('Owner')).toBeInTheDocument();
  });

  it('renders the value', () => {
    render(<InfoBlock label="Owner" value="John" />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('renders a numeric value', () => {
    render(<InfoBlock label="Age" value={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders "N/A" when value is null', () => {
    render(<InfoBlock label="Breed" value={null} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders "N/A" when value is undefined', () => {
    render(<InfoBlock label="Breed" value={undefined} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders an empty string as-is (not N/A)', () => {
    const { container } = render(<InfoBlock label="Notes" value="" />);
    const valueSpan = container.querySelector('.info-value');
    expect(valueSpan).toHaveTextContent('');
    expect(screen.queryByText('N/A')).not.toBeInTheDocument();
  });
});
