import winston from "winston";
import fs from "fs";
import path from "path";

const createJobLogger = (jobName: string) => {
  const dir = path.join("logs", "jobs", jobName);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, "job.log");

  const jobLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
    ),
    transports: [new winston.transports.File({ filename: filePath })],
  });

  return jobLogger;
};

export default createJobLogger;

/**
 * This module exports a function that creates a job logger using Winston.
 * The logger writes logs to a file in a specific directory structure based on the job name.
 * It ensures that the directory exists before creating the logger.
 * The logs are formatted with timestamps and log levels.
 * The logger can be used to log messages related to specific jobs, and the logs are stored in a file named "job.log" within the job's directory.
 **/
