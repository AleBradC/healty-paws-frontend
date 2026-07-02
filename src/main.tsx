import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import { initSentry } from "./lib/observability/sentry";
import "./globals.css";

initSentry();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {}
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
