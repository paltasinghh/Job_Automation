// services/scrapers/indeedScraper.js
import { chromium } from "playwright";
import { detectJobType, parsePostedAt, normalizeJob } from "../../utils/jobUtils.js";

export const scrapeIndeed = async ({ keyword, location }) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url = `https://in.indeed.com/jobs?q=${keyword || ""}&l=${location || ""}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(6000);

    const raw = await page.$$eval(
      ".job_seen_beacon",
      (cards, keyword) => cards.map(card => ({
        title: card.querySelector("h2 a")?.innerText || "",
        company: card.querySelector(".companyName")?.innerText || "",
        location: card.querySelector(".companyLocation")?.innerText || "",
        rawText: card.innerText,
        techStack: [keyword],
        applyLink: card.querySelector("h2 a")?.href || "",
        source: "Indeed"
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
    console.error("Indeed Error:", e);
    return [];
  } finally {
    await browser.close();
  }
};