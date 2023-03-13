import { ValueOrSetter } from "../types/global";
import Signal, { Connection } from "./simple-signal";

type StrictCallback<TReturnType, TParams extends Array<unknown>> = (
	...args: TParams
) => TReturnType;

function toFunction<T, TParams extends Array<unknown>>(
	v: T | StrictCallback<T, TParams>,
): StrictCallback<T, TParams> {
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
