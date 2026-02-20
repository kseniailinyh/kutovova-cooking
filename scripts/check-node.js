#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const missingMessage =
  'Node.js/npm were not found. Install Node LTS from https://nodejs.org, then restart Cursor and run the task again.';

if (!process.versions?.node) {
  console.error(missingMessage);
  process.exit(1);
}

const npmCheck = spawnSync('npm', ['--version'], { encoding: 'utf8' });
if (npmCheck.error || npmCheck.status !== 0) {
  console.error(missingMessage);
  process.exit(1);
}

console.log(`Node ${process.versions.node}, npm ${npmCheck.stdout.trim()} detected.`);
