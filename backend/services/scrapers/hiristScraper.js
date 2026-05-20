import { chromium } from "playwright";

export const scrapeHirist = async ({ keyword = "" }) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const url = `https://www.hirist.com/search/jobs?query=${keyword}`;
    await page.goto(url);

    await page.waitForTimeout(6000);

    return await page.$$eval("a[href*='/job/']", cards =>
      cards.slice(0, 20).map(card => ({
        title: card.innerText.split("\n")[0] || "",
        applyLink: card.href,
        source: "Hirist"
      }))
    );

  } catch {
    return [];
  } finally {
    await browser.close();
  }
};