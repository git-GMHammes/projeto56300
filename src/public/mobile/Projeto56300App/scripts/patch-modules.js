/**
 * Patches applied after every `npm install` (postinstall hook):
 *
 * 1. Removes `codegenConfig` from native packages that generate heavy Fabric
 *    C++ codegen, causing LLVM OOM errors on machines with limited RAM.
 *
 * 2. Patches metro-file-map FallbackWatcher to treat UNKNOWN lstat errors as
 *    ignorable. On Windows, Gradle creates junctions with \\?\ extended-length
 *    path prefixes; Node.js lstat through those junctions returns UNKNOWN
 *    (errno -4094), crashing Metro's file crawl and hanging the bundler.
 */
const fs = require('fs');
const path = require('path');

// ── Patch 1: remove codegenConfig from heavy native packages ─────────────────
const CODEGEN_PATCHES = [
  '@react-native-async-storage/async-storage',
];

for (const pkg of CODEGEN_PATCHES) {
  const pkgJsonPath = path.join(__dirname, '..', 'node_modules', pkg, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;

  const json = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  if (!json.codegenConfig) continue;

  delete json.codegenConfig;
  fs.writeFileSync(pkgJsonPath, JSON.stringify(json, null, 2));
  console.log(`[patch-modules] Removed codegenConfig from ${pkg}`);
}

// ── Patch 2: FallbackWatcher — ignore UNKNOWN lstat errors on Windows ─────────
const fallbackWatcherPath = path.join(
  __dirname, '..', 'node_modules', 'metro-file-map', 'src', 'watchers', 'FallbackWatcher.js',
);

if (fs.existsSync(fallbackWatcherPath)) {
  let src = fs.readFileSync(fallbackWatcherPath, 'utf8');
  const OLD = 'error.code === "ENOENT" || (error.code === "EPERM" && platform === "win32")';
  const NEW = 'error.code === "ENOENT" ||\n    error.code === "UNKNOWN" ||\n    (error.code === "EPERM" && platform === "win32")';
  if (src.includes(OLD)) {
    fs.writeFileSync(fallbackWatcherPath, src.replace(OLD, NEW));
    console.log('[patch-modules] Patched metro-file-map FallbackWatcher (UNKNOWN lstat)');
  }
}
