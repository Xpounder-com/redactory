import { readFileSync } from 'fs';
// Custom minimal YAML parser to avoid external dependencies
function parseSimpleYAML(text) {
    const result = {};
    const stack = [result];
    const indentStack = [0];
    let currentKey = null;
    function parseScalar(str) {
        const unquoted = str.replace(/^\"|\"$/g, '');
        if (str === 'true')
            return true;
        if (str === 'false')
            return false;
        if (str === 'null')
            return null;
        const num = Number(unquoted);
        return isNaN(num) ? unquoted : num;
    }
    for (const rawLine of text.split(/\r?\n/)) {
        if (!rawLine.trim() || rawLine.trimStart().startsWith('#'))
            continue;
        const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
        while (indent < indentStack[indentStack.length - 1]) {
            stack.pop();
            indentStack.pop();
        }
        const line = rawLine.trim();
        if (line.startsWith('- ')) {
            if (!currentKey)
                continue;
            const arr = stack[stack.length - 1][currentKey] || [];
            arr.push(parseScalar(line.slice(2)));
            stack[stack.length - 1][currentKey] = arr;
            continue;
        }
        const [keyPart, rest] = line.split(/:(.*)/);
        currentKey = keyPart.trim();
        if (rest && rest.trim() !== '') {
            stack[stack.length - 1][currentKey] = parseScalar(rest.trim());
        }
        else {
            const obj = {};
            stack[stack.length - 1][currentKey] = obj;
            stack.push(obj);
            indentStack.push(indent + 2);
        }
    }
    return result;
}
export function loadPolicy(file) {
    const text = readFileSync(file, 'utf8');
    const data = file.endsWith('.json') ? JSON.parse(text) : parseSimpleYAML(text);
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
