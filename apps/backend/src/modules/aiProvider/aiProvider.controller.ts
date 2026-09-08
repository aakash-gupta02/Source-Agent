import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  AIProviderIdParamsInput,
  CreateAIProviderInput,
  UpdateAIProviderInput,
} from "@repo/shared/validations";
import {
  createAIProviderService,
  updateAIProviderService,
  listAIProvidersService,
  getAIProviderService,
} from "./aiProvider.service.js";
import CatchAsync from "../../shared/utils/CatchAsync.js";
import sendResponse from "../../shared/utils/ApiResponse.js";

// Create AI Provider
export const createAiProvider = CatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const payload: CreateAIProviderInput = req.body;

    const aiProvider = await createAIProviderService(payload, userId);

    sendResponse(
      res,
      StatusCodes.CREATED,
      "AI provider created successfully",
      aiProvider,
    );
  },
);

// Update AI Provider
export const updateAiProvider = CatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { id } = req.params as AIProviderIdParamsInput;
    const payload: UpdateAIProviderInput = req.body;
    const aiProvider = await updateAIProviderService(id, payload, userId);
    sendResponse(
      res,
      StatusCodes.OK,
      "AI provider updated successfully",
      aiProvider,
    );
  },
);

// List AI Providers
export const listAiProviders = CatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;

    const aiProviders = await listAIProvidersService(userId);

    sendResponse(
      res,
      StatusCodes.OK,
      "AI providers listed successfully",
      aiProviders,
    );
  },
);

// Get AI Provider
export const getAiProvider = CatchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id } = req.params as AIProviderIdParamsInput;

  const aiProvider = await getAIProviderService(id, userId);

  sendResponse(
    res,
    StatusCodes.OK,
    "AI provider fetched successfully",
    aiProvider,
  );
});
