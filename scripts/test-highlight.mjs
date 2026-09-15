import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, '../src/data/content');

const batch1Files = ['A.01.01.json', 'A.01.02.json', 'A.01.03.json', 'A.01.04.json'];

marked.setOptions({ gfm: true, breaks: true });

function renderMarkdown(content, highlightEnabled) {
  const processed = content.replace(/==([^=\n]+)==/g, (_match, p1) => {
    if (highlightEnabled) {
      return `<mark class="rj-highlight">${p1}</mark>`;
    }
    return p1;
  });
  return marked.parse(processed);
}

for (const file of batch1Files) {
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
  const data = JSON.parse(raw);
  console.log(`\n=== Testing [${file}]: ${data.title.hi} ===`);
  
  let highlightCount = 0;
  for (const section of data.notes_sections) {
    const rawHi = section.content_markdown.hi;
    const matches = rawHi.match(/==([^=\n]+)==/g);
    if (matches) highlightCount += matches.length;

    // Test Highlight ON
    const htmlOn = renderMarkdown(rawHi, true);
    // Test Highlight OFF
    const htmlOff = renderMarkdown(rawHi, false);

    // Check if any leftover '==' exists
    if (htmlOn.includes('==') || htmlOff.includes('==')) {
      console.error(`❌ Found unparsed '==' in ${file} section ${section.section_title.hi}`);
    }
  }
  console.log(`✅ Total highlight terms found: ${highlightCount}`);
  console.log(`✅ Quick facts present: ${data.quick_facts?.length || 0}`);
}
