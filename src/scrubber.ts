import { Policy, loadPolicy } from './policy.js';
import { Entity, detect } from './detectors.js';
import { mask, replaceRange } from './utils.js';

export interface ScrubOptions {
  preview?: boolean;
  explain?: boolean;
}

export interface ScrubResult {
  result: string;
  entities?: Entity[];
  diff?: string;
}

export class Scrubber {
  private policy: Policy;

  constructor(policy: Policy) {
    this.policy = policy;
  }

  static fromFile(path: string): Scrubber {
    const p = loadPolicy(path);
    return new Scrubber(p);
  }

  updatePolicy(policy: Policy): void {
    this.policy = policy;
  }

  scrub(text: string, options: ScrubOptions = {}): ScrubResult {
    const entities = detect(text);
    let result = text;
    let offset = 0;
    const applied: Entity[] = [];
    for (const ent of entities) {
      const threshold = this.policy.thresholds[ent.type] ?? this.policy.thresholds.default;
      if (ent.score < threshold) continue;
      const action = this.policy.actions[ent.type] ?? this.policy.fallback;
      let replacement = ent.text;
      if (action === 'MASK') {
        const maskChar = this.policy.mask?.char ?? '*';
        const keepLast = this.policy.mask?.keepLast ?? 0;
        replacement = mask(ent.text, maskChar, keepLast);
      } else if (action === 'REDACT') {
        replacement = '[REDACTED]';
      } else if (action === 'ALLOW') {
        continue;
      }
      result = replaceRange(result, ent.start + offset, ent.end + offset, replacement);
      offset += replacement.length - (ent.end - ent.start);
      applied.push(ent);
    }

    let diff: string | undefined;
    if (options.preview && result !== text) {
      diff = this.inlineDiff(text, result);
    }

    const res: ScrubResult = { result };
    if (options.explain) res.entities = applied;
    if (diff) res.diff = diff;
    return res;
  }

  private inlineDiff(a: string, b: string): string {
    // simple inline diff by marking removed text as [- -] and added as {+ +}
    let i = 0;
    let result = '';
    while (i < a.length || i < b.length) {
      if (a[i] === b[i]) {
        result += a[i] ?? '';
        i++;
        continue;
      }
      const start = i;
      let endA = start;
      let endB = start;
      while (a[endA] !== b[endB] && (endA < a.length || endB < b.length)) {
        if (a[endA] !== undefined) endA++; if (b[endB] !== undefined) endB++;
        if (a[endA] === b[endB]) break;
      }
      if (start !== endA) result += '[-' + a.slice(start, endA) + '-]';
      if (start !== endB) result += '{+' + b.slice(start, endB) + '+}';
      i = Math.max(endA, endB);
    }
    return result;
  }
}
