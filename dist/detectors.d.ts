export interface Entity {
    type: string;
    start: number;
    end: number;
    text: string;
    score: number;
    ruleId: string;
}
export interface DetectorConfig {
    ner?: {
        modelPath: string;
        vocab: Record<string, number>;
    };
}
export declare function configureDetectors(config: DetectorConfig): void;
export declare function detect(text: string): Entity[];
