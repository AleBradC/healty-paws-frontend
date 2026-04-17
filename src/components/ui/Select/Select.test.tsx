import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const options = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
];

describe('Select', () => {
  it('renders the label title', () => {
    render(<Select label="Pet" title="Choose a pet" options={options} />);
    expect(screen.getByText('Choose a pet')).toBeInTheDocument();
  });

  it('renders a placeholder disabled option', () => {
    render(<Select label="Pet" options={options} />);
    const placeholder = screen.getByRole('option', { name: /select pet/i });
    expect(placeholder).toBeDisabled();
  });

  it('renders all options', () => {
    render(<Select label="Pet" options={options} />);
    expect(screen.getByRole('option', { name: 'Cat' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dog' })).toBeInTheDocument();
  });

  it('calls onChange when selection changes', async () => {
    const onChange = vi.fn();
    render(
      <Select label="Pet" options={options} onChange={onChange} name="pet" />
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), 'cat');
    expect(onChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Select label="Pet" options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('reflects the controlled value', () => {
    render(<Select label="Pet" options={options} value="dog" onChange={vi.fn()} />);
    expect(screen.getByRole('combobox')).toHaveValue('dog');
  });
});
