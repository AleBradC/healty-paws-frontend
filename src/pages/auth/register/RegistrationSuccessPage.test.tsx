import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegistrationSuccessPage from './RegistrationSuccessPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderPage() {
  return render(
    <MemoryRouter>
      <RegistrationSuccessPage />
    </MemoryRouter>
  );
}

describe('RegistrationSuccessPage', () => {
  beforeEach(() => mockNavigate.mockClear());

  // After F-16, registration no longer completes the account creation flow —
  // it kicks off the verification mail and asks the user to check their inbox.
  it('renders the check-your-email heading', () => {
    renderPage();
    expect(screen.getByText(/check your email/i)).toBeInTheDocument();
  });

  it('explains the verification link expiry', () => {
    renderPage();
    expect(
      screen.getByText(/we've sent you a verification link/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/expires in 24 hours/i)).toBeInTheDocument();
  });

  it('renders the Proceed to Login button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /proceed to login/i })).toBeInTheDocument();
  });

  it('navigates to /auth/login when Proceed to Login is clicked', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /proceed to login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });
});
