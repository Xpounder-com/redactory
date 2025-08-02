import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import { Scrubber } from '../dist/index.js';

export default function test() {
  const modelPath = fileURLToPath(new URL('./fixtures/ner-stub.onnx', import.meta.url));
  const policy = {
    version: 1,
    entityTypes: ['PERSON'],
    actions: { PERSON: 'REDACT' },
    thresholds: { default: 0.5 },
    fallback: 'ALLOW',
  };
  const scrubber = new Scrubber(policy, {
    ner: { modelPath, vocab: { alice: 1 } },
  });
  const { result, entities } = scrubber.scrub('Alice met Bob.', { explain: true });
  assert.ok(result.startsWith('[REDACTED]'));
  assert.ok(!result.includes('Alice'));
  assert.equal(entities?.length, 1);
  assert.equal(entities?.[0].type, 'PERSON');
}

