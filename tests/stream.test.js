import assert from 'assert/strict';
import { Readable } from 'stream';
import { Scrubber, scrubStream } from '../dist/index.js';

const policy = {
  version: 1,
  entityTypes: ['EMAIL', 'PHONE', 'SSN', 'ICD10'],
  actions: { EMAIL: 'MASK', PHONE: 'MASK', SSN: 'REDACT', ICD10: 'ALLOW' },
  thresholds: { default: 0.7, SSN: 0.9 },
  mask: { char: '*', keepLast: 4 },
  fallback: 'BLOCK',
};

export default async function test() {
  const scrubber = new Scrubber(policy);
  const input = Readable.from(['Contact me at john@example.com or 555-123-4567.']);
  const output = [];
  const stream = scrubStream(input, scrubber);
  for await (const chunk of stream) {
    output.push(chunk.toString());
  }
  const result = output.join('');
  assert.ok(!result.includes('john@example.com'));
  assert.ok(!result.includes('555-123-4567'));
}
