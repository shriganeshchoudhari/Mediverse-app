/**
 * audit-content-parity.js
 *
 * Cross-references the three curriculum content sources in Mediverse-app:
 *   1. Flyway seed migrations   (backend/src/main/resources/db/migration/*.sql)
 *   2. Frontend TS content tree (frontend/lib/curriculum/content/<subject>/*)
 *   3. Legacy curriculum docs   (docs/curriculum/*.md)
 *
 * Outputs a parity report: which subjects exist in which source(s),
 * and rough content-block-type coverage for lessons ingested via V184.
 *
 * Usage: node audit-content-parity.js <path-to-repo-root>
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.';
const MIGRATION_DIR = path.join(ROOT, 'backend/src/main/resources/db/migration');
const TS_CONTENT_DIR = path.join(ROOT, 'frontend/lib/curriculum/content');
const DOCS_CURRICULUM_DIR = path.join(ROOT, 'docs/curriculum');

function safeReaddir(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }); }
  catch (e) { return []; }
}

// ---- 1. TS content subjects ----
const tsSubjects = new Set(
  safeReaddir(TS_CONTENT_DIR).filter(d => d.isDirectory()).map(d => d.name)
);

// ---- 2. DB seed migration subjects (parse subject codes/titles from INSERT INTO subjects) ----
const dbSubjectsByFile = new Map(); // migration filename -> [{code, title}]
const subjectInsertRe = /INSERT INTO subjects[^;]*?VALUES\s*\('[^']+',\s*'[^']*',\s*'([^']+)',\s*'([^']+)'/gis;

const migrationFiles = safeReaddir(MIGRATION_DIR)
  .filter(f => f.isFile() && f.name.endsWith('.sql'))
  .map(f => f.name)
  .sort();

let totalDbSubjects = 0;
const dbSubjectCodes = new Set();
for (const file of migrationFiles) {
  const full = path.join(MIGRATION_DIR, file);
  let content;
  try { content = fs.readFileSync(full, 'utf-8'); } catch (e) { continue; }
  const matches = [...content.matchAll(subjectInsertRe)];
  if (matches.length) {
    dbSubjectsByFile.set(file, matches.map(m => ({ code: m[1], title: m[2] })));
    matches.forEach(m => { dbSubjectCodes.add(m[1]); totalDbSubjects++; });
  }
}

// ---- 3. docs/curriculum files (physiology-only historically) ----
const docsFiles = safeReaddir(DOCS_CURRICULUM_DIR)
  .filter(f => f.isFile() && f.name.endsWith('.md'))
  .map(f => f.name);

// ---- 4. Content-block type coverage from V184 (the TS->DB ETL migration) ----
const v184Path = path.join(MIGRATION_DIR, 'V184__ingest_rich_multimodal_content_blocks.sql');
let blockTypeCounts = {};
let lessonCount = 0;
if (fs.existsSync(v184Path)) {
  const v184 = fs.readFileSync(v184Path, 'utf-8');
  lessonCount = (v184.match(/INSERT INTO lessons/g) || []).length;
  const typeRe = /INSERT INTO content_blocks[^;]*?'([A-Z_]+)',\s*\d+,/gis;
  for (const m of v184.matchAll(typeRe)) {
    blockTypeCounts[m[1]] = (blockTypeCounts[m[1]] || 0) + 1;
  }
}

// ---- Build report ----
const lines = [];
lines.push('# Content Parity Audit');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Source inventory');
lines.push(`- TS content subject folders: **${tsSubjects.size}**`);
lines.push(`- Distinct subject codes found across all Flyway seed migrations: **${dbSubjectCodes.size}**`);
lines.push(`- Migration files containing subject inserts: **${dbSubjectsByFile.size}** / ${migrationFiles.length} total migrations`);
lines.push(`- docs/curriculum/*.md files (legacy, physiology-only): **${docsFiles.length}**`);
lines.push('');

lines.push('## V184 ingestion (TS -> DB ETL) coverage');
if (lessonCount) {
  lines.push(`- Lessons inserted by V184: **${lessonCount}**`);
  lines.push('- Content block type distribution (V184 only):');
  const sorted = Object.entries(blockTypeCounts).sort((a,b) => b[1]-a[1]);
  for (const [type, count] of sorted) {
    lines.push(`  - ${type}: ${count}`);
  }
  const avgBlocksPerLesson = lessonCount ? (Object.values(blockTypeCounts).reduce((a,b)=>a+b,0) / lessonCount).toFixed(2) : 'n/a';
  lines.push(`- Average content blocks per lesson (V184 set): **${avgBlocksPerLesson}**`);
} else {
  lines.push('- V184 migration not found or contains no lesson inserts.');
}
lines.push('');

lines.push('## Subjects present in TS but with NO matching subject-code insert anywhere in migrations');
lines.push('(code derived the same way V184 derives it: folder name upper-cased, first 10 chars)');
const missingFromDb = [];
for (const folder of tsSubjects) {
  const derivedCode = folder.toUpperCase().substring(0, 10);
  if (!dbSubjectCodes.has(derivedCode)) missingFromDb.push(folder);
}
if (missingFromDb.length === 0) {
  lines.push('- None — every TS subject folder has a corresponding DB subject code (likely all via V184).');
} else {
  missingFromDb.sort().forEach(f => lines.push(`- ${f}`));
}
lines.push('');

lines.push(`## Total: ${missingFromDb.length} of ${tsSubjects.size} TS subjects unmatched in DB`);
lines.push('');
lines.push('## Interpretation');
lines.push('- If V184 covers all/most TS folders, the DB is NOT missing content — the gap is purely that the *frontend* reads from TS files instead of the API that already serves this same DB-ingested content.');
lines.push('- Any subjects listed as unmatched above need either a manual seed migration or a re-run of scripts/ingest-curriculum-to-db.js before they can be safely cut over.');
lines.push('- Content-block type distribution above shows how far lesson depth is from the 14-type vision (EXPLANATION-heavy skew expected).');

const outPath = path.join(ROOT, 'docs', 'content-parity-audit.md');
fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');
console.log(lines.join('\n'));
console.log('\n---\nReport written to: ' + outPath);
