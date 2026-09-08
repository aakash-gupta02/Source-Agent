import { StatusCodes } from "http-status-codes";

import { db } from "@repo/db/client";
import { Prisma } from "@repo/db";
import type { AIProvider } from "@repo/db/models";

import type {
  CreateAIProviderInput,
  UpdateAIProviderInput,
} from "@repo/shared/validations";

import type {
  AIProviderDetailDto,
  AIProviderListDto,
} from "@repo/shared/types";

import type { AuthContext } from "../../shared/types/auth.type.js";

import ApiError from "../../shared/utils/ApiError.js";
import { decrypt, encrypt } from "../../shared/utils/encryption/encryption.js";
import { env } from "../../core/config/env.js";

const AIProvider = db.aIProvider;
const currentKeyVersion = env.CURRENT_KEY_VERSION;

const sanitizeAIProvider = (provider: AIProvider): AIProviderListDto => {
  const { credentials, keyVersion, ...providerData } = provider;

  return providerData;
};

// Create AI Provider
export const createAIProviderService = async (
  payload: CreateAIProviderInput,
  userId: AuthContext["userId"],
): Promise<AIProviderListDto> => {
  const existingProvider = await AIProvider.findFirst({
    where: {
      userId,
      name: payload.name,
    },
  });

  if (existingProvider) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "An AI provider with this name already exists.",
    );
  }

  const encryptedCredentials = encrypt(payload.credentials, currentKeyVersion);

  const aiProvider = await AIProvider.create({
    data: {
      name: payload.name,
      provider: payload.provider,
      credentials: encryptedCredentials,
      keyVersion: currentKeyVersion,
      model: payload.model,
      isActive: payload.isActive,
      userId,
    },
  });

  return sanitizeAIProvider(aiProvider);
};

// Update AI Provider
export const updateAIProviderService = async (
  id: string,
  payload: UpdateAIProviderInput,
  userId: AuthContext["userId"],
): Promise<AIProviderListDto> => {
  const existingProvider = await AIProvider.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingProvider) {
    throw new ApiError(StatusCodes.NOT_FOUND, "AI provider not found.");
  }

  const { credentials, ...updatedBody } = payload;

  const data: Prisma.AIProviderUpdateInput = {
    ...updatedBody,
  };

  if (credentials !== undefined) {
    data.credentials = encrypt(credentials, existingProvider.keyVersion);
  }

  const aiProvider = await AIProvider.update({
    where: {
      id,
    },
    data,
  });

  return sanitizeAIProvider(aiProvider);
};

// List AI Providers
export const listAIProvidersService = async (
  userId: AuthContext["userId"],
): Promise<AIProviderListDto[]> => {
  return AIProvider.findMany({
    where: {
      userId,
    },
    omit: {
      credentials: true,
      keyVersion: true,
    },
  });
};

// Get AI Provider
export const getAIProviderService = async (
  id: string,
  userId: AuthContext["userId"],
): Promise<AIProviderDetailDto> => {
  const provider = await AIProvider.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!provider) {
    throw new ApiError(StatusCodes.NOT_FOUND, "AI provider not found.");
  }

  const { credentials, keyVersion, ...providerData } = provider;

  return {
    ...providerData,
    credentials: decrypt(credentials, keyVersion),
  };
};
