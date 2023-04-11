import { GlobalState } from "./states/global";
import { PlayerState } from "./states/player";
import { StateSetter, ValidStateScheme } from "./types";

export namespace State {
	let states = 0;

	export function build<T extends object, U extends ValidStateScheme<T>>(state: U): U {
		return state;
	}

	export function globalState<T>(value: StateSetter<T>): GlobalState<T> {
		return new GlobalState(tostring(++states), value);
	}

	export function playerState<T>(value: StateSetter<T>): PlayerState<T> {
		return new PlayerState(tostring(++states), value);
	}
}
