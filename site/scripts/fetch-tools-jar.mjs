#!/usr/bin/env node
// Fetches the JDK 8 tools.jar (javac + friends) that CheerpJ's compile step
// needs, and that CheerpJ itself does not bundle. Kept out of git (18 MB
// third-party binary) and downloaded once per install/build instead.
//
// Source: the CheerpJ vendor's own public demo (leaningtech/javafiddle),
// which ships the same tools.jar for the same purpose.

import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const TOOLS_JAR_URL =
  'https://raw.githubusercontent.com/leaningtech/javafiddle/main/static/tools.jar';

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(here, '..', 'static', 'tools.jar');

if (existsSync(target)) {
  console.log('[fetch-tools-jar] static/tools.jar already present, skipping download.');
  process.exit(0);
}

mkdirSync(path.dirname(target), { recursive: true });

console.log(`[fetch-tools-jar] Downloading ${TOOLS_JAR_URL} -> ${target}`);
const response = await fetch(TOOLS_JAR_URL);
if (!response.ok || !response.body) {
  console.error(`[fetch-tools-jar] Failed to download tools.jar: HTTP ${response.status}`);
  process.exit(1);
}

await pipeline(response.body, createWriteStream(target));
console.log('[fetch-tools-jar] Done.');
