import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import {
  notFoundMiddleware,
  defaultErrorHandler,
} from "./middlewares/errorHandler";
import ROUTES from "./config/routes";
import { config } from "./config";
import logger from "./utils/logger";
import jobService from "./services/job.service";
import jobRouter from "./routes/job.routes";
import connectWithRetry from "./utils/connectToDb";
import setupGracefulShutdown from "./utils/shutdown";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection:", reason);
});

let server: any;

async function init() {
  try {
    const PORT = config.PORT;
    const CONNECTION_STRING = `${config.MONGODB_URI}`;
    const isProduction = process.env.NODE_ENV === "production";
    const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

    // Connect to database
    await connectWithRetry(CONNECTION_STRING);

    // Load active jobs from the database
    await jobService.loadActiveJobs();

    const app = express();

    // Security middleware
    app.use(helmet());

    // Compression middleware
    app.use(compression());

    // Configure CORS
    app.use(
      cors({
        origin: isProduction ? config.ALLOWED_ORIGINS || "*" : "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use(limiter);

    // Body parsers
    app.use(express.json({ limit: "5mb" }));
    app.use(express.urlencoded({ extended: true, limit: "5mb" }));

    // Configure logging
    if (isProduction) {
      app.use(
        morgan("combined", {
          stream: { write: (message) => logger.info(message.trim()) },
          skip: (req, res) => res.statusCode < 400,
        })
      );
    } else {
      app.use(
        morgan("dev", {
          stream: { write: (message) => logger.info(message.trim()) },
        })
      );
    }

    // Swagger documentation
    app.use(ROUTES.DOCS.v1, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Health check endpoint
    app.get(ROUTES.HEALTH, (req: express.Request, res: express.Response) => {
      res.json({
        message: "I'm alive!",
        timestamp: new Date().toISOString(),
        status: "OK",
      });
    });

    // Job routes
    app.use(ROUTES.JOBS.BASE, jobRouter);

    // 404 Not Found middleware
    app.use(notFoundMiddleware);

    // Default error handler
    app.use(defaultErrorHandler);

    // Start Express server
    server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    setupGracefulShutdown(server);
  } catch (error) {
    logger.error("Failed to initialize the server:", error);
    process.exit(1);
  }
}

// Start the application
init().catch((error) => {
  logger.error("Unhandled error during initialization:", error);
  process.exit(1);
});
