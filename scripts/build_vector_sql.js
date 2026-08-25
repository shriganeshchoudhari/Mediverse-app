const fs = require('fs');
const crypto = require('crypto');

function textToVector(text) {
    const dim = 384;
    const vec = new Array(dim).fill(0);
    const tokens = text.toLowerCase().match(/\w+/g) || ['empty'];
    for (const token of tokens) {
        const hash = crypto.createHash('md5').update(token).digest();
        for (let i = 0; i < dim; i++) {
            const byteVal = hash[i % 16];
            vec[i] += ((byteVal / 255.0) - 0.5);
        }
    }
    const mag = Math.sqrt(vec.reduce((sum, v) => sum + v*v, 0)) || 1.0;
    const norm = vec.map(v => Number((v / mag).toFixed(6)));
    return '[' + norm.join(',') + ']';
}

const buffer = fs.readFileSync('scratch/embeddings_to_populate.jsonl');
// Check if UTF-16LE BOM
let content;
if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    content = buffer.toString('utf16le');
} else {
    content = buffer.toString('utf8');
}

let count = 0;
const sqlStatements = ['BEGIN;'];

const rawEntries = content.split(/\r?\n(?=\{"id"\s*:)/);

for (const entry of rawEntries) {
    if (!entry.trim()) continue;
    try {
        const obj = JSON.parse(entry.trim());
        const vec = textToVector(obj.text || 'medical curriculum');
        sqlStatements.push("UPDATE curriculum_vector_embeddings SET embedding = '" + vec + "' WHERE id = '" + obj.id + "';");
        count++;
    } catch(err) {
        const idMatch = entry.match(/"id"\s*:\s*"([a-f0-9\-]+)"/);
        if (idMatch) {
            const vec = textToVector(entry);
            sqlStatements.push("UPDATE curriculum_vector_embeddings SET embedding = '" + vec + "' WHERE id = '" + idMatch[1] + "';");
            count++;
        }
    }
}

sqlStatements.push('COMMIT;');
fs.writeFileSync('scratch/update_vectors.sql', sqlStatements.join('\n'), 'utf8');
console.log('Successfully generated scratch/update_vectors.sql for ' + count + ' rows.');
