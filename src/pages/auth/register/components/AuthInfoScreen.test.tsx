import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthInfoScreen } from './AuthInfoScreen';

describe('AuthInfoScreen', () => {
  const baseProps = {
    title: 'Check your email',
    description: 'We sent a magic link to jane@example.com',
    ctaLabel: 'Back to login',
    onCta: vi.fn(),
  };

  it('renders the title, description, and CTA label', () => {
    render(<AuthInfoScreen {...baseProps} />);
    expect(
      screen.getByRole('heading', { name: /check your email/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/we sent a magic link to jane@example.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /back to login/i })
    ).toBeInTheDocument();
  });

  it('accepts a ReactNode description', () => {
    render(
      <AuthInfoScreen
        {...baseProps}
        description={
          <span data-testid="rich-desc">
            Hello <strong>friend</strong>
          </span>
        }
      />
    );
    expect(screen.getByTestId('rich-desc')).toBeInTheDocument();
    expect(screen.getByText(/friend/i)).toBeInTheDocument();
  });

  it('invokes onCta when the button is clicked', async () => {
    const onCta = vi.fn();
    render(<AuthInfoScreen {...baseProps} onCta={onCta} />);
    await userEvent.click(screen.getByRole('button', { name: /back to login/i }));
    expect(onCta).toHaveBeenCalledTimes(1);
  });
});
