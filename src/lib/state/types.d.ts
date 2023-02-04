<<<<<<< HEAD
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
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection } from "../utilities/simple-signal";

export type Observer<T> = (value: T) => void;

export interface INetworkEvent {
	FireClient(player: Player, ...args: Array<any>): void;
	FireAllClients(...args: Array<any>): void;
	FireServer(...args: Array<any>): void;
	OnServerEvent(callback: (player: Player, ...args: Array<any>) => void): Connection;
	OnClientEvent(callback: Callback): Connection;
}
>>>>>>> 7faf04b (Moved common types to types.d.ts)
