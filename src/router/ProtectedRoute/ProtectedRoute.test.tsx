import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

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

function renderProtected(allowedRoles?: string[]) {
  return render(
    <MemoryRouter>
      <ProtectedRoute allowedRoles={allowedRoles}>
        <p>Protected Content</p>
      </ProtectedRoute>
    </MemoryRouter>
  );
}

// Renders ProtectedRoute as a layout (no children prop) wrapping a real
// child route. Exercises the <Outlet/> branch used by App.tsx.
function renderProtectedLayout(allowedRoles?: string[]) {
  return render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
          <Route path="/secret" element={<p>Protected Content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders children when user is logged in with matching role', async () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: true,
      user: { id: '1', username: 'doc', role: 'doctor' },
    });
    renderProtected(['doctor']);
    await act(async () => {});
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('navigates to home when user is not logged in', async () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: false,
      user: null,
    });
    renderProtected(['doctor']);
    await act(async () => {});
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to home when user role is not in allowedRoles', async () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: true,
      user: { id: '2', username: 'owner', role: 'owner' },
    });
    renderProtected(['doctor']);
    await act(async () => {});
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders children when allowedRoles is not provided (any logged-in user)', async () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: true,
      user: { id: '3', username: 'anyone', role: 'owner' },
    });
    renderProtected();
    await act(async () => {});
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders the outlet child when used as a layout route and user is authorized', async () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: true,
      user: { id: '4', username: 'doc', role: 'doctor' },
    });
    renderProtectedLayout(['doctor']);
    await act(async () => {});
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('blocks the outlet child when used as a layout route and user lacks role', async () => {
    (useAuthentication as any).mockReturnValue({
      isLoggedIn: true,
      user: { id: '5', username: 'owner', role: 'owner' },
    });
    renderProtectedLayout(['doctor']);
    await act(async () => {});
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
