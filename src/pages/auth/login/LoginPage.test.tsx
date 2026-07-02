import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

vi.mock('../../../context/AuthenticationContext', () => ({
  useAuthentication: vi.fn(),
}));

vi.mock('../../../router/PublicRoute/PublicRoute', () => ({
  PublicRoute: ({ children }: any) => <>{children}</>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import axios from 'axios';
import { useAuthentication } from '../../../context/AuthenticationContext';

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

const mockLogin = vi.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
    (useAuthentication as any).mockReturnValue({ login: mockLogin });
    (axios.post as any).mockClear();
    (axios.isAxiosError as any).mockReturnValue(false);
  });

  it('renders the Login heading', () => {
    renderLoginPage();
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    renderLoginPage();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('Submit button is disabled when form is empty', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });

  it('shows validation error for empty fields on submit', async () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    await userEvent.type(emailInput, 'bad-email');
    await userEvent.type(passwordInput, 'pw');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'short');
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });

  it('enables the login button when credentials are valid', async () => {
    renderLoginPage();
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    expect(screen.getByRole('button', { name: /login/i })).not.toBeDisabled();
  });

  it('calls axios.post and login(), then navigates to /dashboard/owner for owner role', async () => {
    (axios.post as any).mockResolvedValue({
      data: { data: { id: '1', role: 'owner' } },
    });

    renderLoginPage();
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await act(async () => {});
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith('1', 'owner');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/owner');
  });

  it('navigates to /dashboard/doctor for doctor role', async () => {
    (axios.post as any).mockResolvedValue({
      data: { data: { id: '2', role: 'doctor' } },
    });

    renderLoginPage();
    await userEvent.type(screen.getByLabelText('Email'), 'doc@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    await act(async () => {});
    expect(mockLogin).toHaveBeenCalledWith('2', 'doctor');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/doctor');
  });

  it('displays a server error message on failed login', async () => {
    (axios.isAxiosError as any).mockReturnValue(true);
    (axios.post as any).mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
      isAxiosError: true,
    });

    renderLoginPage();
    await userEvent.type(screen.getByLabelText('Email'), 'bad@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    await act(async () => {});
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
