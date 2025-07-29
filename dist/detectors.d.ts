export interface Entity {
    type: string;
    start: number;
    end: number;
    text: string;
    score: number;
    ruleId: string;
}
export declare function detect(text: string): Entity[];
