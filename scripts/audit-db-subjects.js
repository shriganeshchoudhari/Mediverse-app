/**
 * 160 DB-Only Subject Codes Reachability & Domain Controller Cross-Check Audit
 *
 * Scans all 187 Flyway migrations, extracts every inserted subject code,
 * cross-references with:
 *   1. 86 TypeScript content directories (frontend/lib/curriculum/content/*)
 *   2. 21 Frontend Domain Scaffolds (frontend/lib/curriculum/*Scaffold.ts)
 *   3. 9 Backend Spring Boot Curriculum Controllers (com.curiolearn.curriculum.*Controller.java)
 *   4. Frontend Dynamic Healthcare Routes (frontend/app/healthcare/[domain]/...)
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.resolve(__dirname, '../backend/src/main/resources/db/migration');
const CONTENT_DIR = path.resolve(__dirname, '../frontend/lib/curriculum/content');
const SCAFFOLD_DIR = path.resolve(__dirname, '../frontend/lib/curriculum');
const CONTROLLERS_DIR = path.resolve(__dirname, '../backend/src/main/java/com/curiolearn/curriculum');

// 1. Extract all subject codes from Flyway migrations
const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));
const dbSubjects = new Map(); // code -> { title, file, category }

for (const mFile of migrationFiles) {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, mFile), 'utf8');
  
  // Regex for subject inserts: INSERT INTO subjects (id, semester_id, title, code, category)
  // or variations
  const insertRegex = /INSERT\s+INTO\s+subjects\s*\([^)]*\)\s*VALUES\s*\([^;]+;/gi;
  const matches = sql.match(insertRegex) || [];
  
  for (const match of matches) {
    // Extract individual value tuples
    const valueTuples = match.match(/\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g) || [];
    for (const tuple of valueTuples) {
      if (tuple.toUpperCase().includes('INSERT INTO')) continue;
      // Parse values: 'uuid', 'uuid', 'title', 'code', 'category'
      const stringLiterals = [...tuple.matchAll(/'((?:''|[^'])*)'/g)].map(m => m[1].replace(/''/g, "'"));
      if (stringLiterals.length >= 4) {
        // usually id, sem_id, title, code, category OR code, title
        let code = '';
        let title = '';
        let category = '';

        for (const lit of stringLiterals) {
          if (/^[A-Z0-9_-]{2,20}$/.test(lit) && !lit.includes('00000000')) {
            code = lit;
          }
        }
        
        if (!code && stringLiterals[3] && !stringLiterals[3].includes('-')) {
          code = stringLiterals[3];
        }
        
        title = stringLiterals.find(s => s.length > 5 && s !== code && !s.includes('-0000-')) || 'Subject';
        category = stringLiterals[4] || '';

        if (code) {
          dbSubjects.set(code.toUpperCase(), {
            code: code.toUpperCase(),
            title,
            category,
            file: mFile
          });
        }
      }
    }
  }
}

console.log(`[DB AUDIT] Found ${dbSubjects.size} distinct subject codes in Flyway migrations.`);

// 2. Extract TS Content folders (86)
const tsContentDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name.toUpperCase());

console.log(`[TS AUDIT] Found ${tsContentDirs.length} TS subject content directories.`);

// 3. Extract Backend Controllers
const controllerFiles = fs.readdirSync(CONTROLLERS_DIR).filter(f => f.endsWith('Controller.java'));
const controllerContent = controllerFiles.map(f => ({
  file: f,
  text: fs.readFileSync(path.join(CONTROLLERS_DIR, f), 'utf8')
}));

console.log(`[BACKEND AUDIT] Found ${controllerFiles.length} Curriculum Controllers.`);

// 4. Extract Scaffold Subject codes
const scaffoldFiles = fs.readdirSync(SCAFFOLD_DIR)
  .filter(f => f.endsWith('Scaffold.ts') || f.endsWith('CurriculumScaffold.ts'));

const scaffoldCodes = new Set();
for (const sFile of scaffoldFiles) {
  const content = fs.readFileSync(path.join(SCAFFOLD_DIR, sFile), 'utf8');
  const codeMatches = content.matchAll(/code:\s*['"]([^'"]+)['"]/g);
  for (const m of codeMatches) {
    scaffoldCodes.add(m[1].toUpperCase());
  }
}

console.log(`[SCAFFOLD AUDIT] Found ${scaffoldCodes.size} subject codes defined across ${scaffoldFiles.length} scaffolds.`);

// 5. Categorize all DB subjects
const classifiedSubjects = [];

for (const [code, info] of dbSubjects.entries()) {
  const hasTsCatalog = tsContentDirs.includes(code) || 
                       tsContentDirs.some(dir => dir.includes(code) || code.includes(dir));
  const hasScaffold = scaffoldCodes.has(code) || 
                      [...scaffoldCodes].some(sc => sc.includes(code) || code.includes(sc));
  const hasController = controllerContent.some(c => c.text.toUpperCase().includes(code));

  let reachability = 'ORPHANED';
  if (hasTsCatalog) {
    reachability = 'TS_CATALOG_AND_DB';
  } else if (hasScaffold && hasController) {
    reachability = 'SCAFFOLD_AND_CONTROLLER_SERVED';
  } else if (hasScaffold) {
    reachability = 'SCAFFOLD_SERVED';
  } else if (hasController) {
    reachability = 'CONTROLLER_SERVED';
  }

  classifiedSubjects.push({
    code,
    title: info.title,
    migrationFile: info.file,
    reachability,
    hasTsCatalog,
    hasScaffold,
    hasController
  });
}

// Summary stats
const summary = {
  totalDbSubjects: dbSubjects.size,
  tsCatalogAndDb: classifiedSubjects.filter(s => s.reachability === 'TS_CATALOG_AND_DB').length,
  scaffoldAndController: classifiedSubjects.filter(s => s.reachability === 'SCAFFOLD_AND_CONTROLLER_SERVED').length,
  scaffoldServed: classifiedSubjects.filter(s => s.reachability === 'SCAFFOLD_SERVED').length,
  controllerServed: classifiedSubjects.filter(s => s.reachability === 'CONTROLLER_SERVED').length,
  trulyOrphaned: classifiedSubjects.filter(s => s.reachability === 'ORPHANED').length,
};

console.log(`\n===============================================================`);
console.log(`       160 DB-ONLY SUBJECT CODES REACHABILITY AUDIT`);
console.log(`===============================================================`);
console.log(`1. Total DB Subject Codes Ingested:       ${summary.totalDbSubjects}`);
console.log(`2. Served via Dedicated TS Catalog:       ${summary.tsCatalogAndDb}`);
console.log(`3. Served via Dynamic Scaffold & Backend: ${summary.scaffoldAndController}`);
console.log(`4. Served via Domain Scaffold Routing:    ${summary.scaffoldServed}`);
console.log(`5. Served via Backend Controller:         ${summary.controllerServed}`);
console.log(`6. Truly Orphaned (Unmapped anywhere):    ${summary.trulyOrphaned}`);
console.log(`===============================================================\n`);

// Write detailed markdown report
const reportPath = path.resolve(__dirname, '../docs/reports/db-subject-reachability-report.md');
let mdReport = `# DB Subject Reachability Audit Report
*Generated on: 2026-08-24*

## Executive Summary
This audit cross-references all **${summary.totalDbSubjects} subject codes** present in PostgreSQL Flyway migrations against:
1. 86 TypeScript content directories
2. 21 Domain Scaffolds
3. 9 Spring Boot Curriculum Controllers

| Classification | Count | Reachability in UI |
|---|:---:|---|
| **TS Catalog & DB** | ${summary.tsCatalogAndDb} | Direct Dedicated Catalog + PostgreSQL |
| **Scaffold & Backend Controller** | ${summary.scaffoldAndController} | Dynamic \`/healthcare/[domain]/[program]\` portal |
| **Scaffold Dynamic Route** | ${summary.scaffoldServed} | Dynamic Domain Syllabus Viewer |
| **Backend Controller Only** | ${summary.controllerServed} | REST API available |
| **Truly Orphaned** | ${summary.trulyOrphaned} | Candidate for deprecation / archival |

## Detailed Breakdown of Non-TS Subjects

| Subject Code | Title | Seeded Migration | Reachability Tier |
|---|---|---|---|
`;

for (const s of classifiedSubjects.filter(s => s.reachability !== 'TS_CATALOG_AND_DB')) {
  mdReport += `| \`${s.code}\` | ${s.title} | \`${s.migrationFile}\` | **${s.reachability}** |\n`;
}

fs.writeFileSync(reportPath, mdReport, 'utf8');
console.log(`[REPORT GENERATED] Saved report to ${reportPath}`);
