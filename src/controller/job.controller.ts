import { NextFunction } from "express";
import jobService from "../services/job.service";
import jobLogger from "../utils/jobLogger";
import JobModel from "../models/job.model";

interface JobController {
  createJob: (req: any, res: any, next: NextFunction) => Promise<void>;
  startJob: (req: any, res: any, next: NextFunction) => Promise<void>;
  stopJob: (req: any, res: any, next: NextFunction) => Promise<void>;
  listJobs: (req: any, res: any, next: NextFunction) => Promise<void>;
  getJobLogs: (req: any, res: any, next: NextFunction) => Promise<void>;
  getJobStats: (req: any, res: any, next: NextFunction) => Promise<void>;
}

const jobController: JobController = {
  createJob: async (req, res, next) => {
    try {
      const job = await jobService.createJob(req.body);

      const payload = {
        message: "Job created successfully",
        data: {
          id: job._id,
          name: job.name,
          schedule: job.schedule,
          message: job.message,
          isActive: job.isActive,
        },
      };

      res.status(201).json(payload);
    } catch (err) {
      next(err);
    }
  },
  startJob: async (req, res, next) => {
    try {
      const job = await jobService.startJob(req.params.id);

      const payload = {
        message: "Job started successfully",
        data: {
          id: job._id,
          name: job.name,
          schedule: job.schedule,
          message: job.message,
          isActive: job.isActive,
        },
      };
      res.status(200).json(payload);
    } catch (err) {
      next(err);
    }
  },
  stopJob: async (req, res, next) => {
    try {
      const job = await jobService.stopJob(req.params.id);

      const payload = {
        message: "Job stopped successfully",
        data: {
          id: job._id,
          name: job.name,
          schedule: job.schedule,
          message: job.message,
          isActive: job.isActive,
        },
      };

      res.status(200).json(payload);
    } catch (err) {
      next(err);
    }
  },
  listJobs: async (_, res, next) => {
    try {
      const jobs = await jobService.listJobs();

      const payload = {
        message: "Jobs retrieved successfully",
        data: jobs.map((job) => ({
          id: job._id,
          name: job.name,
          schedule: job.schedule,
          message: job.message,
          isActive: job.isActive,
        })),
        attributes: {
          count: jobs.length,
          activeCount: jobs.filter((job) => job.isActive).length,
          inactiveCount: jobs.filter((job) => !job.isActive).length,
        },
      };

      res.status(200).json(payload);
    } catch (err) {
      next(err);
    }
  },
  getJobLogs: async (req, res, next) => {
    try {
      const logs = jobLogger.getLogs(req.params.id);

      if (logs.length === 0) {
        return res.status(404).json({
          message: "No logs found for this job",
          data: [],
        });
      }

      const job = await JobModel.findById(req.params.id);
      if (!job) {
        return res.status(404).json({
          message: "Job not found",
          data: null,
        });
      }

      const payload = {
        message: "Job logs retrieved successfully",
        data: {
          job: {
            id: job._id,
            name: job.name,
            schedule: job.schedule,
            message: job.message,
            isActive: job.isActive,
          },
          logs,
        },
      };

      res.status(200).json(payload);
    } catch (err) {
      next(err);
    }
  },
  getJobStats: async (req, res, next) => {
    try {
      const jobId = req.params.id;
      const job = await jobService.getJobById(jobId);

      const { lastRun, runCount } = jobLogger.getStats(jobId);
      const isRunning = jobService.isJobRunning(jobId);

      const nextRun = job.isActive
        ? "Next based on schedule: " + job.schedule
        : null;

      const payload = {
        message: "Job statistics retrieved successfully",
        data: {
          job: {
            id: job._id,
            name: job.name,
            schedule: job.schedule,
            message: job.message,
            isActive: job.isActive,
          },
          stats: {
            lastRun,
            runCount,
            isRunning,
            nextRun,
          },
        },
      };

      res.status(200).json(payload);
    } catch (err) {
      next(err);
    }
  },
};

export default jobController;

/**
 * Job controller for managing scheduled jobs.
 */
