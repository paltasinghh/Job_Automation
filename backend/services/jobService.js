import Job from "../models/Job.js";

export const saveJobs = async (jobs) => {
  for (let job of jobs) {
    try {
      await Job.create(job);
    } catch {
      // ignore duplicates
    }
  }
};