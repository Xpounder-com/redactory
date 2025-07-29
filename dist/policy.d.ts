export interface Policy {
    version: number;
    entityTypes: string[];
    actions: Record<string, 'MASK' | 'REDACT' | 'ALLOW'>;
    thresholds: {
        default: number;
        [key: string]: number;
    };
    mask?: {
        char: string;
        keepLast: number;
    };
    fallback: 'BLOCK' | 'ALLOW' | 'MASK' | 'REDACT';
}
export declare function loadPolicy(file: string): Policy;
export declare function validatePolicy(policy: Policy): string[];
