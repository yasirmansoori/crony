import dotenv from "dotenv";
dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
  PORT: process.env.PORT || 8000,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "*",
};

/**
 * Configuration settings for the application.
 */
