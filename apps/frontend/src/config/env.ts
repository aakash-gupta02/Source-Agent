/**
 * Typed environment configuration.
 * Prefer importing from here instead of reading `process.env` directly.
 */

function requireEnv(name: keyof NodeJS.ProcessEnv, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  apiUrl: requireEnv(
    "NEXT_PUBLIC_API_URL",
    process.env.NEXT_PUBLIC_API_URL,
  ),
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;

export type Env = typeof env;
