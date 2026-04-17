import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailsSection } from './DetailsSection';

describe('DetailsSection', () => {
  it('renders the title', () => {
    render(<DetailsSection title="Patient Info"><p>Child</p></DetailsSection>);
    expect(screen.getByRole('heading', { name: 'Patient Info' })).toBeInTheDocument();
  });

  it('renders children inside content area', () => {
    render(<DetailsSection title="T"><span>Detail content</span></DetailsSection>);
    expect(screen.getByText('Detail content')).toBeInTheDocument();
  });

  it('renders headerActions when provided', () => {
    render(
      <DetailsSection title="T" headerActions={<button>Edit</button>}>
        <p>x</p>
      </DetailsSection>
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('does not render actions area when headerActions is absent', () => {
    const { container } = render(<DetailsSection title="T"><p>x</p></DetailsSection>);
    expect(container.querySelector('.details-section-actions')).not.toBeInTheDocument();
  });

  it('renders as a <section> element', () => {
    const { container } = render(<DetailsSection title="T"><p>x</p></DetailsSection>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('forwards custom className', () => {
    const { container } = render(
      <DetailsSection title="T" className="my-cls"><p>x</p></DetailsSection>
    );
    expect(container.querySelector('.details-section-container')).toHaveClass('my-cls');
  });
});
