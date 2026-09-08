import type { Request, Response } from "express";
import CatchAsync from "../../shared/utils/CatchAsync.js";
import {
  CreateDatabaseConnectionInput,
  DBConnectionIdParamsInput,
  UpdateDatabaseConnectionInput,
} from "@repo/shared/validations";
import {
  createDatabaseConnectionService,
  getDatabaseConnectionService,
  listDatabaseConnectionsService,
  updateDatabaseConnectionService,
} from "./connection.service.js";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../shared/utils/ApiResponse.js";

// Create a database connection
export const CreateDBConnection = CatchAsync(
  async (req: Request, res: Response) => {
    const payload: CreateDatabaseConnectionInput = req.body;
    const userId = req.user.userId;

    const databaseConnection = await createDatabaseConnectionService(
      payload,
      userId,
    );

    sendResponse(
      res,
      StatusCodes.CREATED,
      "Database connection created successfully",
      databaseConnection,
    );
  },
);

// Update a database connection
export const UpdateDBConnection = CatchAsync(
  async (req: Request, res: Response) => {
    const payload: UpdateDatabaseConnectionInput = req.body;

    const userId = req.user.userId;
    const { id } = req.params as DBConnectionIdParamsInput;

    const databaseConnection = await updateDatabaseConnectionService(
      id,
      payload,
      userId,
    );

    sendResponse(
      res,
      StatusCodes.OK,
      "Database connection updated successfully",
      databaseConnection,
    );
  },
);

// List all database connections
export const ListDBConnections = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const databaseConnections = await listDatabaseConnectionsService(userId);

    sendResponse(
      res,
      StatusCodes.OK,
      "Database connections listed successfully",
      databaseConnections,
    );
  },
);

// Get a database connection
export const GetDBConnection = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as DBConnectionIdParamsInput;
    const userId = req.user.userId;

    const databaseConnection = await getDatabaseConnectionService(id, userId);

    sendResponse(
      res,
      StatusCodes.OK,
      "Database connection retrieved successfully",
      databaseConnection,
    );
  },
);
