import { generateSpec } from './scraper.js';
import { execSync } from 'child_process';

const [,, label, ...links] = process.argv;

if (!label || links.length === 0) {
  console.error('Usage: node generate-spec.js <label> <link1> <link2> ...');
  process.exit(1);
}

// create spec doc
await generateSpec({ label, links });

// create instructions from spec doc
execSync(`node ./generate-instructions.js ${label}`, { stdio: 'inherit' });
