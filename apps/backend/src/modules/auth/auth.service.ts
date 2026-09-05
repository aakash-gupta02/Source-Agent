import { StatusCodes } from "http-status-codes";

import ApiError from "../../shared/utils/ApiError.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../../shared/utils/Token.js";
import type { LoginInput, RegisterInput } from "@repo/shared/validations";
import bcrypt from "bcrypt";
import { db } from "@repo/db/client";
import { AuthProvider, UserRole } from "@repo/db";
import { AuthResponseDto, AuthUserDto } from "@repo/shared/types";

const sanitizeUser = (user: {
  id: { toString: () => string };
  email: string;
  role: UserRole;
}): AuthUserDto => ({
  id: user.id.toString(),
  email: user.email,
  role: user.role,
});

const User = db.user;

// Register a new user with email and password
export const registerService = async (payload: RegisterInput): Promise<AuthResponseDto> => {
  const existing = await User.findUnique({ where: { email: payload.email } });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    data: {
      ...payload,
      password: hashedPassword,
      provider: AuthProvider.LOCAL,
    },
  });

  const accessToken = createAccessToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  });

  const refreshToken = createRefreshToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
    type: "refresh",
  });

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await User.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefreshToken },
  });

  return { accessToken, refreshToken, user: sanitizeUser(user) };
};

// Login user with email and password
export const loginService = async (payload: LoginInput): Promise<AuthResponseDto> => {
  const user = await User.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Email or password");
  }

  const isValid = await bcrypt.compare(payload.password, user.password!);

  if (!isValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or Password");
  }

  const accessToken = createAccessToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  });

  const refreshToken = createRefreshToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
    type: "refresh",
  });

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await User.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefreshToken },
  });

  return { accessToken, refreshToken, user: sanitizeUser(user) };
};

// Get current user profile
export const meService = async (userId: string): Promise<AuthUserDto> => {
  const user = await User.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return sanitizeUser(user);
};

// Logout the user by clearing the authentication cookie
export const logoutService = async (userId: string): Promise<void> => {
  const user = await User.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
};

// Refresh access token using refresh token
export const refreshTokensService = async (
  userId: string,
  refreshToken: string,
): Promise<{ accessToken: string }> => {
  const user = await User.findUnique({
    where: {
      id: userId,
    },
    select: {
      refreshToken: true,
      email: true,
      role: true,
      id: true,
    },
  });

  if (!user || !user.refreshToken) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "User not found or not logged in",
    );
  }

  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

  if (!isValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const newAccessToken = createAccessToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  });

  return { accessToken: newAccessToken };
};
