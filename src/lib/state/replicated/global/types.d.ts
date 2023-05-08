import { InferredSetter } from "../../types";

export declare interface GlobalStateImplementation<T> {
	/**
	 * Replicates state through the network, fires all subscriptions and updates its value.
	 *
	 * @param setter a value or a function.
	 */
	set(setter: InferredSetter<T>): void;

	/**
	 * Returns the value.
	 */
	get(): T;
}
