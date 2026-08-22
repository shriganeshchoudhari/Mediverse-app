const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');

function upgradeFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if file renders activeModule.markdownContent
  if (!content.includes('{activeModule.markdownContent}')) return;

  // Add import if not present
  if (!content.includes('MarkdownRenderer')) {
    // Relative path to components/common/MarkdownRenderer
    const relDepth = path.relative(path.dirname(filePath), path.join(__dirname, '..', 'components', 'common')).replace(/\\/g, '/');
    const importPath = (relDepth.startsWith('.') ? relDepth : './' + relDepth) + '/MarkdownRenderer';
    
    // Insert import after "use client"; or other imports
    if (content.includes('import Link from "next/link";')) {
      content = content.replace(
        'import Link from "next/link";',
        `import Link from "next/link";\nimport MarkdownRenderer from "${importPath}";`
      );
    } else if (content.includes('import React')) {
      content = content.replace(
        /(import React[^\n]*\n)/,
        `$1import MarkdownRenderer from "${importPath}";\n`
      );
    }
  }

  // Replace the raw markdown container div
  // Pattern 1: standard whitespace-pre-wrap container
  content = content.replace(
    /<div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950\/60 p-5 rounded-xl border border-slate-800\/80 max-h-96 overflow-y-auto">\s*\{activeModule\.markdownContent\}\s*<\/div>/g,
    `<div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">\n              <MarkdownRenderer content={activeModule.markdownContent} />\n            </div>`
  );

  // Pattern 2: any remaining direct {activeModule.markdownContent}
  content = content.replace(
    /\{activeModule\.markdownContent\}/g,
    `<MarkdownRenderer content={activeModule.markdownContent} />`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Upgraded ${path.relative(appDir, filePath)}`);
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && entry.name === 'page.tsx') {
      upgradeFile(fullPath);
    }
  }
}

walkDir(appDir);
console.log('🎉 All lesson and domain portal pages upgraded to MarkdownRenderer with KaTeX + GFM Tables!');
