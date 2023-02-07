<<<<<<< HEAD:src/lib/util/ObservableValue.ts
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

=======
import Signal, { Connection } from "./simple-signal";

>>>>>>> 5ee74d5 (Added createState to Tina namespace):src/lib/utilities/ObservableValue.ts
export class ObservableValue<T> {
	private signal = new Signal<[T]>();
	private value: T;

	constructor(initialValue: T | (() => T)) {
<<<<<<< HEAD:src/lib/util/ObservableValue.ts
		this.value = toFunction(initialValue)();
	}

	public set(value: ValueOrSetter<T>): void {
		const oldValue = this.value;
		this.value = toFunction(value)(oldValue);

		if (this.value !== oldValue) {
			this.signal.Fire(this.value);
		}
=======
		// TODO: Support yielding setters (fetch)
		this.value = typeIs(initialValue, "function") ? initialValue() : initialValue;
	}

	public set(value: T): void {
		if (this.value === value) return;
		this.value = value;
		this.signal.Fire(value);
>>>>>>> 5ee74d5 (Added createState to Tina namespace):src/lib/utilities/ObservableValue.ts
	}

	public getValue(): T {
		return this.value;
	}

<<<<<<< HEAD:src/lib/util/ObservableValue.ts
	public when(observer: (value: T) => void): Connection {
=======
	public subscribe(observer: (value: T) => void): Connection {
>>>>>>> 5ee74d5 (Added createState to Tina namespace):src/lib/utilities/ObservableValue.ts
		return this.signal.Connect(observer);
	}

	public destroy(): void {
		this.signal.DisconnectAll();
	}
}
