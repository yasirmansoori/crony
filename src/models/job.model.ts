import mongoose, { Schema } from "mongoose";

export interface IJob {
  name: string;
  isActive: boolean;
  schedule: string; // Cron expression (e.g., "0 0 * * *" for daily at midnight)
  message: string; // Message to be sent
}

const jobSchema = new Schema<IJob>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: false },
    schedule: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const JobModel = mongoose.model<IJob>("Job", jobSchema);

export default JobModel;

/**
 * Job model for managing scheduled jobs in the application.
 */
