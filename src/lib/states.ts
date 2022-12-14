import { EventEmitter } from "./events";

export class State<T extends Enum> extends EventEmitter<{ _default: (t: T) => void }> {
	private _state: T;

	constructor(value: T) {
		super();
		this._state = value;
	}

	public get(): T {
		return this._state;
	}

	public set(newState: T): Promise<void> {
		this._state = newState;
		return this.emit("_default", newState);
	}
}
