import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPNG(width, height, drawFn) {
  // Raw RGBA buffer
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // CRC table
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c >>> 0;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function createChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);

    return Buffer.concat([lenBuf, typeAndData, crcBuf]);
  }

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Avatar 1 (monochrome face/profile silhouette with subtle glass glow)
const avatar1 = createPNG(128, 128, (x, y, w, h) => {
  const dx = x - 64;
  const dy = y - 64;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 62) return [0, 0, 0, 0];
  if (dist > 60) return [255, 255, 255, 180];
  // background gradient
  const bg = Math.floor(20 + ((64 - dy) / 128) * 40);
  
  // Head circle
  const headDist = Math.sqrt(dx * dx + (y - 46) * (y - 46));
  if (headDist < 20) return [235, 235, 235, 255];

  // Shoulders ellipse
  const shoulderDist = ((x - 64) * (x - 64)) / (34 * 34) + ((y - 94) * (y - 94)) / (24 * 24);
  if (shoulderDist < 1 && y >= 72) return [210, 210, 210, 255];

  return [bg, bg, bg, 255];
});
fs.writeFileSync(path.join(publicDir, 'avatar-1.png'), avatar1);

// 2. Avatar 2
const avatar2 = createPNG(128, 128, (x, y, w, h) => {
  const dx = x - 64;
  const dy = y - 64;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 62) return [0, 0, 0, 0];
  if (dist > 60) return [220, 220, 220, 160];
  const bg = Math.floor(35 + (dx / 128) * 30);
  
  const headDist = Math.sqrt(dx * dx + (y - 48) * (y - 48));
  if (headDist < 19) return [245, 245, 245, 255];

  const shoulderDist = ((x - 64) * (x - 64)) / (32 * 32) + ((y - 96) * (y - 96)) / (22 * 22);
  if (shoulderDist < 1 && y >= 74) return [225, 225, 225, 255];

  return [bg, bg, bg, 255];
});
fs.writeFileSync(path.join(publicDir, 'avatar-2.png'), avatar2);

// 3. Avatar 3
const avatar3 = createPNG(128, 128, (x, y, w, h) => {
  const dx = x - 64;
  const dy = y - 64;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 62) return [0, 0, 0, 0];
  if (dist > 60) return [255, 255, 255, 200];
  const bg = Math.floor(15 + (dy / 128) * 35);
  
  const headDist = Math.sqrt(dx * dx + (y - 44) * (y - 44));
  if (headDist < 21) return [220, 220, 220, 255];

  const shoulderDist = ((x - 64) * (x - 64)) / (36 * 36) + ((y - 92) * (y - 92)) / (25 * 25);
  if (shoulderDist < 1 && y >= 70) return [200, 200, 200, 255];

  return [bg, bg, bg, 255];
});
fs.writeFileSync(path.join(publicDir, 'avatar-3.png'), avatar3);

// 4. Platform Icon 1: ChatGPT (200x200 monochrome high-tech node)
const iconChatgpt = createPNG(200, 200, (x, y) => {
  const dx = x - 100;
  const dy = y - 100;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Outer subtle dark circle
  if (dist > 94) return [0, 0, 0, 0];
  if (dist > 91) return [45, 45, 45, 255];

  // Dark card background
  let base = 12;
  // Flower of life / ChatGPT rosette geometry simulation
  let petalGlow = 0;
  for (let a = 0; a < 6; a++) {
    const angle = (a * Math.PI) / 3;
    const px = 100 + 32 * Math.cos(angle);
    const py = 100 + 32 * Math.sin(angle);
    const pdist = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
    if (Math.abs(pdist - 28) < 3) petalGlow = 255;
    else if (Math.abs(pdist - 28) < 6) petalGlow = Math.max(petalGlow, 120);
  }
  if (Math.abs(dist - 34) < 3) petalGlow = 255;

  if (petalGlow > 0) {
    return [petalGlow, petalGlow, petalGlow, 255];
  }
  return [base, base, base, 255];
});
fs.writeFileSync(path.join(publicDir, 'icon-chatgpt.png'), iconChatgpt);

// 5. Platform Icon 2: Perplexity (200x200 monochrome asterism / infinite convergence)
const iconPerplexity = createPNG(200, 200, (x, y) => {
  const dx = x - 100;
  const dy = y - 100;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 94) return [0, 0, 0, 0];
  if (dist > 91) return [45, 45, 45, 255];

  let base = 12;
  // Interlocking cross lines / perplexity weave
  const onDiag1 = Math.abs(dx - dy) < 4 && Math.abs(dx) < 45 && Math.abs(dy) < 45;
  const onDiag2 = Math.abs(dx + dy) < 4 && Math.abs(dx) < 45 && Math.abs(dy) < 45;
  const onV = Math.abs(dx) < 4 && Math.abs(dy) < 48;
  const onH = Math.abs(dy) < 4 && Math.abs(dx) < 48;

  const box1 = (Math.abs(dx) < 28 && Math.abs(dy) < 28) && (Math.abs(dx) > 22 || Math.abs(dy) > 22);

  if (onDiag1 || onDiag2 || onV || onH || box1) {
    return [240, 240, 240, 255];
  }
  return [base, base, base, 255];
});
fs.writeFileSync(path.join(publicDir, 'icon-perplexity.png'), iconPerplexity);

// 6. Platform Icon 3: Google AI (200x200 monochrome sparkle / 4-point star)
const iconGoogle = createPNG(200, 200, (x, y) => {
  const dx = Math.abs(x - 100);
  const dy = Math.abs(y - 100);
  const dist = Math.sqrt((x - 100) * (x - 100) + (y - 100) * (y - 100));
  if (dist > 94) return [0, 0, 0, 0];
  if (dist > 91) return [45, 45, 45, 255];

  let base = 12;
  // 4-point sparkle equation: (x^0.5 + y^0.5) < threshold
  const star = Math.sqrt(dx) + Math.sqrt(dy);
  if (star <= 7.2) {
    return [255, 255, 255, 255];
  }
  if (star <= 8.5) {
    return [140, 140, 140, 255];
  }

  // Small secondary star at top-right
  const sdx = Math.abs(x - 145);
  const sdy = Math.abs(y - 65);
  const sStar = Math.sqrt(sdx) + Math.sqrt(sdy);
  if (sStar <= 3.8) {
    return [230, 230, 230, 255];
  }

  return [base, base, base, 255];
});
fs.writeFileSync(path.join(publicDir, 'icon-google.png'), iconGoogle);

console.log('All 6 assets generated successfully!');
