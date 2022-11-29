import { EventListener } from "../../../events";
import { User } from "../../../user/user";

export interface GETServerObjectDeclaration<R, S> {
	/**
	 * Should be the callback defined on the declaration.
	 *
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").reply((user: never, ...args: [n: number]) => { ... });
	 * ```
	 *
	 * @server
	 * @param func should describe the listener function to add as a callback for the reply, the return type is the expected type at the receiving end.
	 */
	reply(func: (user: User & unknown, value: R) => S): void;
}

export interface GETClientObjectDeclaration<S, R> {
	/**
	 * You can send data for the server to manipulate it/use it, and send it back if needed with `.send()`. If you just want to retrieve data, use `.get()` instead.
	 *
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").send(value: S); // The events emit is done here.
	 * ```
	 *
	 * @client
	 * @param toSend should be the value to send to the server.
	 */
	send(toSend: S): void;

	/**
	 * Used to retrieve data without caring about any data required to be sent.
	 *
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").get(); // The events emit is done here.
	 * ```
	 *
	 * @client
	 */
	get(): void;

	/**
	 * Returns an event listener used to bind actions to be called. When used on a GETTER, the functions binded are invoked whenever `.get()` or `.send()`
	 * are invoked as well. The returning value from the reply bind (if there's any), will be the first parameter of the do's functions.
	 *
	 * @example
	 * ```
	 * NET.get("core").path("networkObject).when().do((value: R) => { ... });
	 * ```
	 *
	 * @client
	 * @returns an EventListener.
	 */
	when(): EventListener<[value: R]>;
}

export declare type GETDeclaration<S, R> = GETServerObjectDeclaration<S, R> & GETClientObjectDeclaration<S, R>;
