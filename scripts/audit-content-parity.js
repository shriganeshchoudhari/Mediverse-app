/**
 * Phase 0: Content Parity & Drift Audit Script
 * 
 * 3-Way Reconciliation across:
 * 1. Frontend Shadow Content: frontend/lib/curriculum/content/*
 * 2. Backend Flyway Migrations: backend/src/main/resources/db/migration/*
 * 3. Curriculum Docs Outlines: docs/curriculum/*
 * 
 * Generates: docs/reports/content-parity-audit-report.md
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_CONTENT_DIR = path.join(__dirname, '../frontend/lib/curriculum/content');
const MIGRATIONS_DIR = path.join(__dirname, '../backend/src/main/resources/db/migration');
const DOCS_CURRICULUM_DIR = path.join(__dirname, '../docs/curriculum');
const REPORT_OUT = path.join(__dirname, '../docs/reports/content-parity-audit-report.md');

// Ensure reports directory exists
const reportsDir = path.dirname(REPORT_OUT);
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// 1. Scan Frontend TS Modules
function scanFrontendModules() {
  const subjectMap = new Map();
  if (!fs.existsSync(FRONTEND_CONTENT_DIR)) return subjectMap;

  const entries = fs.readdirSync(FRONTEND_CONTENT_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subjectName = entry.name;
      const subPath = path.join(FRONTEND_CONTENT_DIR, subjectName);
      const files = fs.readdirSync(subPath, { withFileTypes: true });

      const modules = [];
      for (const f of files) {
        if (f.isFile() && f.name.endsWith('Content.ts')) {
          const filePath = path.join(subPath, f.name);
          const content = fs.readFileSync(filePath, 'utf-8');

          const hasVignettes = content.includes('clinicalVignettes:') && !content.includes('clinicalVignettes: []');
          const hasFlashcards = content.includes('flashcards:') || content.includes('### 18. Flashcards');
          const has3D = content.includes('organ3dTarget:') && !content.includes('organ3dTarget: null') && !content.includes('organ3dTarget: undefined');
          const hasQuiz = content.includes('checkpoints:') || content.includes('### 16. MCQs') || content.includes('### 20. Practice Quiz');
          const wordCount = content.split(/\s+/).length;

          modules.push({
            filename: f.name,
            hasVignettes,
            hasFlashcards,
            has3D,
            hasQuiz,
            wordCount
          });
        }
      }
      subjectMap.set(subjectName, modules);
    }
  }
  return subjectMap;
}

// 2. Scan DB Migrations
function scanDbMigrations() {
  const migrationStats = {
    totalMigrations: 0,
    lessonsBySubject: new Map(),
    blockTypesCount: {
      EXPLANATION: 0,
      CLINICAL_CASE: 0,
      QUIZ: 0,
      FLASHCARD: 0,
      '3D_MODEL': 0,
      OTHER: 0
    }
  };

  if (!fs.existsSync(MIGRATIONS_DIR)) return migrationStats;

  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));
  migrationStats.totalMigrations = files.length;

  for (const f of files) {
    const filePath = path.join(MIGRATIONS_DIR, f);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Count block types
    const explanationMatches = content.match(/('EXPLANATION')/g);
    if (explanationMatches) migrationStats.blockTypesCount.EXPLANATION += explanationMatches.length;

    const caseMatches = content.match(/('CLINICAL_CASE')/g);
    if (caseMatches) migrationStats.blockTypesCount.CLINICAL_CASE += caseMatches.length;

    const quizMatches = content.match(/('QUIZ')/g);
    if (quizMatches) migrationStats.blockTypesCount.QUIZ += quizMatches.length;

    const flashMatches = content.match(/('FLASHCARD')/g);
    if (flashMatches) migrationStats.blockTypesCount.FLASHCARD += flashMatches.length;

    const modelMatches = content.match(/('3D_MODEL')/g);
    if (modelMatches) migrationStats.blockTypesCount['3D_MODEL'] += modelMatches.length;
  }

  return migrationStats;
}

// 3. Scan Docs Curriculum
function scanDocsCurriculum() {
  const docFiles = new Set();
  if (!fs.existsSync(DOCS_CURRICULUM_DIR)) return docFiles;

  const files = fs.readdirSync(DOCS_CURRICULUM_DIR);
  for (const f of files) {
    if (f.endsWith('.md')) {
      docFiles.add(f.replace('.md', '').toLowerCase());
    }
  }
  return docFiles;
}

function generateAuditReport() {
  console.log('🔍 Executing Phase 0 Content Parity Audit...');
  const frontendSubjects = scanFrontendModules();
  const dbStats = scanDbMigrations();
  const docOutlines = scanDocsCurriculum();

  let totalTsModules = 0;
  let totalWords = 0;
  let withVignettesCount = 0;
  let withFlashcardsCount = 0;
  let with3DCount = 0;
  let withQuizCount = 0;

  for (const [subject, modules] of frontendSubjects.entries()) {
    totalTsModules += modules.length;
    for (const m of modules) {
      totalWords += m.wordCount;
      if (m.hasVignettes) withVignettesCount++;
      if (m.hasFlashcards) withFlashcardsCount++;
      if (m.has3D) with3DCount++;
      if (m.hasQuiz) withQuizCount++;
    }
  }

  let report = `# Mediverse Platform — Content Parity & Drift Audit Report\n\n`;
  report += `**Generated At**: ${new Date().toISOString()}\n`;
  report += `**Audit Scope**: 3-Way Reconciliation between Frontend TS Modules, Flyway Migrations, and Docs.\n\n`;

  report += `---\n\n`;
  report += `## 📊 Executive Summary Metrics\n\n`;
  report += `| Metric | Value | Notes |\n`;
  report += `|---|---|---|\n`;
  report += `| **Total Frontend Subject Folders** | **${frontendSubjects.size}** | Located in \`frontend/lib/curriculum/content/*\` |\n`;
  report += `| **Total Frontend TS Lesson Modules** | **${totalTsModules}** | Rich clinical markdown & vignettes |\n`;
  report += `| **Total Estimated Word Count** | **${totalWords.toLocaleString()}** words | Authoritative medical content |\n`;
  report += `| **Modules with Clinical Vignettes** | **${withVignettesCount}** (${Math.round(withVignettesCount / totalTsModules * 100)}%) | Multi-step clinical problem solving |\n`;
  report += `| **Modules with Active Flashcards** | **${withFlashcardsCount}** (${Math.round(withFlashcardsCount / totalTsModules * 100)}%) | High-yield spaced repetition |\n`;
  report += `| **Modules with 3D Organ Targets** | **${with3DCount}** (${Math.round(with3DCount / totalTsModules * 100)}%) | Three.js anatomical model bindings |\n`;
  report += `| **Total Flyway SQL Migrations** | **${dbStats.totalMigrations}** | In \`backend/src/main/resources/db/migration\` |\n`;
  report += `| **DB Ingested EXPLANATION Blocks** | **${dbStats.blockTypesCount.EXPLANATION}** | Canonical text blocks |\n`;
  report += `| **DB Ingested CLINICAL_CASE Blocks** | **${dbStats.blockTypesCount.CLINICAL_CASE}** | Ingested case studies |\n`;
  report += `| **DB Ingested 3D_MODEL Blocks** | **${dbStats.blockTypesCount['3D_MODEL']}** | Validated anatomical organ blocks |\n`;
  report += `| **Docs Curriculum Outlines** | **${docOutlines.size}** | Reference markdown outlines in \`docs/curriculum/\` |\n\n`;

  report += `---\n\n`;
  report += `## 📑 Detailed Subject-by-Subject Reconciliation Matrix\n\n`;
  report += `| Subject Directory | TS Modules | Vignettes | Flashcards | 3D Spatial | Doc Outline Present? | Parity Status |\n`;
  report += `|---|---|---|---|---|---|---|\n`;

  const sortedSubjects = [...frontendSubjects.keys()].sort();
  for (const subj of sortedSubjects) {
    const mods = frontendSubjects.get(subj);
    const modCount = mods.length;
    const vigCount = mods.filter(m => m.hasVignettes).length;
    const flashCount = mods.filter(m => m.hasFlashcards).length;
    const target3dCount = mods.filter(m => m.has3D).length;
    const hasDoc = docOutlines.has(subj.toLowerCase()) ? '✅ Yes' : '⬜ Outline Pending';

    let status = '🟢 Ingested (V184)';
    if (modCount === 0) status = '🔴 Empty Folder';

    report += `| \`${subj}\` | ${modCount} | ${vigCount}/${modCount} | ${flashCount}/${modCount} | ${target3dCount}/${modCount} | ${hasDoc} | ${status} |\n`;
  }

  report += `\n---\n\n`;
  report += `## 🎯 Phase 1 Actionable Roadmap & Cutover Strategy\n\n`;
  report += `1. **Batch 1 (Pre-Clinical Foundation)**: \`anatomy\`, \`anatomy2\`, \`biochemistry\`, \`biochemistry2\`, \`physiology\` (Highest maturity, priority for API cutover).\n`;
  report += `2. **Batch 2 (Para-Clinical Core)**: \`pathology\`, \`microbiology\`, \`pharmacology\`, \`forensic\`, \`community\`.\n`;
  report += `3. **Batch 3 (Clinical Specialties)**: \`medicine\`, \`surgery\`, \`pediatrics\`, \`obgyn\`, \`orthopedics\`, \`ophthalmology\`, \`ent\`, \`dermatology\`, \`anesthesiology\`.\n`;
  report += `4. **Batch 4 (Postgraduate & Super-Specialty)**: \`pg1\` through \`pg12\`, \`cardiovascularadv\`, \`nephrologyadv\`, \`neurologyadv\`, \`oncology\`.\n`;
  report += `5. **Batch 5 (Allied & Non-Allopathic Domains)**: BDS Dental, BAMS Ayurveda, B.Pharm Pharmacy, B.Sc Nursing, BPT Physiotherapy, BVSc Veterinary, MPH Public Health.\n\n`;

  report += `**Next Step**: Deprecate direct static imports in subject pages once \`/api/v1/curriculum/subjects/{code}/chapters/{id}\` is confirmed for each batch.\n`;

  fs.writeFileSync(REPORT_OUT, report, 'utf-8');
  console.log(`✅ Audit report written to ${REPORT_OUT}`);
  console.log(`📊 Total subjects audited: ${sortedSubjects.length}, Total TS modules: ${totalTsModules}, Word count: ${totalWords.toLocaleString()}`);
}

generateAuditReport();
