import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  const { links } = req.body;
  if (!Array.isArray(links)) {
    return res.status(400).json({ error: "Invalid links" });
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const results = [];

  for (const link of links) {
    try {
      const page = await browser.newPage();
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 15000 });
      const content = await page.evaluate(() => document.body?.innerText || "");
      results.push(`### ${link}\n\n${content.slice(0, 1500)}`);
      await page.close();
    } catch (err) {
      results.push(`### ${link}\n\n[ERROR] ${err.message}`);
    }
  }

  await browser.close();
  return res.json({ scrapedSections: results });
});

let cachedTabs = [];

app.post("/api/tabs", (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls)) {
    return res.status(400).json({ error: "Invalid URLs" });
  }
  cachedTabs = urls;
  console.log("✅ Tabs cached:", urls);
  res.status(200).send("OK");
});

app.get("/api/tabs", (req, res) => {
  res.json({ urls: cachedTabs });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`);
});
