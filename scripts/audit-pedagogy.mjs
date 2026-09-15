import fs from 'fs';
import path from 'path';

const contentDir = './src/data/content';
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json') && f !== 'taxonomy.json');

let missingQuickFacts = [];
let totalQuickFacts = 0;
let totalHighlights = 0;

for (const f of files.sort()) {
  const filePath = path.join(contentDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const qf = data.quick_facts;
  const qfCount = Array.isArray(qf) ? qf.length : 0;
  totalQuickFacts += qfCount;

  let hlCount = 0;
  if (Array.isArray(data.notes_sections)) {
    for (const sec of data.notes_sections) {
      // Check content_markdown or content
      const md = sec.content_markdown || sec.content;
      if (md) {
        for (const lang of ['hi', 'en']) {
          if (md[lang]) {
            const matches = md[lang].match(/==[^=]+==/g);
            if (matches) hlCount += matches.length;
          }
        }
      }
      // Check subsections content
      if (Array.isArray(sec.subsections)) {
        for (const sub of sec.subsections) {
          const subMd = sub.content_markdown || sub.content;
          if (subMd) {
            for (const lang of ['hi', 'en']) {
              if (subMd[lang]) {
                const matches = subMd[lang].match(/==[^=]+==/g);
                if (matches) hlCount += matches.length;
              }
            }
          }
        }
      }
    }
  }
  totalHighlights += hlCount;

  if (qfCount === 0) {
    missingQuickFacts.push(f);
  } else {
    console.log(`✓ ${f.padEnd(14)}: ${qfCount.toString().padStart(2)} Quick Facts | ${hlCount.toString().padStart(3)} Highlights`);
  }
}

console.log('==================================================');
console.log(`Total Files:          ${files.length}`);
console.log(`Files with QFs:       ${files.length - missingQuickFacts.length} / ${files.length}`);
console.log(`Total Quick Facts:    ${totalQuickFacts}`);
console.log(`Total Highlights:     ${totalHighlights}`);
console.log(`Files missing QFs (${missingQuickFacts.length}):\n${missingQuickFacts.join(', ')}`);
console.log('==================================================');
