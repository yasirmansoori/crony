import express from "express";
import jobController from "../controller/job.controller";
import validate from "../middlewares/validate";
import { createJobSchema } from "../validators/job.validator";
import ROUTES from "../config/routes";

const jobRouter = express.Router();

// Job routes
jobRouter.post(
  ROUTES.JOBS.CREATE,
  validate(createJobSchema),
  jobController.createJob
);
jobRouter.post(ROUTES.JOBS.START, jobController.startJob);
jobRouter.post(ROUTES.JOBS.STOP, jobController.stopJob);
jobRouter.get(ROUTES.JOBS.LIST, jobController.listJobs);
jobRouter.get(ROUTES.JOBS.GET_LOGS, jobController.getJobLogs);
jobRouter.get(ROUTES.JOBS.STATS, jobController.getJobStats);

export default jobRouter;

/**
 * Job routes for managing scheduled jobs.
 */
