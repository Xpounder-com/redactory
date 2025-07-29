import { readFileSync } from 'fs';
// Custom minimal YAML parser to avoid external dependencies
function parseSimpleYAML(text: string): any {
  const result: any = {};
  const stack: any[] = [result];
  const indentStack: number[] = [0];
  let currentKey: string | null = null;

  function parseScalar(str: string): any {
    const unquoted = str.replace(/^\"|\"$/g, '');
    if (str === 'true') return true;
    if (str === 'false') return false;
    if (str === 'null') return null;
    const num = Number(unquoted);
    return isNaN(num) ? unquoted : num;
  }

  for (const rawLine of text.split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) continue;
    const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
    while (indent < indentStack[indentStack.length - 1]) {
      stack.pop();
      indentStack.pop();
    }
    const line = rawLine.trim();
    if (line.startsWith('- ')) {
      if (!currentKey) continue;
      const arr = stack[stack.length - 1][currentKey] || [];
      arr.push(parseScalar(line.slice(2)));
      stack[stack.length - 1][currentKey] = arr;
      continue;
    }
    const [keyPart, rest] = line.split(/:(.*)/);
    currentKey = keyPart.trim();
    if (rest && rest.trim() !== '') {
      stack[stack.length - 1][currentKey] = parseScalar(rest.trim());
    } else {
      const obj: any = {};
      stack[stack.length - 1][currentKey] = obj;
      stack.push(obj);
      indentStack.push(indent + 2);
    }
  }

  return result;
}

export interface Policy {
  version: number;
  entityTypes: string[];
  actions: Record<string, 'MASK' | 'REDACT' | 'ALLOW'>;
  thresholds: {
    default: number;
    [key: string]: number;
  };
  mask?: {
    char: string;
    keepLast: number;
  };
  fallback: 'BLOCK' | 'ALLOW' | 'MASK' | 'REDACT';
}

export function loadPolicy(file: string): Policy {
  const text = readFileSync(file, 'utf8');
  const data = file.endsWith('.json') ? JSON.parse(text) : parseSimpleYAML(text);
  return data as Policy;
}

export function validatePolicy(policy: Policy): string[] {
  const errors: string[] = [];
  if (typeof policy.version !== 'number') errors.push('version');
  if (!Array.isArray(policy.entityTypes)) errors.push('entityTypes');
  if (typeof policy.actions !== 'object') errors.push('actions');
  if (typeof policy.thresholds !== 'object') errors.push('thresholds');
  if (!policy.fallback) errors.push('fallback');
  return errors;
}
