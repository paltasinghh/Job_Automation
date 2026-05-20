// services/scrapers/linkedinScraper.js
import { chromium } from "playwright";
import { detectJobType, parsePostedAt, normalizeJob } from "../../utils/jobUtils.js";

export const scrapeLinkedIn = async ({ keyword, location }) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const url = `https://www.linkedin.com/jobs/search/?keywords=${keyword || ""}&location=${location || ""}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);

    const raw = await page.$$eval(
      ".jobs-search__results-list li",
      (cards, keyword) => cards.map(card => ({
        title: card.querySelector("h3")?.innerText || "",
        company: card.querySelector("h4")?.innerText || "",
        location: card.querySelector(".job-search-card__location")?.innerText || "",
        rawText: card.innerText,
        techStack: [keyword],
        applyLink: card.querySelector("a")?.href || "",
        source: "LinkedIn"
      })),
      keyword
    );

    const jobs = raw.map(j => normalizeJob({
      ...j,
      jobType: detectJobType(j.rawText),
      postedAt: parsePostedAt(j.rawText)
    }));

    return jobs;
  } catch (e) {
    console.error("LinkedIn Error:", e);
    return [];
  } finally {
    await browser.close();
  }
};