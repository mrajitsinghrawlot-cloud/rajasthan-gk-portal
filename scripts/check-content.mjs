import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, '../src/data/content');

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
console.log(`Found ${files.length} content JSON files.`);

const questionsHi = new Map();
const questionsEn = new Map();
let totalMcqs = 0;
let errors = 0;

for (const file of files) {
  const filePath = path.join(contentDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    
    if (!data.id || !data.title || !data.notes_sections || !data.key_facts_rapid_revision || !data.mcqs) {
      console.error(`❌ [${file}] Missing required top-level fields.`);
      errors++;
    }

    // Check Quick Facts if present
    if (data.quick_facts) {
      if (!Array.isArray(data.quick_facts)) {
        console.error(`❌ [${file}] quick_facts must be an array.`);
        errors++;
      } else {
        for (const qf of data.quick_facts) {
          if (!qf.label?.hi || !qf.label?.en || !qf.value?.hi || !qf.value?.en) {
            console.error(`❌ [${file}] quick_fact missing bilingual label or value.`);
            errors++;
          }
        }
      }
    }

    // Check MCQs
    if (Array.isArray(data.mcqs)) {
      for (const mcq of data.mcqs) {
        totalMcqs++;
        const qHi = mcq.question?.hi?.trim();
        const qEn = mcq.question?.en?.trim();

        if (!qHi || !qEn) {
          console.error(`❌ [${file} / ${mcq.id}] Missing bilingual question text.`);
          errors++;
          continue;
        }

        if (questionsHi.has(qHi)) {
          console.error(`❌ Duplicate Hindi MCQ detected!`);
          console.error(`   Q: "${qHi}"`);
          console.error(`   First in: ${questionsHi.get(qHi)}`);
          console.error(`   Duplicate in: ${file} (${mcq.id})`);
          errors++;
        } else {
          questionsHi.set(qHi, `${file} / ${mcq.id}`);
        }

        if (questionsEn.has(qEn)) {
          console.error(`❌ Duplicate English MCQ detected!`);
          console.error(`   Q: "${qEn}"`);
          console.error(`   First in: ${questionsEn.get(qEn)}`);
          console.error(`   Duplicate in: ${file} (${mcq.id})`);
          errors++;
        } else {
          questionsEn.set(qEn, `${file} / ${mcq.id}`);
        }

        // Validate options
        if (!Array.isArray(mcq.options) || mcq.options.length !== 4) {
          console.error(`❌ [${file} / ${mcq.id}] Must have exactly 4 options.`);
          errors++;
        }
        if (!['A', 'B', 'C', 'D'].includes(mcq.correct_option)) {
          console.error(`❌ [${file} / ${mcq.id}] Invalid correct_option: ${mcq.correct_option}`);
          errors++;
        }
        if (!mcq.explanation?.hi || !mcq.explanation?.en) {
          console.error(`❌ [${file} / ${mcq.id}] Missing bilingual explanation.`);
          errors++;
        }
      }
    }
  } catch (err) {
    console.error(`❌ [${file}] JSON Parse Error:`, err.message);
    errors++;
  }
}

console.log(`\n================================`);
console.log(`Total Topics Verified: ${files.length}`);
console.log(`Total MCQs Verified:   ${totalMcqs}`);
console.log(`Total Errors / Dupes:  ${errors}`);
console.log(`================================\n`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✅ All content verified with 0 duplicates and valid schema!');
}
