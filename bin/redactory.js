#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { Scrubber, loadPolicy, validatePolicy, uploadToAzure } from '../dist/index.js';

function printHelp() {
  console.log('Usage: redactory <command> [args]');
  console.log('Commands: scrub <file> | preview <file> | ingest <dir> | policy validate <file>');
}

async function main() {
  const [cmd, arg1, arg2] = process.argv.slice(2);
  if (!cmd) return printHelp();
  if (cmd === 'policy' && arg1 === 'validate') {
    const policy = loadPolicy(arg2 || 'policy.yaml');
    const errors = validatePolicy(policy);
    if (errors.length) {
      console.error('Policy invalid:', errors.join(', '));
      process.exitCode = 1;
    } else {
      console.log('Policy valid');
    }
    return;
  }
  const policy = loadPolicy('policy.yaml');
  const scrubber = new Scrubber(policy);

  if (cmd === 'scrub' && arg1) {
    const txt = readFileSync(arg1, 'utf8');
    const { result } = scrubber.scrub(txt);
    writeFileSync(arg1, result);
    if (process.env.AZURE_BLOB_SAS_URL) {
      try {
        const url = await uploadToAzure(arg1);
        console.log('Uploaded to', url);
      } catch (err) {
        console.error('Upload failed:', err.message);
      }
    }
    return;
  }
  if (cmd === 'preview' && arg1) {
    const txt = readFileSync(arg1, 'utf8');
    const { diff } = scrubber.scrub(txt, { preview: true });
    console.log(diff);
    return;
  }
  if (cmd === 'ingest' && arg1) {
    const files = readdirSync(arg1);
    for (const f of files) {
      const p = join(arg1, f);
      if (statSync(p).isFile() && ['.txt', '.html', '.json'].includes(extname(p))) {
        const txt = readFileSync(p, 'utf8');
        const { result } = scrubber.scrub(txt);
        writeFileSync(p, result);
        if (process.env.AZURE_BLOB_SAS_URL) {
          try {
            const url = await uploadToAzure(p);
            console.log('Uploaded', f, 'to', url);
          } catch (err) {
            console.error('Upload failed for', f + ':', err.message);
          }
        }
      }
    }
    return;
  }

  printHelp();
}

main();
