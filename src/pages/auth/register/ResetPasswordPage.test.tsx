import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage';

vi.mock('../../../router/PublicRoute/PublicRoute', () => ({
  PublicRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./components/RequestResetLinkForm', () => ({
  RequestResetLinkForm: ({
    onBackToLogin,
  }: {
    onBackToLogin: () => void;
  }) => (
    <div>
      <span>request-reset-form</span>
      <button onClick={onBackToLogin}>back-to-login</button>
    </div>
  ),
}));

vi.mock('./components/NewPasswordForm', () => ({
  NewPasswordForm: ({
    token,
    onBackToLogin,
    onRequestNewLink,
  }: {
    token: string;
    onBackToLogin: () => void;
    onRequestNewLink: () => void;
  }) => (
    <div>
      <span>new-password-form</span>
      <span>token={token}</span>
      <button onClick={onBackToLogin}>back-to-login</button>
      <button onClick={onRequestNewLink}>request-new-link</button>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <ResetPasswordPage />
    </MemoryRouter>
  );
}

describe('ResetPasswordPage', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders the request-link form when no token is in the URL', () => {
    renderAt('/auth/reset-password');
    expect(screen.getByText('request-reset-form')).toBeInTheDocument();
    expect(screen.queryByText('new-password-form')).not.toBeInTheDocument();
  });

  it('renders the new-password form when a token is in the URL', () => {
    renderAt('/auth/reset-password?token=abc123');
    expect(screen.getByText('new-password-form')).toBeInTheDocument();
    expect(screen.getByText('token=abc123')).toBeInTheDocument();
  });

  it('navigates to /auth/login when the request form fires onBackToLogin', async () => {
    renderAt('/auth/reset-password');
    await userEvent.click(
      screen.getByRole('button', { name: 'back-to-login' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });

  it('navigates back to /auth/reset-password (replace) when token form requests a new link', async () => {
    renderAt('/auth/reset-password?token=expired');
    await userEvent.click(
      screen.getByRole('button', { name: 'request-new-link' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/auth/reset-password', {
      replace: true,
    });
  });
});
