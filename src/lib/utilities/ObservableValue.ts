import { ValueOrSetter } from "../types/global";
import Signal, { Connection } from "./simple-signal";

function toSetter<T>(v: ValueOrSetter<T>): (value: T) => T {
	return typeIs(v, "function") ? v : () => v;
}

function toFunction<T>(v: T | (() => T)): () => T {
	return typeIs(v, "function") ? v : () => v;
}

export class ObservableValue<T> {
	private signal = new Signal<[T]>();
	private value: T;

	constructor(initialValue: T | (() => T)) {
		this.value = toFunction(initialValue)();
	}

	public set(value: ValueOrSetter<T>): void {
		const oldValue = this.value;
		this.value = toSetter(value)(oldValue);

		if (this.value !== oldValue) {
			this.signal.Fire(this.value);
		}
	}

	public getValue(): T {
		return this.value;
	}

	public subscribe(observer: (value: T) => void): Connection {
		return this.signal.Connect(observer);
	}

	public destroy(): void {
		this.signal.DisconnectAll();
	}
}
