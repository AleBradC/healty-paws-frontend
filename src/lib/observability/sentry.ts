import * as Sentry from "@sentry/react";

// Single source of truth for frontend error reporting.
//
// initSentry() runs once from main.tsx before React renders. When
// VITE_SENTRY_DSN is unset (local dev, CI) the SDK is configured with no
// transport and silently drops every event — Sentry.captureException calls
// throughout the app remain safe to call unconditionally.
//
// The DSN is public by design (it's a publishable key, not a secret) so
// embedding it via VITE_* at build time is fine.

let initialised = false;

export const initSentry = (): void => {
  if (initialised) return;
  initialised = true;

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    // Off by default to stay under the free-tier 10k performance events
    // budget. Bump to 0.1 in production once we're sure error volume is sane.
    tracesSampleRate: Number(
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? "0"
    ),
    // No replay until we're confident no sensitive content leaks into the DOM.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
  });
};

export { Sentry };
