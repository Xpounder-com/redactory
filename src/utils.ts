export function mask(value: string, char: string, keepLast: number = 0): string {
  if (value.length <= keepLast) {
    return char.repeat(value.length);
  }
  const maskedLength = value.length - keepLast;
  return char.repeat(maskedLength) + value.slice(value.length - keepLast);
}

export function replaceRange(text: string, start: number, end: number, replacement: string): string {
  return text.slice(0, start) + replacement + text.slice(end);
}
