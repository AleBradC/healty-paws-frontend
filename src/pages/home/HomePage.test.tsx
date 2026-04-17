import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

vi.mock('../../context/AuthenticationContext', () => ({
  useAuthentication: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

import { useAuthentication } from '../../context/AuthenticationContext';

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe('HomePage', () => {
  it('always renders the testimonials section', async () => {
    (useAuthentication as any).mockReturnValue({ isLoggedIn: false, isLoading: false });
    renderHomePage();
    await act(async () => {});
    expect(screen.getByText(/what our community says/i)).toBeInTheDocument();
  });

  it('renders all 3 testimonials', async () => {
    (useAuthentication as any).mockReturnValue({ isLoggedIn: false, isLoading: false });
    renderHomePage();
    await act(async () => {});
    expect(screen.getByText(/booking a visit for luna/i)).toBeInTheDocument();
    expect(screen.getByText(/seamless scheduling/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7 support/i)).toBeInTheDocument();
  });

  it('shows the CTA buttons when the user is not logged in after mount', async () => {
    (useAuthentication as any).mockReturnValue({ isLoggedIn: false, isLoading: false });
    renderHomePage();
    await act(async () => {});
    expect(screen.getByRole('button', { name: /join as a pet parent/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register as doctor/i })).toBeInTheDocument();
  });

  it('hides CTA buttons while still loading auth state', () => {
    (useAuthentication as any).mockReturnValue({ isLoggedIn: false, isLoading: true });
    renderHomePage();
    expect(screen.queryByRole('button', { name: /join as a pet parent/i })).not.toBeInTheDocument();
  });

  it('hides CTA buttons when the user is logged in', async () => {
    (useAuthentication as any).mockReturnValue({ isLoggedIn: true, isLoading: false });
    renderHomePage();
    await act(async () => {});
    expect(screen.queryByRole('button', { name: /join as a pet parent/i })).not.toBeInTheDocument();
  });

  it('renders the hero title', async () => {
    (useAuthentication as any).mockReturnValue({ isLoggedIn: false, isLoading: false });
    renderHomePage();
    await act(async () => {});
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
