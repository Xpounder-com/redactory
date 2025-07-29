const patterns = [
    { type: 'EMAIL', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/g, score: 1, ruleId: 'regex-email' },
    { type: 'PHONE', regex: /\b\d{3}[ -]?\d{3}[ -]?\d{4}\b/g, score: 0.9, ruleId: 'regex-phone' },
    { type: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g, score: 0.95, ruleId: 'regex-ssn' },
    { type: 'ICD10', regex: /[A-TV-Z][0-9][0-9AB](\.[0-9A-TV-Z]{1,4})?/g, score: 0.8, ruleId: 'regex-icd10' }
];
export function detect(text) {
    const entities = [];
    for (const p of patterns) {
        for (const match of text.matchAll(p.regex)) {
            const [value] = match;
            const start = match.index || 0;
            entities.push({
                type: p.type,
                start,
                end: start + value.length,
                text: value,
                score: p.score,
                ruleId: p.ruleId
            });
        }
    }
    return entities.sort((a, b) => a.start - b.start);
}
