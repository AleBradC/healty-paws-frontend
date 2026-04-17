import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders the text prop', () => {
    render(<Button text="Click me" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies the primary color class', () => {
    render(<Button text="Go" color="primary" />);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
  });

  it('applies the danger color class', () => {
    render(<Button text="Delete" color="danger" />);
    expect(screen.getByRole('button')).toHaveClass('btn--danger');
  });

  it('applies the sm size class', () => {
    render(<Button text="Small" size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('btn--sm');
  });

  it('applies the lg size class', () => {
    render(<Button text="Large" size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('btn--lg');
  });

  it('always has the base btn class', () => {
    render(<Button text="Base" />);
    expect(screen.getByRole('button')).toHaveClass('btn');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button text="Action" onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button text="Disabled" onClick={handleClick} disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders an anchor tag when as="a"', () => {
    render(<Button text="Link" as="a" href="/somewhere" />);
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/somewhere');
  });

  it('forwards additional className', () => {
    render(<Button text="Custom" className="my-extra-class" />);
    expect(screen.getByRole('button')).toHaveClass('my-extra-class');
  });
});
