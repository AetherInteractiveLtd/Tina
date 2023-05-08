import { EventEmitter } from "../../events";
import { InferredSetter, StateEventEmitter } from "../types";

export declare interface LocalStateImplementation<T> extends EventEmitter<StateEventEmitter<T>> {
	/**
	 * Changes state, notifies all subscriptions.
	 *
	 * @param setter a value or a function.
	 */
	set(setter: InferredSetter<T>): void;

	/**
	 * Returns the value.
	 */
	get(): T;
}
