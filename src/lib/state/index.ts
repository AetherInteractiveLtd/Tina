import { LocalState } from "./local";
import { StateSetter, ValidStateScheme } from "./types";
import { GlobalState } from "./replicated/global";
import { PlayerState } from "./replicated/player";

export namespace State {
	let states = 0;

	/**
	 * Builds a state tree as specified.
	 *
	 * @param stateTree as an object for the State tree wished to be built.
	 */
	export function build<T extends object, U extends ValidStateScheme<T>>(stateTree: U): U {
		return stateTree;
	}

	/**
	 * Builds LocalState, changes to its value won't be replicated through the network.
	 *
	 * @param value initial value for LocalState.
	 * @returns a LocalState build.
	 */
	export function localState<T>(value: StateSetter<T>): LocalState<T> {
		return new LocalState(value);
	}

	/**
	 * Builds GlobalState, changes to its value will be replicated to every single User on the server.
	 *
	 * @param value initial value for GlobalState.
	 * @returns a GlobalState build.
	 */
	export function globalState<T>(value: StateSetter<T>): GlobalState<T> {
		return new GlobalState(tostring(++states), value);
	}

	/**
	 * Builds PlayerState, changes to its value will be replicated to the specified User (within the `.set()` method).
	 *
	 * @param value initial value for PlayerState.
	 * @returns a PlayerState build.
	 */
	export function playerState<T>(value: StateSetter<T>): PlayerState<T> {
		return new PlayerState(tostring(++states), value);
	}
}
