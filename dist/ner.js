import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let ort;
try {
    ort = require('onnxruntime-node');
}
catch {
    ort = require('./ort-stub.js');
}
const { InferenceSession, Tensor } = ort;
let session = null;
let vocab = {};
export function init(config) {
    if (!fs.existsSync(config.modelPath)) {
        throw new Error(`Model not found at ${config.modelPath}`);
    }
    session = InferenceSession.create(config.modelPath);
    vocab = config.vocab;
}
function tokenize(text) {
    const words = text.split(/\s+/);
    const ids = [];
    const offsets = [];
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
export function detectNER(text) {
    if (!session)
        return [];
    const { ids, offsets } = tokenize(text);
    const tensor = new Tensor('int64', BigInt64Array.from(ids), [1, ids.length]);
    const output = session.run({ input_ids: tensor });
    const logits = output.logits.data;
    const entities = [];
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
