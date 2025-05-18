// packages/backend/scraper.js
import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export async function generateSpec({ label, links }) {
  const browser = await puppeteer.launch();
  const scraped = [];

  for (const link of links) {
    try {
      const page = await browser.newPage();
      await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const text = await page.evaluate(() => document.body.innerText);
      scraped.push(`### ${link}\n\n${text}`);
      await page.close();
    } catch (err) {
      scraped.push(`### ${link}\n\nError: ${err.message}`);
    }
  }

  await browser.close();

  const prompt = `
Create a technical spec from this content, with clear sections like Overview, Key Insights, and Next Steps:

${scraped.join('\n\n---\n\n')}
  `;

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt,
      stream: false
    })
  });

  const data = await res.json();
  const markdown = data.response.trim();

  const dir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const filepath = path.join(dir, `${label}.md`);
  fs.writeFileSync(filepath, markdown);
  console.log(`New spec doc was saved to ${filepath}`);
}
