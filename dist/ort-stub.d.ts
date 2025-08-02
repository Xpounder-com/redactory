export declare class Tensor {
    type: string;
    data: any;
    dims: number[];
    constructor(type: string, data: any, dims: number[]);
}
export declare class InferenceSession {
    static create(_path: string): InferenceSession;
    run(feeds: Record<string, Tensor>): {
        logits: Tensor;
    };
}
declare const _default: {
    InferenceSession: typeof InferenceSession;
    Tensor: typeof Tensor;
};
export default _default;
