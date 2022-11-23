import { EventListener } from "../../../events";

export interface GETServerObjectDeclaration<P extends unknown[], R extends unknown[]> {
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
	reply(func: (user: never, ...args: P) => R): void;
}

export interface GETClientObjectDeclaration<P extends unknown[], R extends unknown[]> {
	/**
	 * You can send data for the server to manipulate it/use it, and send it back if needed with `.send()`. If you just want to retrieve data, use `.get()` instead.
	 *
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").send(...args: P); // The events emit is done here.
	 * ```
	 *
	 * @client
	 * @param args should be the parameters described on the endpoint declaration.
	 */
	send(...args: P): void;

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
	 * NET.get("core").path("networkObject).when().do((...args: R) => { ... });
	 * ```
	 *
	 * @server
	 * @returns an EventListener.
	 */
	when(): EventListener<P>;
}

export declare type GETDeclaration<T extends Callback> = GETServerObjectDeclaration<Parameters<T>, ReturnType<T>> &
	GETClientObjectDeclaration<Parameters<T>, ReturnType<T>>;
