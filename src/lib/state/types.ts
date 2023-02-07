/* eslint-disable @typescript-eslint/no-explicit-any */
export type Observer<T> = (value: T) => void;

export interface UpdateObject<T> {
	name: string;
	value: T;
}

export enum NetworkBoundary {
	Client = "client",
	Server = "server",
}
