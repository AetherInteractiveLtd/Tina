import { ValueOrSetter } from "../types/global";
import Signal, { Connection } from "./simple-signal";

function toFunction<T>(v: ValueOrSetter<T>): (value: T) => T {
	if (typeIs(v, "function")) return v;
	return () => v;
}

export class ObservableValue<T> {
	private signal = new Signal<[T]>();
	private value: T;

	constructor(initialValue: T | (() => T)) {
		// TODO: Support yielding setters (fetch)
		this.value = typeIs(initialValue, "function") ? initialValue() : initialValue;
	}

	public set(value: ValueOrSetter<T>): void {
		const oldValue = this.value;
		this.value = toFunction(value)(oldValue);

		if (this.value !== oldValue) {
			this.signal.Fire(this.value);
		}
	}

	public getValue(): T {
		return this.value;
	}

	public when(observer: (value: T) => void): Connection {
		return this.signal.Connect(observer);
	}

	public destroy(): void {
		this.signal.DisconnectAll();
	}
}
