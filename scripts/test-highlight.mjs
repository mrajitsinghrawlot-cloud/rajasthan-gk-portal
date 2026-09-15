import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, '../src/data/content');

const allFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.json')).sort();

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

let totalHighlights = 0;
let totalQuickFacts = 0;
let filesWithQuickFacts = 0;
let errors = 0;

for (const file of allFiles) {
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
  const data = JSON.parse(raw);
  
  const qfCount = data.quick_facts?.length || 0;
  if (qfCount > 0) filesWithQuickFacts++;
  totalQuickFacts += qfCount;

  let fileHighlightCount = 0;
  for (const section of (data.notes_sections || [])) {
    for (const lang of ['hi', 'en']) {
      const text = section.content_markdown?.[lang];
      if (!text) continue;
      const matches = text.match(/==([^=\n]+)==/g);
      if (matches) fileHighlightCount += matches.length;

      const htmlOn = renderMarkdown(text, true);
      const htmlOff = renderMarkdown(text, false);

      if (htmlOn.includes('==') || htmlOff.includes('==')) {
        console.error(`❌ Found unparsed '==' in ${file} [${lang}] section: ${section.section_title?.[lang]}`);
        errors++;
      }
    }
  }
  totalHighlights += fileHighlightCount;

  if (qfCount > 0 || fileHighlightCount > 0) {
    console.log(`[${file}] ${data.title?.hi?.slice(0, 35)}... -> QuickFacts: ${qfCount}, Highlights: ${fileHighlightCount}`);
  }
}

console.log('\n========================================');
console.log(`Files with Quick Facts: ${filesWithQuickFacts} / ${allFiles.length}`);
console.log(`Total Quick Facts:      ${totalQuickFacts}`);
console.log(`Total Highlights:       ${totalHighlights}`);
console.log(`Errors / Leaks:         ${errors}`);
console.log('========================================');

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✅ All highlight markers and quick facts verified successfully!');
}
