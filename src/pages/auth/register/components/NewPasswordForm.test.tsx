import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewPasswordForm } from './NewPasswordForm';

const submit = vi.fn();
const clearError = vi.fn();
let mockHookState: {
  isLoading: boolean;
  error: string | undefined;
  isTokenInvalid: boolean;
} = { isLoading: false, error: undefined, isTokenInvalid: false };

vi.mock('./useResetPasswordApi', () => ({
  useResetPasswordWithToken: () => ({
    submit,
    clearError,
    isLoading: mockHookState.isLoading,
    error: mockHookState.error,
    isTokenInvalid: mockHookState.isTokenInvalid,
  }),
}));

const VALID_PW = 'StrongPass1!';

describe('NewPasswordForm', () => {
  beforeEach(() => {
    submit.mockReset();
    clearError.mockReset();
    mockHookState = { isLoading: false, error: undefined, isTokenInvalid: false };
  });

  function renderForm(overrides: Partial<React.ComponentProps<typeof NewPasswordForm>> = {}) {
    return render(
      <NewPasswordForm
        token="abc"
        onBackToLogin={vi.fn()}
        onRequestNewLink={vi.fn()}
        {...overrides}
      />
    );
  }

  it('renders the form with both password fields', () => {
    renderForm();
    expect(
      screen.getByRole('heading', { name: /set new password/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
  });

  it('keeps submit disabled until both fields are valid and matching', async () => {
    renderForm();
    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/^new password$/i), 'short');
    expect(button).toBeDisabled();
  });

  it('submits and shows the success screen', async () => {
    submit.mockResolvedValue({ ok: true });
    const onBackToLogin = vi.fn();
    renderForm({ onBackToLogin });

    await userEvent.type(screen.getByLabelText(/^new password$/i), VALID_PW);
    await userEvent.type(
      screen.getByLabelText(/^confirm password$/i),
      VALID_PW
    );
    await userEvent.click(
      screen.getByRole('button', { name: /reset password/i })
    );
    await act(async () => {});

    expect(submit).toHaveBeenCalledWith('abc', VALID_PW);
    expect(
      await screen.findByRole('heading', { name: /password reset/i })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to login/i }));
    expect(onBackToLogin).toHaveBeenCalledTimes(1);
  });

  it('keeps the form when submit reports failure', async () => {
    submit.mockResolvedValue({ ok: false });
    renderForm();

    await userEvent.type(screen.getByLabelText(/^new password$/i), VALID_PW);
    await userEvent.type(
      screen.getByLabelText(/^confirm password$/i),
      VALID_PW
    );
    await userEvent.click(
      screen.getByRole('button', { name: /reset password/i })
    );
    await act(async () => {});

    expect(
      screen.queryByRole('heading', { name: /password reset/i })
    ).not.toBeInTheDocument();
  });

  it('renders the link-expired screen when isTokenInvalid is true', async () => {
    mockHookState = { isLoading: false, error: undefined, isTokenInvalid: true };
    const onRequestNewLink = vi.fn();
    renderForm({ onRequestNewLink });

    expect(
      screen.getByRole('heading', { name: /link expired/i })
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /request a new link/i })
    );
    expect(onRequestNewLink).toHaveBeenCalledTimes(1);
  });

  it('shows the server error and clears it on edit', async () => {
    mockHookState = {
      isLoading: false,
      error: 'Server exploded',
      isTokenInvalid: false,
    };
    renderForm();
    expect(screen.getByText(/server exploded/i)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/^new password$/i), 'a');
    expect(clearError).toHaveBeenCalled();
  });

  it('shows the loading label while submitting', () => {
    mockHookState = {
      isLoading: true,
      error: undefined,
      isTokenInvalid: false,
    };
    renderForm();
    expect(
      screen.getByRole('button', { name: /resetting\.\.\./i })
    ).toBeDisabled();
  });
});
