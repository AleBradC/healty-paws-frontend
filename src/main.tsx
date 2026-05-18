import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import { initSentry } from "./lib/observability/sentry";
import "./globals.css";

// Init MUST run before any other module references window/document — Sentry
// patches global event handlers at init time.
initSentry();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/*
      ErrorBoundary catches anything thrown during render that React would
      otherwise unmount. The fallback is intentionally minimal — most
      transient render failures resolve on a hard refresh.
    */}
    <Sentry.ErrorBoundary
      fallback={
        <div style={{ padding: 32, textAlign: "center", fontFamily: "sans-serif" }}>
          <h1>Something went wrong.</h1>
          <p>The page failed to render. Please refresh.</p>
        </div>
      }
    >
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
