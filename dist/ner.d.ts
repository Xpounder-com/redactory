import type { Entity } from './detectors.js';
export interface NERConfig {
    modelPath: string;
    vocab: Record<string, number>;
}
export declare function init(config: NERConfig): void;
export declare function detectNER(text: string): Entity[];
