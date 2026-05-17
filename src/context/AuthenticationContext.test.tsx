import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthenticationProvider, useAuthentication } from './AuthenticationContext';

// Helper consumer that exposes context state to the DOM and exercises login/logout.
function AuthConsumer() {
  const { isLoggedIn, user, isLoading, login, logout } = useAuthentication();
  return (
    <div>
      <p data-testid="is-logged-in">{String(isLoggedIn)}</p>
      <p data-testid="user">{user ? user.username : 'null'}</p>
      <p data-testid="is-loading">{String(isLoading)}</p>
      <button onClick={() => login('1', 'owner')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Minimal mock of the global fetch API. Each test sets a per-call queue of
// responses so the session-restore call on mount and any logout call can be
// validated independently.
type MockResponse = {
  ok: boolean;
  status: number;
  json?: () => Promise<unknown>;
};

const fetchMock = vi.fn();

function queueResponse(res: MockResponse) {
  fetchMock.mockResolvedValueOnce({
    ok: res.ok,
    status: res.status,
    json: res.json ?? (async () => ({})),
  });
}

describe('AuthenticationContext', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with isLoggedIn=false and user=null when /session returns data:null', async () => {
    // /session is a state-inquiry endpoint: always 200, data is null when
    // there is no valid session.
    queueResponse({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: null }),
    });

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
    queueResponse({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: null }),
    });

    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});

    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
  });

  it('hydrates from /session when the cookie is valid and sets isLoggedIn=true', async () => {
    queueResponse({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'success',
        data: { id: '1', email: 'testuser@example.com', role: 'owner' },
      }),
    });

    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});

    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('testuser@example.com');
  });

  it('login() sets isLoggedIn=true and stores the user in context', async () => {
    queueResponse({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: null }),
    });

    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});

    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('true');
  });

  it('logout() calls the logout endpoint and resets state', async () => {
    // Hydrate logged-in first
    queueResponse({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'success',
        data: { id: '1', email: 'testuser@example.com', role: 'owner' },
      }),
    });
    // Logout call when the user clicks "Logout"
    queueResponse({ ok: true, status: 200 });

    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});

    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
    await act(async () => {});

    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('null');

    // Last call should be the POST to the logout endpoint.
    const lastCall = fetchMock.mock.calls.at(-1);
    expect(lastCall?.[0]).toMatch(/\/api\/auth\/logout$/);
    expect(lastCall?.[1]).toMatchObject({ method: 'POST', credentials: 'include' });
  });

  it('handles a network failure during /session gracefully', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'));

    render(
      <AuthenticationProvider>
        <AuthConsumer />
      </AuthenticationProvider>
    );
    await act(async () => {});

    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
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
