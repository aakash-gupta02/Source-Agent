import type { Request, Response } from "express";
import CatchAsync from "../../shared/utils/CatchAsync.js";
import { CreateDatabaseConnectionInput, DBConnectionIdParamsInput, UpdateDatabaseConnectionInput } from "@repo/shared/validations";
import { createDatabaseConnectionService, updateDatabaseConnectionService } from "./connection.service.js";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../shared/utils/ApiResponse.js";

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

export const UpdateDBConnection = CatchAsync(
  async (req: Request, res: Response) => {
    const payload: UpdateDatabaseConnectionInput = req.body;

    const userId = req.user.userId;
    const { id } = req.params as DBConnectionIdParamsInput;

    const databaseConnection = await updateDatabaseConnectionService(id, payload, userId);

    sendResponse(res, StatusCodes.OK, "Database connection updated successfully", databaseConnection);
  },
);