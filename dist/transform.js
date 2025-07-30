import { Transform } from 'stream';
export class ScrubTransform extends Transform {
    scrubber;
    options;
    constructor(scrubber, options = {}) {
        super({ objectMode: true });
        this.scrubber = scrubber;
        this.options = options;
    }
    _transform(chunk, _enc, cb) {
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
export function scrubStream(stream, scrubber, options = {}) {
    const transform = new ScrubTransform(scrubber, options);
    return stream.pipe(transform);
}
