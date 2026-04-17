import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterRolePage from './RegisterRolePage';

// Stub PublicRoute to just render children
vi.mock('../../../router/PublicRoute/PublicRoute', () => ({
  PublicRoute: ({ children }: any) => <>{children}</>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterRolePage />
    </MemoryRouter>
  );
}

describe('RegisterRolePage', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /join healthy paws/i })).toBeInTheDocument();
  });

  it('renders "Register as a Doctor" button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /register as a doctor/i })).toBeInTheDocument();
  });

  it('renders "Register your pet" button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /register your pet/i })).toBeInTheDocument();
  });

  it('navigates to doctor registration path on doctor button click', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /register as a doctor/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/auth/register/doctor');
  });

  it('navigates to owner registration path on pet button click', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /register your pet/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/auth/register/owner');
  });

  it('navigates to login on Login button click', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });
});
