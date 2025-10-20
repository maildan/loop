#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Config: list sensitive keys or patterns that MUST NOT appear in renderer output
const SENSITIVE_KEYS = [
  'GEMINI_API_KEY',
  'GH_TOKEN',
  'GITHUB_TOKEN',
  'API_KEY',
  'SECRET',
  'PRIVATE_KEY'
];

const outDir = path.join(__dirname, '..', 'out');
let found = [];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const key of SENSITIVE_KEYS) {
      if (content.includes(key)) {
        found.push({ file: filePath, key });
      }
    }
    // Also look for patterns that look like long API keys (very simple heuristic)
    const longKeyMatch = content.match(/[A-Za-z0-9_\-]{30,}/g);
    if (longKeyMatch) {
      for (const candidate of longKeyMatch) {
        // ignore short harmless tokens
        if (candidate.length > 30) {
          // Avoid flagging common build hashes (very short) - only flag if contains letters and numbers and length > 32
          if (/[A-Za-z]/.test(candidate) && /[0-9]/.test(candidate) && candidate.length > 32) {
            found.push({ file: filePath, key: 'POTENTIAL_LONG_KEY', value: candidate.slice(0, 48) + '...' });
          }
        }
      }
    }
  } catch (err) {
    // ignore binary files
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full);
    } else if (/\.js$|\.html$|\.css$|\.map$|\.json$/i.test(ent.name)) {
      // only scan textual assets
      scanFile(full);
    }
  }
}

// Only scan renderer outputs by default
const rendererOut = path.join(outDir, 'renderer');
if (!fs.existsSync(rendererOut)) {
  console.error('[check-build-secrets] no out/renderer found - scanning full out/ instead');
  walk(outDir);
} else {
  walk(rendererOut);
}

if (found.length > 0) {
  console.error('[check-build-secrets] Potential secret leak detected:');
  for (const f of found) {
    if (f.value) console.error(`  - ${f.file}: ${f.key} -> ${f.value}`);
    else console.error(`  - ${f.file}: ${f.key}`);
  }
  process.exitCode = 2;
} else {
  console.log('[check-build-secrets] OK - no obvious secrets found in renderer output');
}
