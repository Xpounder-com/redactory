export class Tensor {
    type;
    data;
    dims;
    constructor(type, data, dims) {
        this.type = type;
        this.data = data;
        this.dims = dims;
    }
}
export class InferenceSession {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static create(_path) {
        return new InferenceSession();
    }
    run(feeds) {
        const input = feeds['input_ids'];
        const ids = Array.from(input.data);
        const num = ids.length;
        const logits = new Float32Array(num * 2);
        for (let i = 0; i < num; i++) {
            const id = Number(ids[i]);
            if (id === 1) {
                logits[i * 2] = 0.1;
                logits[i * 2 + 1] = 0.9;
            }
            else {
                logits[i * 2] = 0.9;
                logits[i * 2 + 1] = 0.1;
            }
        }
        return { logits: new Tensor('float32', logits, [1, num, 2]) };
    }
}
export default { InferenceSession, Tensor };
