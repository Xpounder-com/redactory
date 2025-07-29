import assert from 'assert/strict';
import { readFileSync } from 'fs';
import { Scrubber } from '../dist/index.js';

const policy = {
  version: 1,
  entityTypes: ['EMAIL', 'PHONE', 'SSN', 'ICD10'],
  actions: { EMAIL: 'MASK', PHONE: 'MASK', SSN: 'REDACT', ICD10: 'ALLOW' },
  thresholds: { default: 0.7, SSN: 0.9 },
  mask: { char: '*', keepLast: 4 },
  fallback: 'BLOCK'
};

const scrubber = new Scrubber(policy);

export default function test() {
  const text = readFileSync('synthetic-data/sample.txt', 'utf8');
  const { result } = scrubber.scrub(text);
  assert.ok(!result.includes('jane.doe@example.com'));
  assert.ok(!result.includes('222-333-4444'));
  assert.ok(!result.includes('987-65-4321'));
  assert.ok(!result.includes('john.smith@demo.co'));
  assert.ok(result.includes('[REDACTED]'));
}
