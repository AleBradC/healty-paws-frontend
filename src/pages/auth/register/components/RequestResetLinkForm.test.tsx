import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RequestResetLinkForm } from './RequestResetLinkForm';

const submit = vi.fn();
const clearError = vi.fn();
let mockHookState: {
  isLoading: boolean;
  error: string | undefined;
} = { isLoading: false, error: undefined };

vi.mock('./useResetPasswordApi', () => ({
  useRequestPasswordReset: () => ({
    submit,
    clearError,
    isLoading: mockHookState.isLoading,
    error: mockHookState.error,
  }),
}));

describe('RequestResetLinkForm', () => {
  beforeEach(() => {
    submit.mockReset();
    clearError.mockReset();
    mockHookState = { isLoading: false, error: undefined };
  });

  it('renders the heading and the email field', () => {
    render(<RequestResetLinkForm onBackToLogin={vi.fn()} />);
    expect(
      screen.getByRole('heading', { name: /reset password/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('keeps the submit button disabled while the email is empty or invalid', async () => {
    render(<RequestResetLinkForm onBackToLogin={vi.fn()} />);
    const button = screen.getByRole('button', { name: /send reset link/i });
    expect(button).toBeDisabled();

    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'not-an-email'
    );
    expect(button).toBeDisabled();
  });

  it('submits the trimmed email and shows the confirmation screen on success', async () => {
    submit.mockResolvedValue({ ok: true });
    const onBackToLogin = vi.fn();
    render(<RequestResetLinkForm onBackToLogin={onBackToLogin} />);

    await userEvent.type(
      screen.getByLabelText(/email address/i),
      '   jane@example.com   '
    );
    const button = screen.getByRole('button', { name: /send reset link/i });
    expect(button).not.toBeDisabled();

    await userEvent.click(button);
    await act(async () => {});

    expect(submit).toHaveBeenCalledWith('jane@example.com');
    expect(
      await screen.findByRole('heading', { name: /check your email/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/jane@example\.com/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to login/i }));
    expect(onBackToLogin).toHaveBeenCalledTimes(1);
  });

  it('keeps the form rendered when submit reports failure', async () => {
    submit.mockResolvedValue({ ok: false });
    render(<RequestResetLinkForm onBackToLogin={vi.fn()} />);

    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'jane@example.com'
    );
    await userEvent.click(
      screen.getByRole('button', { name: /send reset link/i })
    );
    await act(async () => {});

    expect(
      screen.queryByRole('heading', { name: /check your email/i })
    ).not.toBeInTheDocument();
  });

  it('displays a server error and clears it on next change', async () => {
    mockHookState = { isLoading: false, error: 'Boom' };
    render(<RequestResetLinkForm onBackToLogin={vi.fn()} />);
    expect(screen.getByText('Boom')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/email address/i), 'a');
    expect(clearError).toHaveBeenCalled();
  });

  it('shows the loading label while a submit is in flight', () => {
    mockHookState = { isLoading: true, error: undefined };
    render(<RequestResetLinkForm onBackToLogin={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /sending\.\.\./i })
    ).toBeDisabled();
  });

  it('invokes onBackToLogin when the inline link is clicked', async () => {
    const onBackToLogin = vi.fn();
    render(<RequestResetLinkForm onBackToLogin={onBackToLogin} />);
    await userEvent.click(screen.getByRole('button', { name: /back to login/i }));
    expect(onBackToLogin).toHaveBeenCalledTimes(1);
  });
});
