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

  it('renders the success heading', () => {
    renderPage();
    expect(screen.getByText(/registration complete/i)).toBeInTheDocument();
  });

  it('renders the thank-you message', () => {
    renderPage();
    expect(screen.getByText(/thank you for joining healthy paws/i)).toBeInTheDocument();
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
