import { LocalState } from "./local";
import { LocalStateImplementation } from "./local/types";
import { GlobalState } from "./replicated/global";
import { GlobalStateImplementation } from "./replicated/global/types";
import { PlayerState } from "./replicated/player";
import { PlayerStateImplementation } from "./replicated/player/types";
import { InferredSetter } from "./types";

export namespace State {
	let numberOfStates = 0;

	export function namespace(stateTree: object): typeof stateTree {
		return stateTree;
	}

	export function local<T>(initialValue?: InferredSetter<T>): LocalStateImplementation<T> {
		return new LocalState(initialValue);
	}

	export function global<T>(initialValue?: InferredSetter<T>): GlobalStateImplementation<T> {
		const id = ++numberOfStates;

		return new GlobalState(id, initialValue);
	}

	export function player<T>(initialValue?: InferredSetter<T>): PlayerStateImplementation<T> {
		const id = ++numberOfStates;

		return new PlayerState(id, initialValue);
	}
}
