const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix nested <MarkdownRenderer content=<MarkdownRenderer content={activeModule.markdownContent} /> />
  content = content.replace(
    /<MarkdownRenderer content=<MarkdownRenderer content=\{activeModule\.markdownContent\} \/> \/>/g,
    `<MarkdownRenderer content={activeModule.markdownContent} />`
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && entry.name === 'page.tsx') {
      fixFile(fullPath);
    }
  }
}

walkDir(appDir);
console.log('🎉 Fixed nested MarkdownRenderer tags across all page.tsx files!');
