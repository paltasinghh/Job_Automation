import cron from "node-cron";
import { scrapeAndSaveJobs } from "../backend/services/scraperService.js";

cron.schedule("0 */6 * * *", async () => {
  console.log("Running scraper...");
  await scrapeAndSaveJobs();
});