import { Transform } from 'stream';
import { Scrubber, ScrubOptions } from './scrubber.js';

export class ScrubTransform extends Transform {
  private scrubber: Scrubber;
  private options: ScrubOptions;

  constructor(scrubber: Scrubber, options: ScrubOptions = {}) {
    super({ objectMode: true });
    this.scrubber = scrubber;
    this.options = options;
  }

  _transform(chunk: any, _enc: any, cb: any) {
    const input = typeof chunk === 'string' ? chunk : chunk.toString();
    const { result } = this.scrubber.scrub(input, this.options);
    this.push(result);
    cb();
  }
}

/**
 * Convenience helper to scrub a readable stream.
 *
 * The returned stream is the result of piping the input through a
 * {@link ScrubTransform} instance.
 */
export function scrubStream(
  stream: any,
  scrubber: Scrubber,
  options: ScrubOptions = {}
): any {
  const transform = new ScrubTransform(scrubber, options);
  return stream.pipe(transform);
}
