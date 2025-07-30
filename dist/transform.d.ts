import { Transform } from 'stream';
import { Scrubber, ScrubOptions } from './scrubber.js';
export declare class ScrubTransform extends Transform {
    private scrubber;
    private options;
    constructor(scrubber: Scrubber, options?: ScrubOptions);
    _transform(chunk: any, _enc: any, cb: any): void;
}
/**
 * Convenience helper to scrub a readable stream.
 *
 * The returned stream is the result of piping the input through a
 * {@link ScrubTransform} instance.
 */
export declare function scrubStream(stream: any, scrubber: Scrubber, options?: ScrubOptions): any;
