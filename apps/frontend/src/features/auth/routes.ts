/** Where the app lives once a user is authenticated. */
export const APP_ROUTE = "/app";
export const AI_PROVIDERS_ROUTE = `${APP_ROUTE}/ai-providers`;
export const DATABASE_CONNECTIONS_ROUTE = `${APP_ROUTE}/database-connections`;

export const conversationRoute = (id: string) =>
  `${APP_ROUTE}/conversations/${id}`;

export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";

/** Destination after a successful login, register, or Google callback. */
export function postAuthPath(): string {
  return APP_ROUTE;
}
