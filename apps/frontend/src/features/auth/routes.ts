/** Where the app lives once a user is authenticated. */
export const APP_ROUTE = "/app";

export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";

/** Destination after a successful login, register, or Google callback. */
export function postAuthPath(): string {
  return APP_ROUTE;
}
