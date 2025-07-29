import { Transform } from 'stream';
import { Scrubber, ScrubOptions } from './scrubber.js';
export declare class ScrubTransform extends Transform {
    private scrubber;
    private options;
    constructor(scrubber: Scrubber, options?: ScrubOptions);
    _transform(chunk: any, _enc: any, cb: any): void;
}
