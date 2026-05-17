import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthenticationProvider, useAuthentication } from './AuthenticationContext';

// A helper component that calls useAuthentication and displays state
function AuthConsumer() {
  const { isLoggedIn, user, isLoading, login, logout } = useAuthentication();
  return (
    <div>
      <p data-testid="is-logged-in">{String(isLoggedIn)}</p>
      <p data-testid="user">{user ? user.username : 'null'}</p>
      <p data-testid="is-loading">{String(isLoading)}</p>
      <button onClick={() => login('1', 'owner')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// A minimal valid JWT (header.payload.signature) — payload: {id:"1",username:"testuser",role:"owner"}
const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwicm9sZSI6Im93bmVyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('AuthenticationContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with isLoggedIn=false and user=null when no token is stored', async () => {
    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});
    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });

  it('isLoading becomes false after initialization', async () => {
    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
  });

  it('reads an existing valid token from localStorage and sets isLoggedIn=true', async () => {
    localStorage.setItem('accessToken', VALID_TOKEN);
    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});
    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('testuser');
  });

  it('login() sets isLoggedIn=true and stores the token', async () => {
    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('true');
    expect(localStorage.getItem('accessToken')).toBeTruthy();
  });

  it('logout() clears the token and resets state', async () => {
    localStorage.setItem('accessToken', VALID_TOKEN);
    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('handles an invalid token gracefully', async () => {
    localStorage.setItem('accessToken', 'not-a-valid-jwt');
    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});
    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false');
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('useAuthentication throws when used outside AuthenticationProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function BadConsumer() {
      useAuthentication();
      return null;
    }
    expect(() => render(<BadConsumer />)).toThrow(
      'useAuthentication must be used within an AuthenticationProvider'
    );
    spy.mockRestore();
  });
});
