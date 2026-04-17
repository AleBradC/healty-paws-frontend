import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders the label when provided', () => {
    render(<Textarea name="notes" label="Notes" value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('does not render a label element when label is omitted', () => {
    render(<Textarea name="notes" value="" onChange={vi.fn()} />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders a textarea element', () => {
    render(<Textarea name="notes" value="hello" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays the controlled value', () => {
    render(<Textarea name="notes" value="My text" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('My text');
  });

  it('calls onChange when user types', async () => {
    const onChange = vi.fn();
    render(<Textarea name="notes" value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('applies the correct rows attribute', () => {
    render(<Textarea name="notes" value="" onChange={vi.fn()} rows={8} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
  });

  it('applies the placeholder', () => {
    render(<Textarea name="notes" value="" onChange={vi.fn()} placeholder="Enter notes..." />);
    expect(screen.getByPlaceholderText('Enter notes...')).toBeInTheDocument();
  });
});
