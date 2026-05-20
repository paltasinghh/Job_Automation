import Job from "../models/Job.js";
import { scrapeAllJobs } from "../services/scrapers/masterScraper.js";
import { saveJobs } from "../services/jobService.js";
import { calculateMatchScore } from "../utils/jobMatcher.js";

export const scrapeJobs = async (req, res) => {
  try {
    let { keyword, location, jobType } = req.query;

    // 🔥 normalize only if provided
    keyword = keyword?.toLowerCase().trim();
    location = location?.toLowerCase().trim();

    console.log("Scraping with filters:", { keyword, location, jobType });

    // 🚀 pass dynamic filters
    const jobs = await scrapeAllJobs({ keyword, location });

    // 🔍 optional filter after scraping
    let filteredJobs = jobs;

    if (jobType) {
      filteredJobs = jobs.filter(
        job => job.jobType === jobType.toLowerCase()
      );
    }

    await saveJobs(filteredJobs);

    res.json({
      message: "Scraping completed",
      totalScraped: jobs.length,
      totalSaved: filteredJobs.length
    });

  } catch (err) {
    console.error("SCRAPER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getJobs = async (req, res) => {
  const { keyword, location, jobType, hours, days } = req.query;

  let query = {};

  if (keyword) {
    query.techStack = { $in: [keyword.toLowerCase()] };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    query.jobType = jobType.toLowerCase();
  }

  // 🔥 time filter
  if (hours) {
    query.postedAt = {
      $gte: new Date(Date.now() - hours * 60 * 60 * 1000)
    };
  }

  if (days) {
    query.postedAt = {
      $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    };
  }

  const jobs = await Job.find(query).sort({ postedAt: -1 });

  res.json(jobs);
};

export const matchJobs = async (req, res) => {
  const { skills, location, jobType } = req.body;

  const userProfile = {
    skills: skills.map(s => s.toLowerCase()),
    location: location?.toLowerCase(),
    jobType: jobType?.toLowerCase()
  };

  const jobs = await Job.find();

  const matchedJobs = jobs.map(job => {
    const match = calculateMatchScore(job, userProfile);

    return {
      ...job.toObject(),
      ...match
    };
  });

  // 🔥 sort by best match
  matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

  res.json(matchedJobs);
};

export const deleteOldJobs = async (req, res) => {
  try {
    const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);

    const result = await Job.deleteMany({
      postedAt: { $lt: seventyTwoHoursAgo }
    });

    console.log(`Cleanup: Deleted ${result.deletedCount} jobs older than 72 hours.`);

    if (res) {
      res.json({
        message: "Cleanup completed",
        deletedCount: result.deletedCount
      });
    }

    return result.deletedCount;
  } catch (err) {
    console.error("DELETE OLD JOBS ERROR:", err);
    if (res) {
      res.status(500).json({ error: err.message });
    }
  }
};