import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

// Re-export the raw context so we can provide custom values
// We mock the context module
vi.mock('../../../context/AuthenticationContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../context/AuthenticationContext')>();
  return {
    ...actual,
    useAuthentication: vi.fn(),
  };
});

import { useAuthentication } from '../../../context/AuthenticationContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('shows Login button when not logged in and not loading', () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: false,
      user: null,
      isLoading: false,
      logout: vi.fn(),
    });
    renderHeader();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('does not show the Doctors link when user is not an owner', () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: true,
      user: { id: '1', username: 'doc', role: 'doctor' },
      isLoading: false,
      logout: vi.fn(),
    });
    renderHeader();
    expect(screen.queryByRole('link', { name: /doctors/i })).not.toBeInTheDocument();
  });

  it('shows the Doctors link when user role is owner', () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: true,
      user: { id: '2', username: 'owner', role: 'owner' },
      isLoading: false,
      logout: vi.fn(),
    });
    renderHeader();
    expect(screen.getByRole('link', { name: /doctors/i })).toBeInTheDocument();
  });

  it('renders the HealthyPaws logo', () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: false,
      user: null,
      isLoading: false,
      logout: vi.fn(),
    });
    renderHeader();
    expect(screen.getByText('HealthyPaws')).toBeInTheDocument();
  });

  it('shows a loading skeleton when isLoading is true', () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: false,
      user: null,
      isLoading: true,
      logout: vi.fn(),
    });
    const { container } = renderHeader();
    // Loading skeleton is a div, not a button or profile picture
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
    expect(container.querySelector('div[style]')).toBeInTheDocument();
  });
});
