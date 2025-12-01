import React from "react";

export const Eye = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const EyeOff = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M2 12s3.5-6 10-6c2.2 0 4.1.7 5.7 1.7M22 12s-3.5 6-10 6c-2.2 0-4.1-.7-5.7-1.7"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M9.9 9.9A3 3 0 0012 15a3 3 0 002.1-.9"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);
