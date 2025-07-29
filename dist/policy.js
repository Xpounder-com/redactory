import { readFileSync } from 'fs';
function parseYaml(text) {
    const obj = {};
    const lines = text.split(/\r?\n/);
    let currentKey = null;
    for (const line of lines) {
        if (/^\s*$/.test(line))
            continue;
        const m = /^([^:]+):\s*(.*)$/.exec(line);
        if (m) {
            const key = m[1].trim();
            const value = m[2].trim();
            if (value === '') {
                currentKey = key;
                obj[key] = [];
            }
            else if (value.startsWith('[')) {
                obj[key] = JSON.parse(value);
            }
            else if (/^(true|false|\d+)$/.test(value)) {
                obj[key] = JSON.parse(value);
            }
            else {
                obj[key] = value;
            }
            continue;
        }
        const arr = /^\s+-\s*(.*)$/.exec(line);
        if (arr && currentKey) {
            obj[currentKey].push(arr[1].trim());
        }
    }
    return obj;
}
export function loadPolicy(file) {
    const text = readFileSync(file, 'utf8');
    const data = file.endsWith('.json') ? JSON.parse(text) : parseYaml(text);
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
