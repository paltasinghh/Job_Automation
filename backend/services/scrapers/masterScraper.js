import { scrapeLinkedIn } from "./linkedinScraper.js";
import { scrapeIndeed } from "./indeedScraper.js";
import { scrapeNaukri } from "./naukriScraper.js";
import { scrapeHirist } from "./hiristScraper.js";

export const scrapeAllJobs = async (filters) => {
  const results = await Promise.allSettled([
    scrapeLinkedIn(filters),
    scrapeIndeed(filters),
    scrapeNaukri(filters),
    scrapeHirist(filters),
  ]);

  return results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value);
};