import express from "express";
import { scrapeJobs, getJobs, matchJobs, deleteOldJobs} from "../controllers/jobController.js";

const router = express.Router();

router.get("/scrape", scrapeJobs);
router.get("/jobs", getJobs);
router.post("/match", matchJobs);
router.delete("/jobs/cleanup", deleteOldJobs);

export default router;