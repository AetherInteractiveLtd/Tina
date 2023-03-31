import { GlobalState } from "./states/global";
import { PlayerState } from "./states/player";

export declare type StateSetter<T> = T | ((oldValue?: T) => T);

export declare type ValidStateScheme<T extends object> = {
	[K in keyof T]: T[K] extends GlobalState | PlayerState
		? T[K]
		: T[K] extends object
		? ValidStateScheme<T[K]>
		: never;
};
