/**
 * Removes Gradle incremental caches that contain Windows junctions with
 * \\?\ extended-length path prefixes. Metro's FallbackWatcher crashes
 * (UNKNOWN errno -4094) when it tries to lstat through those junctions.
 * Run automatically via the "start" npm script before Metro launches.
 *
 * Also runs `adb reverse tcp:8081 tcp:8081` so Metro reconnects automatically
 * whenever the emulator is already running at startup time.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Kill any process already using port 8081 (Metro anterior)
try {
  const netstat = execSync('netstat -ano', { encoding: 'utf8' });
  const pids = new Set();
  for (const line of netstat.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 5 && parts[1].endsWith(':8081') && parts[3] === 'LISTENING') {
      pids.add(parts[4]);
    }
  }
  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      console.log(`[clean-build] Killed processo na porta 8081 (PID ${pid})`);
    } catch {}
  }
} catch {}

// Remove Gradle incremental caches (Windows junctions com \\?\ travam o FallbackWatcher)
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

// Configura o tunel adb para o emulador ja estiver no ar
try {
  execSync('adb reverse tcp:8081 tcp:8081', { stdio: 'inherit' });
  console.log('[clean-build] adb reverse tcp:8081 tcp:8081 OK');
} catch {
  console.warn('[clean-build] adb reverse falhou — emulador ainda nao esta pronto. Execute manualmente apos o boot.');
}
