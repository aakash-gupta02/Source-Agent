import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import ApiError from "../../shared/utils/ApiError.js";
import { Prisma } from "@repo/db";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const stack = error instanceof Error ? error.stack : undefined;
  const isDev = env.NODE_ENV === "development";

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = isDev ? errorMessage : "Internal Server Error";
  let errors: unknown[] = [];
  let isOperational = false; // Indicates if the error is expected and handled (operational) or an unexpected/unhandled error

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
    isOperational = true;
  } else if (error instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed";
    errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    isOperational = true;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    isOperational = true;

    switch (error.code) {
      case "P2002":
        statusCode = StatusCodes.CONFLICT;
        message = "Duplicate value detected";

        errors =
          (error.meta?.target as string[] | undefined)?.map((field) => ({
            path: field,
            message: `${field} already exists`,
          })) ?? [];
        break;

      case "P2025":
        statusCode = StatusCodes.NOT_FOUND;
        message = "Resource not found";
        break;

      default:
        isOperational = false;
    }
  }

  const logMeta = {
    statusCode,
    method: req.method,
    route: req.originalUrl,
  };

  if (isOperational) {
    logger.warn(`Operational error: ${message}`, logMeta);
  } else {
    logger.error(`Unhandled error: ${errorMessage}`, {
      ...logMeta,
      stack,
      error,
    });
  }

  const responseStatusCode = isOperational
    ? statusCode
    : StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(responseStatusCode).json({
    success: false,
    message,
    ...(errors.length > 0 ? { errors } : {}),
  });
};
