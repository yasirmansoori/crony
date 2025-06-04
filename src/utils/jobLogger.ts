type JobLogEntry = {
  timestamp: string;
  message: string;
};

type JobMeta = {
  logs: JobLogEntry[];
  lastRun: string | null;
  runCount: number;
};

class JobLogger {
  private jobData: Map<string, JobMeta> = new Map();

  log(jobId: string, message: string) {
    const now = new Date().toISOString();
    const entry: JobLogEntry = { timestamp: now, message };

    if (!this.jobData.has(jobId)) {
      this.jobData.set(jobId, {
        logs: [entry],
        lastRun: now,
        runCount: 1,
      });
    } else {
      const meta = this.jobData.get(jobId)!;
      meta.logs.push(entry);
      meta.lastRun = now;
      meta.runCount += 1;
    }
  }

  getLogs(jobId: string): JobLogEntry[] {
    return this.jobData.get(jobId)?.logs || [];
  }

  getStats(jobId: string) {
    const meta = this.jobData.get(jobId);
    return {
      lastRun: meta?.lastRun || null,
      runCount: meta?.runCount || 0,
    };
  }

  deleteLogs(jobId: string): void {
    this.jobData.delete(jobId);
  }

  clearAll(): void {
    this.jobData.clear();
  }
}

export default new JobLogger();

/**
 * This module provides a simple job logger that tracks logs, last run time, and run count for jobs.
 * It allows logging messages, retrieving logs, getting job statistics, deleting logs for a specific job, and clearing all logs.
 **/
