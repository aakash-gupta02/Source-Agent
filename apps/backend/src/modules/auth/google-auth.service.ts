import { StatusCodes } from "http-status-codes";

import ApiError from "../../shared/utils/ApiError.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../../shared/utils/Token.js";
import bcrypt from "bcrypt";
import { db } from "@repo/db/client";
import { AuthProvider, Prisma } from "@repo/db";
import { env } from "../../core/config/env.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI,
);

const User = db.user;

const getGoogleUserInfo = async (code: string) => {
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token as string,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Google token payload");
  }

  return {
    email: payload.email,
    picture: payload.picture,
    sub: payload.sub,
    isEmailVerified: payload.email_verified || false,
    name: payload.name || "unknown",
  };
};

export const googleCallbackService = async (
  code: string,
  state: string,
  storedState: string,
) => {
  if (state !== storedState) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid state parameter");
  }

  const { email, sub, name } = await getGoogleUserInfo(code);

  let user = await User.findFirst({
    where: {
      providerId: sub,
      email,
    },
  });

  if (!user) {
    user = await User.create({
      data: {
        email,
        name,
        provider: AuthProvider.GOOGLE,
        providerId: sub,
      },
    });
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

  const updateData: Prisma.UserUpdateInput = {
    refreshToken: hashedRefreshToken,
  };

  if (!user.providerId) {
    updateData.provider = AuthProvider.GOOGLE;
    updateData.providerId = sub;
  }

  await User.update({
    where: { id: user.id },
    data: updateData,
  });

  const redirectUrl = "/";
  return { accessToken, refreshToken, redirectUrl };
};
