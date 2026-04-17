import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders a label when provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('does not render a label when omitted', () => {
    render(<Input />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders a hint message', () => {
    render(<Input label="Name" hint="Enter your full name" />);
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('renders an error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('does not render hint when error is present', () => {
    render(<Input label="X" hint="A hint" error="An error" />);
    expect(screen.queryByText('A hint')).not.toBeInTheDocument();
    expect(screen.getByText('An error')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input label="X" error="Bad" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows password toggle for type="password"', () => {
    render(<Input type="password" showToggle />);
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const { container } = render(<Input type="password" showToggle />);
    const input = container.querySelector('input')!;
    const toggle = screen.getByRole('button', { name: /show password/i });

    // Initially password type
    expect(document.querySelector('input')).toHaveAttribute('type', 'password');
    await userEvent.click(toggle);
    expect(document.querySelector('input')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
  });

  it('applies the full-width class by default', () => {
    const { container } = render(<Input />);
    expect(container.firstChild).toHaveClass('full-width');
  });

  it('does not apply full-width class when fullWidth is false', () => {
    const { container } = render(<Input fullWidth={false} />);
    expect(container.firstChild).not.toHaveClass('full-width');
  });

  it('applies size class based on size prop', () => {
    const { container } = render(<Input size="lg" />);
    expect(container.querySelector('.input-control')).toHaveClass('size-lg');
  });

  it('applies has-error class when error is present', () => {
    const { container } = render(<Input error="Oops" />);
    expect(container.querySelector('.input-control')).toHaveClass('has-error');
  });
});
