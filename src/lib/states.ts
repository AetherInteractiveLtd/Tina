import { EventEmitter } from "./events";

class StateEmitter<T extends Enum> extends EventEmitter<{ change: (arg0: T) => void }> {
	constructor() {
		super();
	}

	public emit(_: "change", state: T): Promise<void> {
		return super.emit("change", state);
	}
}

export class State<T extends Enum> {
	private _state: T;
	private readonly _event: StateEmitter<T> = new StateEmitter<T>();

	constructor(initialState: T) {
		this._state = initialState;
	}

	public get(): T {
		return this._state;
	}

	private emit = this._event.emit;

	public set(state: T): Promise<void> {
		this._state = state;
		return this.emit("change", state);
	}

	public when = this._event.when;
}
