const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
  }

  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createMediversePng(width, height) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Generate pixels (Dark slate background #020617 with Blue/Cyan ECG pulse #3B82F6 / #60A5FA)
  const rawScanlines = [];
  for (let y = 0; y < height; y++) {
    const scanline = Buffer.alloc(1 + width * 4);
    scanline.writeUInt8(0, 0); // Filter type 0

    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;

      // Distance from center
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const maxR = width * 0.44;

      // Outer circle border
      const isCircle = r <= maxR;
      const isBorder = r >= maxR - (width * 0.04) && r <= maxR;

      // ECG wave pattern: y = cy + amplitude * f(x)
      const nx = (x - width * 0.15) / (width * 0.7); // 0 to 1
      let ecgY = cy;
      if (nx > 0.35 && nx < 0.42) {
        ecgY = cy - (height * 0.15); // P wave
      } else if (nx >= 0.42 && nx < 0.46) {
        ecgY = cy + (height * 0.08); // Q wave
      } else if (nx >= 0.46 && nx < 0.54) {
        ecgY = cy - (height * 0.35); // R peak!
      } else if (nx >= 0.54 && nx < 0.58) {
        ecgY = cy + (height * 0.22); // S wave
      } else if (nx >= 0.62 && nx < 0.72) {
        ecgY = cy - (height * 0.12); // T wave
      }

      const distToEcg = Math.abs(y - ecgY);
      const isEcg = nx >= 0.1 && nx <= 0.9 && distToEcg <= (width * 0.025);

      if (isEcg) {
        scanline.writeUInt8(59, idx);     // R (#3B82F6)
        scanline.writeUInt8(130, idx + 1); // G
        scanline.writeUInt8(246, idx + 2); // B
        scanline.writeUInt8(255, idx + 3); // A
      } else if (isBorder) {
        scanline.writeUInt8(96, idx);     // R (#60A5FA)
        scanline.writeUInt8(165, idx + 1); // G
        scanline.writeUInt8(250, idx + 2); // B
        scanline.writeUInt8(200, idx + 3); // A
      } else if (isCircle) {
        scanline.writeUInt8(15, idx);     // R (#0F172A)
        scanline.writeUInt8(23, idx + 1);  // G
        scanline.writeUInt8(42, idx + 2);  // B
        scanline.writeUInt8(255, idx + 3); // A
      } else {
        scanline.writeUInt8(2, idx);      // R (#020617)
        scanline.writeUInt8(6, idx + 1);   // G
        scanline.writeUInt8(23, idx + 2);  // B
        scanline.writeUInt8(255, idx + 3); // A
      }
    }
    rawScanlines.push(scanline);
  }

  const allScanlines = Buffer.concat(rawScanlines);
  const compressed = zlib.deflateSync(allScanlines);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');
const screenshotsDir = path.join(publicDir, 'screenshots');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// 1. Generate 192x192
const png192 = createMediversePng(192, 192);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);
console.log('✅ Generated icon-192.png');

// 2. Generate 512x512
const png512 = createMediversePng(512, 512);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);
console.log('✅ Generated icon-512.png');

// 3. Generate Screenshot dummy for wide display
const pngWide = createMediversePng(640, 360);
fs.writeFileSync(path.join(screenshotsDir, 'dashboard.png'), pngWide);
console.log('✅ Generated screenshots/dashboard.png');
