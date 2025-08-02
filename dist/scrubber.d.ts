import { Policy } from './policy.js';
import { Entity, DetectorConfig } from './detectors.js';
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
    private detectorConfig;
    constructor(policy: Policy, detectorConfig?: DetectorConfig);
    static fromFile(path: string, detectorConfig?: DetectorConfig): Scrubber;
    updatePolicy(policy: Policy): void;
    scrub(text: string, options?: ScrubOptions): ScrubResult;
    private inlineDiff;
}
