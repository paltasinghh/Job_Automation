// services/scrapers/workindiaScraper.js
import { chromium } from "playwright";

export const scrapeWorkIndia = async ({ keyword, location }) => {
  const browser = await chromium.launch({ headless: false }); // must be false
  const page = await browser.newPage();

  try {
    const url = `https://www.workindia.in/jobs-${keyword || ""}-in-${location || ""}/`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForTimeout(8000);

    const jobs = await page.$$eval(".JobCard_jobCard__", cards =>
      cards.map(card => ({
        title: card.innerText.split("\n")[0] || "",
        company: card.innerText.split("\n")[1] || "",
        location: card.innerText.includes("₹") ? "India" : "",
        techStack: [],
        jobType: "onsite",
        applyLink: "",
        source: "WorkIndia"
      }))
    );

    return jobs;

  } catch (err) {
    console.error("WorkIndia Error:", err);
    return [];
  } finally {
    await browser.close();
  }
};