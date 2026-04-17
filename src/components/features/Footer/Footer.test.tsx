import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the footer element with contentinfo role', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders an "About" link with the correct href', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: 'About' });
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders a "Contact" link with the correct href', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: 'Contact' });
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('renders a "Privacy Policy" link with the correct href', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: 'Privacy Policy' });
    expect(link).toHaveAttribute('href', '/privacy');
  });

  it('renders the current year in the copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it('renders "HealthyPaws" in the copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText(/HealthyPaws/)).toBeInTheDocument();
  });
});
