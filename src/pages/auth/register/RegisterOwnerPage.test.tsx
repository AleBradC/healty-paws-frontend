import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterOwnerPage from './RegisterOwnerPage';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import axios from 'axios';

const post = axios.post as unknown as ReturnType<typeof vi.fn>;
const isAxiosError = axios.isAxiosError as unknown as ReturnType<typeof vi.fn>;

function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterOwnerPage />
    </MemoryRouter>
  );
}

async function fillStep1() {
  await userEvent.type(screen.getByLabelText(/your name/i), 'Jane');
  await userEvent.type(
    screen.getByLabelText(/your email/i),
    'jane@example.com'
  );
  await userEvent.type(screen.getByLabelText(/^password$/i), 'StrongPass1!');
  await userEvent.type(
    screen.getByLabelText(/confirm password/i),
    'StrongPass1!'
  );
}

async function fillStep2() {
  await userEvent.type(screen.getByLabelText(/pet's name/i), 'Rex');
  await userEvent.type(screen.getByLabelText(/pet type/i), 'Dog');
  await userEvent.type(screen.getByLabelText(/pet's breed/i), 'Lab');
  await userEvent.type(screen.getByLabelText(/pet's age/i), '3');
  await userEvent.type(screen.getByLabelText(/pet's weight/i), '12.5');
}

describe('RegisterOwnerPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    post.mockReset();
    isAxiosError.mockReset();
  });

  it('renders step 1 by default', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: /your details/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/your pet's details/i)).not.toBeInTheDocument();
  });

  it('blocks step transition when step 1 is invalid', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await act(async () => {});
    expect(
      screen.queryByText(/your pet's details/i)
    ).not.toBeInTheDocument();
  });

  it('advances to step 2 once step 1 is valid', async () => {
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(
      await screen.findByText(/your pet's details/i)
    ).toBeInTheDocument();
  });

  it('returns to step 1 from the back button on step 2', async () => {
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await screen.findByText(/your pet's details/i);

    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(
      screen.getByRole('heading', { name: /your details/i })
    ).toBeInTheDocument();
  });

  it('submits the full payload and navigates on a 201', async () => {
    post.mockResolvedValue({ status: 201 });
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await fillStep2();
    await userEvent.click(
      screen.getByRole('button', { name: /create account/i })
    );
    await act(async () => {});

    expect(post).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/auth/register/success');
  });

  it('surfaces a server error message', async () => {
    isAxiosError.mockReturnValue(true);
    post.mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'Email already taken' } },
    });
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await fillStep2();
    await userEvent.click(
      screen.getByRole('button', { name: /create account/i })
    );

    expect(
      await screen.findByText(/email already taken/i)
    ).toBeInTheDocument();
  });

  it('falls back to a generic error for non-Axios failures', async () => {
    isAxiosError.mockReturnValue(false);
    post.mockRejectedValue(new Error('boom'));
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await fillStep2();
    await userEvent.click(
      screen.getByRole('button', { name: /create account/i })
    );

    expect(await screen.findByText(/unexpected error/i)).toBeInTheDocument();
  });

  it('treats a non-201 status as an unexpected response', async () => {
    isAxiosError.mockReturnValue(false);
    post.mockResolvedValue({ status: 200 });
    renderPage();
    await fillStep1();
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await fillStep2();
    await userEvent.click(
      screen.getByRole('button', { name: /create account/i })
    );

    expect(await screen.findByText(/unexpected error/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
