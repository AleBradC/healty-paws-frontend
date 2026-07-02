import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

import axios from "axios";
import {
  useRequestPasswordReset,
  useResetPasswordWithToken,
} from "./useResetPasswordApi";

const post = axios.post as unknown as ReturnType<typeof vi.fn>;
const isAxiosError = axios.isAxiosError as unknown as ReturnType<typeof vi.fn>;

describe("useRequestPasswordReset", () => {
  beforeEach(() => {
    post.mockReset();
    isAxiosError.mockReset();
  });

  it("starts in an idle state", () => {
    const { result } = renderHook(() => useRequestPasswordReset());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("returns ok on success", async () => {
    post.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useRequestPasswordReset());

    let outcome: { ok: boolean } | undefined;
    await act(async () => {
      outcome = await result.current.submit("jane@example.com");
    });

    expect(outcome).toEqual({ ok: true });
    expect(post).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/reset-password/request"),
      { email: "jane@example.com" },
    );
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("surfaces server-provided error messages", async () => {
    isAxiosError.mockReturnValue(true);
    post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 500, data: { message: "Boom" } },
    });
    const { result } = renderHook(() => useRequestPasswordReset());

    let outcome: { ok: boolean } | undefined;
    await act(async () => {
      outcome = await result.current.submit("jane@example.com");
    });

    expect(outcome).toEqual({ ok: false });
    expect(result.current.error).toBe("Boom");
  });

  it("falls back to a generic message when the error is not an Axios error", async () => {
    isAxiosError.mockReturnValue(false);
    post.mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useRequestPasswordReset());

    await act(async () => {
      await result.current.submit("jane@example.com");
    });

    expect(result.current.error).toMatch(/unexpected/i);
  });

  it("falls back to a generic message when Axios error has no body message", async () => {
    isAxiosError.mockReturnValue(true);
    post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 500, data: {} },
    });
    const { result } = renderHook(() => useRequestPasswordReset());

    await act(async () => {
      await result.current.submit("jane@example.com");
    });

    expect(result.current.error).toMatch(/unexpected/i);
  });

  it("clears the error via clearError()", async () => {
    isAxiosError.mockReturnValue(false);
    post.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useRequestPasswordReset());

    await act(async () => {
      await result.current.submit("jane@example.com");
    });
    expect(result.current.error).toBeDefined();

    act(() => result.current.clearError());
    expect(result.current.error).toBeUndefined();
  });
});

describe("useResetPasswordWithToken", () => {
  beforeEach(() => {
    post.mockReset();
    isAxiosError.mockReset();
  });

  it("returns ok and posts the token + new password on success", async () => {
    post.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useResetPasswordWithToken());

    let outcome: { ok: boolean } | undefined;
    await act(async () => {
      outcome = await result.current.submit("tok-123", "NewPass1!");
    });

    expect(outcome).toEqual({ ok: true });
    expect(post).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/reset-password/reset"),
      { token: "tok-123", newPassword: "NewPass1!" },
    );
    expect(result.current.isTokenInvalid).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("flags isTokenInvalid on a 400 response", async () => {
    isAxiosError.mockReturnValue(true);
    post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 400, data: { message: "INVALID_RESET_TOKEN" } },
    });
    const { result } = renderHook(() => useResetPasswordWithToken());

    let outcome: { ok: boolean } | undefined;
    await act(async () => {
      outcome = await result.current.submit("expired", "NewPass1!");
    });

    expect(outcome).toEqual({ ok: false });
    expect(result.current.isTokenInvalid).toBe(true);
    expect(result.current.error).toBeUndefined();
  });

  it("exposes the server error message on non-400 errors", async () => {
    isAxiosError.mockReturnValue(true);
    post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 500, data: { message: "Server exploded" } },
    });
    const { result } = renderHook(() => useResetPasswordWithToken());

    await act(async () => {
      await result.current.submit("tok", "NewPass1!");
    });

    expect(result.current.isTokenInvalid).toBe(false);
    expect(result.current.error).toBe("Server exploded");
  });

  it("falls back to the generic message on non-Axios errors", async () => {
    isAxiosError.mockReturnValue(false);
    post.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useResetPasswordWithToken());

    await act(async () => {
      await result.current.submit("tok", "NewPass1!");
    });

    expect(result.current.error).toMatch(/unexpected/i);
  });

  it("resets isTokenInvalid on a subsequent successful submit", async () => {
    isAxiosError.mockReturnValue(true);
    post.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 400, data: {} },
    });
    const { result } = renderHook(() => useResetPasswordWithToken());

    await act(async () => {
      await result.current.submit("expired", "NewPass1!");
    });
    expect(result.current.isTokenInvalid).toBe(true);

    post.mockResolvedValueOnce({ data: {} });
    await act(async () => {
      await result.current.submit("fresh", "NewPass1!");
    });
    expect(result.current.isTokenInvalid).toBe(false);
  });

  it("clears the error via clearError()", async () => {
    isAxiosError.mockReturnValue(true);
    post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 500, data: { message: "Boom" } },
    });
    const { result } = renderHook(() => useResetPasswordWithToken());

    await act(async () => {
      await result.current.submit("tok", "NewPass1!");
    });
    expect(result.current.error).toBe("Boom");

    act(() => result.current.clearError());
    expect(result.current.error).toBeUndefined();
  });
});
