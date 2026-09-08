import ApiError from "../../shared/utils/ApiError.js";
import {
  CreateDatabaseConnectionInput,
  UpdateDatabaseConnectionInput,
} from "@repo/shared/validations";
import { db } from "@repo/db/client";
import { DatabaseConnectionType } from "@repo/db/enums";
import { decrypt, encrypt } from "../../shared/utils/encryption/encryption.js";
import { env } from "../../core/config/env.js";
import { AuthContext } from "../../shared/types/auth.type.js";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@repo/db";
import {
  DatabaseConnectionDetailDto,
  DatabaseConnectionListDto,
} from "@repo/shared/types";
import { DatabaseConnection } from "@repo/db/models";

const DatabaseConnection = db.databaseConnection;
const currentKeyVersion = env.CURRENT_KEY_VERSION;

const buildCredentials = (payload: CreateDatabaseConnectionInput) => {
  if (payload.connectionType === DatabaseConnectionType.URL) {
    return {
      url: payload.url,
    };
  }

  return {
    host: payload.host,
    port: payload.port,
    database: payload.database,
    username: payload.username,
    password: payload.password,
  };
};

const sanitizeDatabaseConnection = (
  connection: DatabaseConnection,
): DatabaseConnectionListDto => {
  const { credentials, keyVersion, ...connectionData } = connection;

  return connectionData;
};

// Create DB Connection
export const createDatabaseConnectionService = async (
  payload: CreateDatabaseConnectionInput,
  userId: AuthContext["userId"],
): Promise<DatabaseConnectionListDto> => {
  const existingConnection = await DatabaseConnection.findFirst({
    where: {
      userId,
      name: payload.name,
    },
  });

  if (existingConnection) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "A database connection with this name already exists.",
    );
  }

  const credentials = buildCredentials(payload);

  const encryptedCredentials = encrypt(
    JSON.stringify(credentials),
    currentKeyVersion,
  );

  const databaseConnection = await DatabaseConnection.create({
    data: {
      name: payload.name,
      connectionType: payload.connectionType,
      credentials: encryptedCredentials,
      keyVersion: currentKeyVersion,
      userId,
      ssl: payload.ssl,
    },
  });

  return sanitizeDatabaseConnection(databaseConnection);
};

// Update DB Connection
export const updateDatabaseConnectionService = async (
  id: string,
  payload: UpdateDatabaseConnectionInput,
  userId: AuthContext["userId"],
): Promise<DatabaseConnectionListDto> => {
  const existingConnection = await DatabaseConnection.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingConnection) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Database connection not found.");
  }

  const updatedBody: Prisma.DatabaseConnectionUpdateInput = {};

  if (payload.name !== undefined) {
    updatedBody.name = payload.name;
  }

  if (payload.ssl !== undefined) {
    updatedBody.ssl = payload.ssl;
  }

  if (payload.isActive !== undefined) {
    updatedBody.isActive = payload.isActive;
  }

  const hasFieldCredentialUpdate =
    payload.host !== undefined ||
    payload.port !== undefined ||
    payload.database !== undefined ||
    payload.username !== undefined ||
    payload.password !== undefined;

  if (existingConnection.connectionType === DatabaseConnectionType.URL) {
    if (hasFieldCredentialUpdate) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Credential fields are not allowed for URL connections.",
      );
    }

    if (payload.url !== undefined) {
      const existingCredentials = JSON.parse(
        decrypt(existingConnection.credentials, existingConnection.keyVersion),
      ) as { url: string };

      const credentials = {
        ...existingCredentials,
        url: payload.url,
      };

      updatedBody.credentials = encrypt(
        JSON.stringify(credentials),
        existingConnection.keyVersion,
      );
    }
  }

  if (existingConnection.connectionType === DatabaseConnectionType.FIELDS) {
    if (hasFieldCredentialUpdate) {
      const existingCredentials = JSON.parse(
        decrypt(existingConnection.credentials, existingConnection.keyVersion),
      ) as {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
      };

      const credentials = {
        ...existingCredentials,
        ...(payload.host !== undefined && {
          host: payload.host,
        }),
        ...(payload.port !== undefined && {
          port: payload.port,
        }),
        ...(payload.database !== undefined && {
          database: payload.database,
        }),
        ...(payload.username !== undefined && {
          username: payload.username,
        }),
        ...(payload.password !== undefined && {
          password: payload.password,
        }),
      };

      updatedBody.credentials = encrypt(
        JSON.stringify(credentials),
        existingConnection.keyVersion,
      );
    }
  }

  const databaseConnection = await DatabaseConnection.update({
    where: {
      id,
    },
    data: updatedBody,
  });

  return sanitizeDatabaseConnection(databaseConnection);
};

// List DB Connections
export const listDatabaseConnectionsService = async (
  userId: AuthContext["userId"],
): Promise<DatabaseConnectionListDto[]> => {
  return DatabaseConnection.findMany({
    where: {
      userId,
    },
    omit: {
      credentials: true,
      keyVersion: true,
    },
  });
};

// Get DB Connection
export const getDatabaseConnectionService = async (
  id: string,
  userId: AuthContext["userId"],
): Promise<DatabaseConnectionDetailDto> => {
  const connection = await DatabaseConnection.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!connection) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Database connection not found.");
  }

  const { credentials, keyVersion, ...connectionData } = connection;

  return {
    ...connectionData,
    credentials: JSON.parse(decrypt(credentials, keyVersion)),
  };
};
