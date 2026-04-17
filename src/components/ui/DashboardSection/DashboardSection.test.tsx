import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardSection } from './DashboardSection';

describe('DashboardSection', () => {
  it('renders the title', () => {
    render(<DashboardSection title="Profile"><p>Child</p></DashboardSection>);
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<DashboardSection title="T"><p>My Content</p></DashboardSection>);
    expect(screen.getByText('My Content')).toBeInTheDocument();
  });

  it('renders as a <div> by default', () => {
    const { container } = render(<DashboardSection title="T"><p>x</p></DashboardSection>);
    const section = container.querySelector('.dashboard-section-container');
    expect(section?.tagName).toBe('DIV');
  });

  it('renders as a <form> when as="form"', () => {
    const { container } = render(
      <DashboardSection title="T" as="form" onSubmit={vi.fn()}><p>x</p></DashboardSection>
    );
    const section = container.querySelector('.dashboard-section-container');
    expect(section?.tagName).toBe('FORM');
  });

  it('calls onSubmit when the form is submitted', async () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(
      <DashboardSection title="T" as="form" onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </DashboardSection>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('forwards custom className', () => {
    const { container } = render(
      <DashboardSection title="T" className="extra-class"><p>x</p></DashboardSection>
    );
    const section = container.querySelector('.dashboard-section-container');
    expect(section).toHaveClass('extra-class');
  });
});
