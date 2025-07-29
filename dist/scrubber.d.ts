import { Policy } from './policy.js';
import { Entity } from './detectors.js';
export interface ScrubOptions {
    preview?: boolean;
    explain?: boolean;
}
export interface ScrubResult {
    result: string;
    entities?: Entity[];
    diff?: string;
}
export declare class Scrubber {
    private policy;
    constructor(policy: Policy);
    static fromFile(path: string): Scrubber;
    updatePolicy(policy: Policy): void;
    scrub(text: string, options?: ScrubOptions): ScrubResult;
    private inlineDiff;
}
