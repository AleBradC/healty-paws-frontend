import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';

vi.mock('../../context/AuthenticationContext', () => ({
  useAuthentication: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { useAuthentication } from '../../context/AuthenticationContext';

function renderPublic() {
  return render(
    <MemoryRouter>
      <PublicRoute>
        <p>Public Content</p>
      </PublicRoute>
    </MemoryRouter>
  );
}

describe('PublicRoute', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders children when user is not logged in', async () => {
    (useAuthentication as any).mockReturnValue({ isLoggedIn: false });
    renderPublic();
    await act(async () => {});
    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  it('navigates to home when user is already logged in', async () => {
    (useAuthentication as any).mockReturnValue({ isLoggedIn: true });
    renderPublic();
    await act(async () => {});
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders the outlet child when used as a layout route and user is logged out', async () => {
    (useAuthentication as any).mockReturnValue({ isLoggedIn: false });
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/auth/login" element={<p>Public Content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    await act(async () => {});
    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });
});
