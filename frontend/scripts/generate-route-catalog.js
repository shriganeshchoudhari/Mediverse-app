const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'lib', 'curriculum', 'content');
const entries = fs.readdirSync(contentDir, { withFileTypes: true });

const moduleImports = [];
const arrayNames = [];

for (const entry of entries) {
  if (entry.isDirectory()) {
    const indexPath = path.join(contentDir, entry.name, 'index.ts');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      const match = content.match(/export const ([A-Z0-9_]+_MODULES)/);
      if (match) {
        const arrName = match[1];
        moduleImports.push(`import { ${arrName} } from "@/lib/curriculum/content/${entry.name}";`);
        arrayNames.push(arrName);
      }
    }
  }
}

console.log(`Found ${arrayNames.length} module arrays across ${entries.length} content packages:`);
console.log(arrayNames.join(', '));
