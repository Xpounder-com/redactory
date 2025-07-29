import assert from 'assert/strict';
import { spawnSync } from 'child_process';
import { mkdtempSync, writeFileSync, copyFileSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export default function test() {
  const tmpDir = mkdtempSync(join(tmpdir(), 'redactory-'));
  try {
    // policy validate with valid policy
    let res = spawnSync('node', ['bin/redactory.js', 'policy', 'validate', 'policy.yaml'], { encoding: 'utf8' });
    assert.equal(res.status, 0);
    assert.ok(res.stdout.includes('Policy valid'));

    // policy validate with invalid policy
    const invalidPath = join(tmpDir, 'invalid.json');
    writeFileSync(invalidPath, JSON.stringify({ version: '1' }));
    res = spawnSync('node', ['bin/redactory.js', 'policy', 'validate', invalidPath], { encoding: 'utf8' });
    assert.notEqual(res.status, 0);
    assert.ok(res.stderr.includes('Policy invalid'));

    // scrub command modifies file in place
    const filePath = join(tmpDir, 'sample.txt');
    copyFileSync('synthetic-data/sample.txt', filePath);
    res = spawnSync('node', ['bin/redactory.js', 'scrub', filePath], { encoding: 'utf8' });
    assert.equal(res.status, 0);
    const scrubbed = readFileSync(filePath, 'utf8');
    assert.ok(!scrubbed.includes('jane.doe@example.com'));
    assert.ok(scrubbed.includes('[REDACTED]'));
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}
