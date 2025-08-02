declare module 'fs';
declare module 'stream';
declare module 'path';
declare module 'https';
declare module 'url';
declare module 'module';
declare var process: any;

declare module 'onnxruntime-node' {
  export class Tensor {
    constructor(type: string, data: any, dims: number[]);
    type: string;
    data: any;
    dims: number[];
  }
  export class InferenceSession {
    static create(path: string): InferenceSession;
    run(feeds: Record<string, Tensor>): any;
  }
}
