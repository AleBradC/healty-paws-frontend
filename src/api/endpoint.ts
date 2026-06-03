// Empty default → relative URLs that resolve against the current origin via
// the gateway (healthy-paws-wrapper). Override with VITE_API_BASE_URL only
// when the dev frontend is talking directly to a backend on a different origin.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";

export const registerOwnerEndpoint = "/api/auth/register/owner";
export const registerDoctorEndpoint = "/api/auth/register/doctor";
export const loginEndpoint = "/api/auth/login";
export const logoutEndpoint = "/api/auth/logout";
export const sessionEndpoint = "/api/auth/session";
export const forgotPasswordEndpoint = "/api/auth/reset-password/request";
export const resetPasswordEndpoint = "/api/auth/reset-password/reset";
export const resendVerificationEndpoint = "/api/auth/resend-verification";
export const graphqlEndpoint = "/graphql";
