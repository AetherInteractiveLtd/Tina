export type TEventToken<T> = Extract<keyof T, string | symbol>;

export type TInferParameters<T> = T extends (...args: infer P) => unknown ? P : unknown[];
export type TInferReturn<T> = T extends (...args: never) => infer R ? R : void;

export interface IBaseEvents {}
