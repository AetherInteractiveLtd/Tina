/* eslint-disable @typescript-eslint/no-explicit-any */
export type Observer<T> = (value: T) => void;
<<<<<<< HEAD
=======
export type ValueOrFunction<T> = T | ((value: T) => T);
>>>>>>> 5ee74d5 (Added createState to Tina namespace)

export interface UpdateObject<T> {
	name: string;
	value: T;
}

export enum NetworkBoundary {
	Client = "client",
	Server = "server",
}
