export type UrlDatabaseCredentials = {
  url: string;
};

export type FieldsDatabaseCredentials = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

export type DatabaseCredentials =
  | UrlDatabaseCredentials
  | FieldsDatabaseCredentials;

export const buildPostgresConnectionString = (
  credentials: DatabaseCredentials,
): string => {
  if ("url" in credentials) {
    return credentials.url;
  }

  return `postgresql://${encodeURIComponent(credentials.username)}:${encodeURIComponent(credentials.password)}@${credentials.host}:${credentials.port}/${credentials.database}`;
};
