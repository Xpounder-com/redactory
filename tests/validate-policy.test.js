import assert from 'assert/strict';
import { validatePolicy } from '../dist/index.js';

export default function test() {
  const valid = {
    version: 1,
    entityTypes: ['EMAIL'],
    actions: { EMAIL: 'MASK' },
    thresholds: { default: 0.5 },
    mask: { char: '*', keepLast: 2 },
    fallback: 'REDACT'
  };
  assert.deepEqual(validatePolicy(valid), []);

  const invalid = { entityTypes: 'EMAIL' };
  const errors = validatePolicy(invalid);
  assert.ok(errors.includes('version'));
  assert.ok(errors.includes('entityTypes'));
  assert.ok(errors.includes('actions'));
  assert.ok(errors.includes('thresholds'));
  assert.ok(errors.includes('fallback'));
}
