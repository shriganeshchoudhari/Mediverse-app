const fs = require('fs');
const path = require('path');

const targetFiles = [
  'app/healthcare/ayush/bhms/page.tsx',
  'app/healthcare/ayush/bnys/page.tsx',
  'app/healthcare/ayush/bsms/page.tsx',
  'app/healthcare/ayush/bums/page.tsx',
  'app/healthcare/veterinary/bvsc/page.tsx',
  'app/healthcare/veterinary/mvsc/page.tsx',
  'app/healthcare/veterinary/page.tsx',
  'app/healthcare/public-health/page.tsx',
  'app/healthcare/public-health/mph/page.tsx',
  'app/healthcare/public-health/mha/page.tsx',
];

const basePath = path.join(__dirname, '..');

targetFiles.forEach((rel) => {
  const filePath = path.join(basePath, rel);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace background container
  content = content.replace(/className="p-8"/g, 'className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 pb-20"');
  content = content.replace(/className="max-w-7xl mx-auto p-6"/g, 'className="min-h-screen bg-slate-950 text-slate-100 max-w-7xl mx-auto p-6 pb-20"');
  content = content.replace(/className="container mx-auto px-4 py-8"/g, 'className="min-h-screen bg-slate-950 text-slate-100 container mx-auto px-4 py-8 pb-20"');

  // Replace light cards with dark cards
  content = content.replace(/bg-white/g, 'bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl');
  content = content.replace(/bg-gray-50/g, 'bg-slate-950/60 text-slate-300 border-slate-800');
  content = content.replace(/bg-green-50/g, 'bg-emerald-950/20 text-emerald-300 border-emerald-800/40');
  content = content.replace(/bg-indigo-50/g, 'bg-indigo-950/20 text-indigo-300 border-indigo-800/40');

  // Replace text colors
  content = content.replace(/text-gray-500/g, 'text-slate-400');
  content = content.replace(/text-gray-600/g, 'text-slate-400');
  content = content.replace(/text-gray-700/g, 'text-slate-300');
  content = content.replace(/text-gray-800/g, 'text-slate-200');
  content = content.replace(/text-gray-900/g, 'text-white font-bold');

  // Replace badge classes
  content = content.replace(/bg-purple-100 text-purple-800/g, 'bg-purple-500/20 text-purple-300 border border-purple-500/30');
  content = content.replace(/bg-green-100 text-green-800/g, 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30');
  content = content.replace(/bg-blue-100 text-blue-800/g, 'bg-blue-500/20 text-blue-300 border border-blue-500/30');
  content = content.replace(/bg-red-100 text-red-800/g, 'bg-red-500/20 text-red-300 border border-red-500/30');

  // Tab active/inactive colors
  content = content.replace(/'text-gray-500 hover:text-gray-700'/g, "'text-slate-400 hover:text-slate-200'");
  content = content.replace(/'border-b-2 border-blue-600 text-blue-600'/g, "'border-b-2 border-indigo-500 text-indigo-400 font-bold'");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Dark theme aligned: ${rel}`);
});
