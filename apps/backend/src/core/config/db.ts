import { db } from "@repo/db/client";
import { logger } from "./logger.js";

export const connectDB = async (): Promise<void> => {
  try {
    await db.$connect();

    logger.info("✅ PostgreSQL connected successfully");
  } catch (error) {
    logger.error("❌ Failed to connect to PostgreSQL", error);

    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await db.$disconnect();

    logger.info("⚠️ PostgreSQL disconnected");
  } catch (error) {
    logger.error("Failed to disconnect PostgreSQL", error);
  }
};
