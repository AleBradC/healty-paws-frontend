import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReadOnlyInfoBlock from './ReadOnlyInfoBlock';

describe('ReadOnlyInfoBlock', () => {
  it('renders the label and value when both are provided', () => {
    render(<ReadOnlyInfoBlock label="Breed" value="Labrador" />);
    expect(screen.getByText('Breed')).toBeInTheDocument();
    expect(screen.getByText('Labrador')).toBeInTheDocument();
  });

  it('renders "N/A" when value is empty', () => {
    render(<ReadOnlyInfoBlock label="Breed" value="" />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders "N/A" when value is null', () => {
    render(<ReadOnlyInfoBlock label="Breed" value={null} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders "N/A" when value is undefined', () => {
    render(<ReadOnlyInfoBlock label="Breed" value={undefined} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
