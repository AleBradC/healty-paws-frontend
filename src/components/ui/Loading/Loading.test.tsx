import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Loading } from './Loading';

describe('Loading', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders when isLoading is true', () => {
    render(<Loading isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders a custom message', () => {
    render(<Loading isLoading={true} message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders nothing when isLoading starts as false', () => {
    render(<Loading isLoading={false} minDuration={0} />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('applies the variant class', () => {
    const { container } = render(<Loading isLoading={true} variant="fullscreen" />);
    expect(container.querySelector('.loading-container')).toHaveClass('fullscreen');
  });

  it('hides after minDuration when isLoading becomes false', async () => {
    const { rerender } = render(<Loading isLoading={true} message="Loading..." minDuration={500} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    rerender(<Loading isLoading={false} message="Loading..." minDuration={500} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
