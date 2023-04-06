import { GlobalState } from "./states/global";
import { PlayerState } from "./states/player";

/**
 * Valid types for changing/mutating state (callback or direct set).
 */
export declare type StateSetter<T> = T | ((oldValue?: T) => T);

/**
 * Checks if the scheme provided is valid.
 *
 * @example
 * ```ts
 * {
 * 	playerState: {
 * 		inventory: State.playerState({
 * 			items: {}
 * 		})
 * 	}
 * }
 * ```
 */
export declare type ValidStateScheme<T extends object> = {
	[K in keyof T]: T[K] extends GlobalState | PlayerState
		? T[K]
		: T[K] extends object
		? ValidStateScheme<T[K]>
		: never;
};
