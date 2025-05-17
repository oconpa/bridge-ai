// packages/backend/generate-spec.js
import { generateSpec } from './scraper.js';

const [,, label, ...links] = process.argv;

if (!label || links.length === 0) {
  console.error('❌ Usage: node generate-spec.js <label> <link1> <link2> ...');
  process.exit(1);
}

await generateSpec({ label, links });
