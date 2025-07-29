import { readFileSync } from 'fs';
import yaml from 'yaml';
// Use the widely adopted `yaml` package for parsing policy files
export function loadPolicy(file) {
    const text = readFileSync(file, 'utf8');
    const data = file.endsWith('.json') ? JSON.parse(text) : yaml.parse(text);
    return data;
}
export function validatePolicy(policy) {
    const errors = [];
    if (typeof policy.version !== 'number')
        errors.push('version');
    if (!Array.isArray(policy.entityTypes))
        errors.push('entityTypes');
    if (typeof policy.actions !== 'object')
        errors.push('actions');
    if (typeof policy.thresholds !== 'object')
        errors.push('thresholds');
    if (!policy.fallback)
        errors.push('fallback');
    return errors;
}
