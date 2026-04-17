import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConditionSummaryCard } from './ConditionSummaryCard';

describe('ConditionSummaryCard', () => {
  it('renders the disease name', () => {
    render(<ConditionSummaryCard disease="Arthritis" treatment="Daily supplement" />);
    expect(screen.getByText('Arthritis')).toBeInTheDocument();
  });

  it('renders the treatment', () => {
    render(<ConditionSummaryCard disease="Arthritis" treatment="Daily supplement" />);
    expect(screen.getByText('Daily supplement')).toBeInTheDocument();
  });

  it('renders the Condition and Treatment labels', () => {
    render(<ConditionSummaryCard disease="X" treatment="Y" />);
    expect(screen.getByText('Condition:')).toBeInTheDocument();
    expect(screen.getByText('Treatment:')).toBeInTheDocument();
  });

  it('applies "stable" class by default', () => {
    const { container } = render(<ConditionSummaryCard disease="X" treatment="Y" />);
    expect(container.firstChild).toHaveClass('stable');
  });

  it('applies "active" class when variant="active"', () => {
    const { container } = render(
      <ConditionSummaryCard disease="X" treatment="Y" variant="active" />
    );
    expect(container.firstChild).toHaveClass('active');
  });

  it('always has the condition-summary-card class', () => {
    const { container } = render(<ConditionSummaryCard disease="X" treatment="Y" />);
    expect(container.firstChild).toHaveClass('condition-summary-card');
  });
});
