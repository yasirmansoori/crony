import db from "../db/db";
import logger from "./logger";

function setupGracefulShutdown(server: any) {
  // Handle graceful shutdown for SIGTERM and SIGINT
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Close server first to stop accepting new connections
    server.close(() => {
      logger.info("HTTP server closed");

      // Close database connection
      db.disconnect()
        .then(() => {
          logger.info("Database connection closed");
          process.exit(0);
        })
        .catch((err) => {
          logger.error("Error during database disconnection:", err);
          process.exit(1);
        });
    });

    // Force close if it takes too long
    setTimeout(() => {
      logger.error("Forcing shutdown after timeout");
      process.exit(1);
    }, 30000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

export default setupGracefulShutdown;
/**
 * This module sets up graceful shutdown for the application.
 */
