import { EventListener } from "../../events";
import { StateSetter } from "../types";

export declare interface LocalStateImplementation<T extends object> {
	/**
	 * Changes state, notifies all subscriptions.
	 *
	 * @param setter a value or a function.
	 */
	set(setter: StateSetter<T>): void;

	/**
	 * Returns an event listener to which you can bind callback functions to hear for mutations (changes) on state.
	 */
	subscribe(): EventListener<[T]>;

	/**
	 * Returns the value.
	 */
	get(): T;
}
