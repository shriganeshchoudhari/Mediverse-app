const fs = require('fs');
const path = require('path');

const curriculumDir = path.join(__dirname, '..', 'lib', 'curriculum');

function extractArray(content, arrayName) {
  const match = content.match(new RegExp(`export const ${arrayName}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\];)`, 'm'));
  return match ? match[1] : null;
}

// Read content modules
const contentDir = path.join(curriculumDir, 'content');
const contentPackages = fs.readdirSync(contentDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log(`Found ${contentPackages.length} advanced discipline packages.`);
