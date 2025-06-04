import cron, { ScheduledTask } from "node-cron";
import JobModel, { IJob } from "../models/job.model";
import logger from "../utils/logger";
import jobLogger from "../utils/jobLogger";
import createHttpError from "http-errors";
import winston from "winston";
import createJobLogger from "../utils/createJobLogger";

class JobService {
  private jobMap: Map<string, ScheduledTask>;
  private jobLoggers: Map<string, winston.Logger>;

  constructor() {
    this.jobMap = new Map();
    this.jobLoggers = new Map();
  }

  private getJobLogger(jobName: string): winston.Logger {
    if (!this.jobLoggers.has(jobName)) {
      const newLogger = createJobLogger(jobName);
      this.jobLoggers.set(jobName, newLogger);
    }
    return this.jobLoggers.get(jobName)!;
  }

  async createJob(data: Omit<IJob, "isActive">) {
    if (!cron.validate(data.schedule)) {
      throw new Error("Invalid cron schedule expression");
    }

    const existingJob = await JobModel.findOne({ name: data.name });
    if (existingJob) {
      throw createHttpError(409, "Job with this name already exists");
    }

    const job = new JobModel({ ...data, isActive: false });
    await job.save();

    logger.info(`Job created: ${job.name}`);
    return job;
  }

  async startJob(jobId: string) {
    const job = await JobModel.findById(jobId);
    if (!job) throw createHttpError(404, "Job not found");
    if (this.jobMap.has(jobId))
      throw createHttpError(409, "Job is already running");

    const task = cron.schedule(job.schedule, () => {
      const logMsg = `[${job.name}] ${job.message}`;
      logger.info(logMsg);
      jobLogger.log(jobId, job.message);

      // Log to job-specific file
      const jobSpecificLogger = this.getJobLogger(job.name);
      jobSpecificLogger.info(job.message);
    });

    task.start();
    this.jobMap.set(jobId, task);

    job.isActive = true;
    await job.save();

    logger.info(`Job started: ${job.name}`);
    return job;
  }

  async stopJob(jobId: string) {
    const task = this.jobMap.get(jobId);
    if (!task) throw createHttpError(404, "Job not found or not running");

    task.stop();
    this.jobMap.delete(jobId);

    const job = await JobModel.findByIdAndUpdate(
      jobId,
      { isActive: false },
      { new: true }
    );
    if (!job) throw createHttpError(404, "Job not found");

    logger.info(`Job stopped: ${job.name}`);
    return job;
  }

  async listJobs() {
    const jobs = await JobModel.find();
    if (!jobs || jobs.length === 0) {
      logger.info("No jobs found");
      return [];
    }

    logger.info(`Found ${jobs.length} jobs`);
    return jobs;
  }

  async loadActiveJobs() {
    const activeJobs = await JobModel.find({ isActive: true });

    for (const job of activeJobs) {
      try {
        const task = cron.schedule(job.schedule, () => {
          const logMsg = `[${job.name}] ${job.message}`;
          logger.info(logMsg);
          jobLogger.log(job._id.toString(), job.message);

          // Log to job-specific file
          const jobSpecificLogger = this.getJobLogger(job.name);
          jobSpecificLogger.info(job.message);
        });

        task.start();
        this.jobMap.set(job._id.toString(), task);
        logger.info(`Loaded active job: ${job.name}`);
      } catch (err) {
        logger.error(
          `Failed to load job ${job.name}: ${(err as Error).message}`
        );
      }
    }
  }

  isJobRunning(jobId: string) {
    return this.jobMap.has(jobId);
  }

  async getJobById(jobId: string) {
    const job = await JobModel.findById(jobId);
    if (!job) throw createHttpError(404, "Job not found");
    return job;
  }
}

export default new JobService();

/**
 * JobService class provides methods to manage scheduled jobs using node-cron.
 */
