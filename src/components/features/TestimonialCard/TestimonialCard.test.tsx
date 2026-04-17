import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestimonialCard } from './TestimonialCard';

describe('TestimonialCard', () => {
  it('renders the testimonial text', () => {
    render(<TestimonialCard text="Great service!" author="Alice" />);
    expect(screen.getByText('Great service!')).toBeInTheDocument();
  });

  it('renders the author name', () => {
    render(<TestimonialCard text="Great service!" author="Alice" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders as an article element', () => {
    const { container } = render(<TestimonialCard text="X" author="Y" />);
    expect(container.querySelector('article.testimonial-card')).toBeInTheDocument();
  });
});
