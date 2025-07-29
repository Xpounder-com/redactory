import { readFileSync } from 'fs';
import yaml from 'yaml';

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

// Use the widely adopted `yaml` package for parsing policy files

export function loadPolicy(file: string): Policy {
  const text = readFileSync(file, 'utf8');
  const data = file.endsWith('.json') ? JSON.parse(text) : yaml.parse(text);
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
