import { CrossBoundaryState } from "../cross-boundary-state";
import { GlobalState } from "../global-state";
import { PlayerState } from "../player-state";
import { formatPath } from "../utilities/formatPath";
import { getOrCreateRemote } from "../utilities/helper";

export abstract class StateConfig<T> {
	constructor(public initialValue: T) { }
	public abstract build(parent: Instance, path: Array<string>): CrossBoundaryState;
}

export class GlobalStateConfig<T = unknown> extends StateConfig<T> {
	public build(parent: Instance, path: Array<string>): GlobalState<T> {
		const remote = getOrCreateRemote(formatPath(path), parent);
		return new GlobalState(this.initialValue, remote);
	}
}

export class PlayerStateConfig<T> extends StateConfig<T> {
	public build(parent: Instance, path: Array<string>): PlayerState<T> {
		const remote = getOrCreateRemote(formatPath(path), parent);
		return new PlayerState(this.initialValue, remote);
	}
}
