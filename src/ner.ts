import fs from 'fs';
import { createRequire } from 'module';
import type { Entity } from './detectors.js';

const require = createRequire(import.meta.url);
let ort: any;
try {
  ort = require('onnxruntime-node');
} catch {
  ort = require('./ort-stub.js');
}

const { InferenceSession, Tensor } = ort;

export interface NERConfig {
  modelPath: string;
  vocab: Record<string, number>;
}

let session: any = null;
let vocab: Record<string, number> = {};

export function init(config: NERConfig): void {
  if (!fs.existsSync(config.modelPath)) {
    throw new Error(`Model not found at ${config.modelPath}`);
  }
  session = InferenceSession.create(config.modelPath);
  vocab = config.vocab;
}

function tokenize(text: string): { ids: bigint[]; offsets: { start: number; end: number }[] } {
  const words = text.split(/\s+/);
  const ids: bigint[] = [];
  const offsets: { start: number; end: number }[] = [];
  let index = 0;
  for (const w of words) {
    const start = text.indexOf(w, index);
    const end = start + w.length;
    ids.push(BigInt(vocab[w.toLowerCase()] ?? 0));
    offsets.push({ start, end });
    index = end + 1;
  }
  return { ids, offsets };
}

export function detectNER(text: string): Entity[] {
  if (!session) return [];
  const { ids, offsets } = tokenize(text);
  const tensor = new Tensor('int64', BigInt64Array.from(ids), [1, ids.length]);
  const output = session.run({ input_ids: tensor });
  const logits: Float32Array = output.logits.data;
  const entities: Entity[] = [];
  for (let i = 0; i < ids.length; i++) {
    const scoreO = logits[i * 2];
    const scoreP = logits[i * 2 + 1];
    if (scoreP > scoreO) {
      const span = offsets[i];
      entities.push({
        type: 'PERSON',
        start: span.start,
        end: span.end,
        text: text.slice(span.start, span.end),
        score: scoreP,
        ruleId: 'onnx-ner',
      });
    }
  }
  return entities;
}

