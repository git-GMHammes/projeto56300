/**
 * Removes Gradle incremental caches that contain Windows junctions with
 * \\?\ extended-length path prefixes. Metro's FallbackWatcher crashes
 * (UNKNOWN errno -4094) when it tries to lstat through those junctions.
 * Run automatically via the "start" npm script before Metro launches.
 */
const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '..', 'android', 'app', 'build'),
  path.join(__dirname, '..', 'android', 'build'),
];

for (const dir of targets) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`[clean-build] Removed ${path.relative(process.cwd(), dir)}`);
  }
}
