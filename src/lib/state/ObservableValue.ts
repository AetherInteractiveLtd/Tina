import Signal, { Connection } from "../utilities/simple-signal";

export class ObservableValue<T> {
	private signal = new Signal<[T]>();
	private value: T;

	constructor(initialValue: T | (() => T)) {
		// TODO: Support yielding setters (fetch)
		this.value = typeIs(initialValue, "function") ? initialValue() : initialValue;
	}

	public set(value: T): void {
		this.value = value;
		this.signal.Fire(value);
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
