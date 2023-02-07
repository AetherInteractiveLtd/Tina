import { StateOptions } from "../createState";
import { GlobalState } from "../states/GlobalState";
import { PlayerState } from "../states/PlayerState";

export function isStateConfig(value: unknown): value is StateConfig<unknown> {
	return value instanceof StateConfig;
}

type StateConfigOptions = Required<StateOptions>;

export abstract class StateConfig<T> {
	constructor(public initialValue: T) {}
	public abstract build(name: string, options: StateConfigOptions): unknown;
}

export class GlobalStateConfig<T = unknown> extends StateConfig<T> {
	public build(name: string, options: StateConfigOptions): GlobalState<T> {
		const { remote, boundary } = options;
		return new GlobalState(name, this.initialValue, remote, boundary);
	}
}

export class PlayerStateConfig<T = unknown> extends StateConfig<T> {
	public build(name: string, options: StateConfigOptions): PlayerState<T> {
		const { remote, boundary } = options;
		return new PlayerState(name, this.initialValue, remote, boundary);
	}
}
