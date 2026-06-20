import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const inputDir = path.join(root, 'public', 'annual-report');
const outputDir = path.join(root, 'public', 'annual-report', 'clean');

const files = [
  'hero-cafe-vignette.png',
  'mascot-value-seekers.png',
  'mascot-balanced-buyers.png',
  'mascot-premium-loyalists.png',
  'cafe-interior-frieze.png',
];

const edgeBand = 12;
const checkerDistance = 72;

function colorDistance(data, index, color) {
  const dr = data[index] - color.r;
  const dg = data[index + 1] - color.g;
  const db = data[index + 2] - color.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function isLowSaturation(data, index) {
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  return Math.max(r, g, b) - Math.min(r, g, b) <= 42;
}

function quantizedKey(data, index) {
  const q = 6;
  return [
    Math.round(data[index] / q) * q,
    Math.round(data[index + 1] / q) * q,
    Math.round(data[index + 2] / q) * q,
  ].join(',');
}

function parseKey(key) {
  const [r, g, b] = key.split(',').map(Number);
  return { r, g, b };
}

function getBackgroundColors(data, width, height) {
  const counts = new Map();
  const collect = (x, y) => {
    const index = (y * width + x) * 4;
    if (data[index + 3] < 245 || !isLowSaturation(data, index)) return;
    const key = quantizedKey(data, index);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < edgeBand; x += 1) collect(x, y);
    for (let x = width - edgeBand; x < width; x += 1) collect(x, y);
  }
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < edgeBand; y += 1) collect(x, y);
    for (let y = height - edgeBand; y < height; y += 1) collect(x, y);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([key]) => parseKey(key));
}

function isFloodBackground(data, index, colors) {
  if (data[index + 3] < 245) return true;
  if (!isLowSaturation(data, index)) return false;
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const luma = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);

  // The supplied images have a baked transparent-checker preview. Remove the
  // border-connected checker grays, but keep the lighter paper and character fills.
  return luma >= 92 && luma <= 218 && colors.some((color) => colorDistance(data, index, color) <= checkerDistance);
}

function removeConnectedBackground(data, width, height, colors) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = [];

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    const index = pixel * 4;
    if (!isFloodBackground(data, index, colors)) return;
    visited[pixel] = 1;
    queue.push(pixel);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let head = 0; head < queue.length; head += 1) {
    const pixel = queue[head];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  for (let pixel = 0; pixel < total; pixel += 1) {
    if (visited[pixel]) data[pixel * 4 + 3] = 0;
  }
}

function clearGeneratedWatermark(data, width, height, file) {
  if (file === 'hero-cafe-vignette.png') {
    const startX = Math.floor(width * 0.8);
    for (let y = 0; y < height; y += 1) {
      for (let x = startX; x < width; x += 1) {
        data[(y * width + x) * 4 + 3] = 0;
      }
    }
    return;
  }

  const mascotFiles = new Set([
    'mascot-value-seekers.png',
    'mascot-balanced-buyers.png',
    'mascot-premium-loyalists.png',
  ]);

  if (mascotFiles.has(file)) {
    const startX = Math.floor(width * 0.84);
    const startY = Math.floor(height * 0.72);
    for (let y = startY; y < height; y += 1) {
      for (let x = startX; x < width; x += 1) {
        data[(y * width + x) * 4 + 3] = 0;
      }
    }
    return;
  }

  if (file !== 'cafe-interior-frieze.png') return;

  const startX = Math.floor(width * 0.9);
  const endX = Math.floor(width * 0.975);
  const startY = Math.floor(height * 0.84);
  for (let y = startY; y < height; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      data[(y * width + x) * 4 + 3] = 0;
    }
  }
}

function removeSmallBottomRightComponents(data, width, height) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = [];

  for (let pixel = 0; pixel < total; pixel += 1) {
    if (visited[pixel] || data[pixel * 4 + 3] === 0) continue;

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    const pixels = [];
    visited[pixel] = 1;
    queue.length = 0;
    queue.push(pixel);

    for (let head = 0; head < queue.length; head += 1) {
      const current = queue[head];
      pixels.push(current);
      const x = current % width;
      const y = Math.floor(current / width);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      const add = (next) => {
        if (next < 0 || next >= total || visited[next] || data[next * 4 + 3] === 0) return;
        visited[next] = 1;
        queue.push(next);
      };

      if (x > 0) add(current - 1);
      if (x < width - 1) add(current + 1);
      if (y > 0) add(current - width);
      if (y < height - 1) add(current + width);
    }

    const bottomRightArtifact =
      pixels.length < 20000 &&
      minX > width * 0.72 &&
      minY > height * 0.62 &&
      maxX > width * 0.82 &&
      maxY > height * 0.74;

    if (bottomRightArtifact) {
      for (const componentPixel of pixels) {
        data[componentPixel * 4 + 3] = 0;
      }
    }
  }
}

function boundsOfOpaque(data, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX < minX || maxY < minY) return { left: 0, top: 0, width, height };
  const pad = 8;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const right = Math.min(width - 1, maxX + pad);
  const bottom = Math.min(height - 1, maxY + pad);
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

await fs.mkdir(outputDir, { recursive: true });

for (const file of files) {
  const input = path.join(inputDir, file);
  const output = path.join(outputDir, file);
  const image = sharp(input).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const colors = getBackgroundColors(data, info.width, info.height);
  removeConnectedBackground(data, info.width, info.height, colors);
  clearGeneratedWatermark(data, info.width, info.height, file);
  removeSmallBottomRightComponents(data, info.width, info.height);
  const bounds = boundsOfOpaque(data, info.width, info.height);

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .extract(bounds)
    .png({ compressionLevel: 9 })
    .toFile(output);

  const metadata = await sharp(output).metadata();
  console.log(`${file}: ${info.width}x${info.height} -> ${metadata.width}x${metadata.height}`);
}
