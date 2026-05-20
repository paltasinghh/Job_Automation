import { chromium } from "playwright";

export const scrapeNaukri = async ({ keyword = "", location = "" }) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url = `https://www.naukri.com/${keyword}-jobs-in-${location}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForTimeout(7000);
    await page.evaluate(() => window.scrollBy(0, 1500));

    const count = await page.locator(".jobTuple").count();
    if (count === 0) return [];

    return await page.$$eval(".jobTuple", cards =>
      cards.map(card => ({
        title: card.querySelector(".title")?.innerText || "",
        company: card.querySelector(".subTitle")?.innerText || "",
        location: card.querySelector(".locWdth")?.innerText || "",
        applyLink: card.querySelector("a")?.href || "",
        source: "Naukri"
      }))
    );

  } catch {
    return [];
  } finally {
    await browser.close();
  }
};