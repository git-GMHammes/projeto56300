// Converte bootstrap-icons.woff → bootstrap-icons.ttf
// WOFF = TTF/OTF com header próprio e tabelas opcionalmente comprimidas com zlib.
const fs   = require('fs');
const zlib = require('zlib');
const path = require('path');

const src = path.resolve(__dirname, '../node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff');
const dst = path.resolve(__dirname, '../android/app/src/main/assets/fonts/bootstrap-icons.ttf');

const woff = fs.readFileSync(src);

const signature  = woff.readUInt32BE(0);  // 0x774F4646 = 'wOFF'
const flavor     = woff.readUInt32BE(4);  // 0x00010000 = TrueType
const numTables  = woff.readUInt16BE(12);

// Lê diretório de tabelas WOFF (20 bytes cada, a partir do byte 44)
const tables = [];
for (let i = 0; i < numTables; i++) {
  const base = 44 + i * 20;
  tables.push({
    tag:          woff.toString('ascii', base, base + 4),
    offset:       woff.readUInt32BE(base + 4),
    compLength:   woff.readUInt32BE(base + 8),
    origLength:   woff.readUInt32BE(base + 12),
    origChecksum: woff.readUInt32BE(base + 16),
  });
}

// Calcula offsets TTF (tabelas alinhadas a 4 bytes, após o header sfnt)
const sfntHeaderSize = 12 + numTables * 16;
let cursor = sfntHeaderSize;
const ttfTables = tables.map(t => {
  const result = { ...t, ttfOffset: cursor };
  cursor += (t.origLength + 3) & ~3;
  return result;
});

const ttf = Buffer.alloc(cursor, 0);

// Escreve header sfnt
const exp         = Math.floor(Math.log2(numTables));
const searchRange = (1 << exp) * 16;
ttf.writeUInt32BE(flavor, 0);
ttf.writeUInt16BE(numTables,           4);
ttf.writeUInt16BE(searchRange,         6);
ttf.writeUInt16BE(exp,                 8);
ttf.writeUInt16BE(numTables * 16 - searchRange, 10);

// Escreve diretório de tabelas TTF e dados
ttfTables.forEach((t, i) => {
  const dir = 12 + i * 16;
  ttf.write(t.tag, dir, 'ascii');
  ttf.writeUInt32BE(t.origChecksum, dir + 4);
  ttf.writeUInt32BE(t.ttfOffset,    dir + 8);
  ttf.writeUInt32BE(t.origLength,   dir + 12);

  const raw = woff.slice(t.offset, t.offset + t.compLength);
  const data = (t.compLength !== t.origLength) ? zlib.inflateSync(raw) : raw;
  data.copy(ttf, t.ttfOffset);
});

fs.writeFileSync(dst, ttf);
console.log(`OK: ${dst} (${ttf.length} bytes)`);
