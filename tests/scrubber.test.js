import assert from 'assert/strict';
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
  const text = 'Contact me at john@example.com or 555-123-4567. SSN 123-45-6789.';
  const { result } = scrubber.scrub(text);
  assert.ok(!result.includes('john@example.com'));
  assert.ok(!result.includes('555-123-4567'));
  assert.ok(result.includes('[REDACTED]'));
}
