export function mask(value, char, keepLast = 0) {
    if (value.length <= keepLast) {
        return char.repeat(value.length);
    }
    const maskedLength = value.length - keepLast;
    return char.repeat(maskedLength) + value.slice(value.length - keepLast);
}
export function replaceRange(text, start, end, replacement) {
    return text.slice(0, start) + replacement + text.slice(end);
}
