import db from "../db/db";
import logger from "./logger";

async function connectWithRetry(
  connectionString: string,
  retries = 5,
  delay = 5000
): Promise<void> {
  try {
    await db.connect(connectionString);
    logger.info("Database connected successfully.");
  } catch (error) {
    if (retries === 0) {
      logger.error(
        "Maximum retries reached. Failed to connect to database:",
        error
      );
      throw error;
    }

    logger.warn(
      `Failed to connect to database. Retrying in ${
        delay / 1000
      } seconds... (${retries} attempts left)`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return connectWithRetry(connectionString, retries - 1, delay);
  }
}

export default connectWithRetry;

/**
 * This function attempts to connect to the database with retries.
 */
