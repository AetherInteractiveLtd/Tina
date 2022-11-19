import { BaseEndpointObjectDeclaration } from "./types";

interface UPDATEServerObjectDeclaration<T extends unknown[]> extends BaseEndpointObjectDeclaration<T> {
	/**
	 * UPDATE is a one-way method, which lets client listen for changes request from the server, client can't send any data back or send any packet at all.
	 *
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").send(...);
	 * ```
	 *
	 * @server
	 * @param args should be the arguments described beforehand when creating the objects.
	 */
	send(...args: [...T]): void;
}

interface UPDATEClientObjectDeclaration<T extends unknown[]> extends BaseEndpointObjectDeclaration<T> {
	/**
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").when().do(callback).do(chainedCallback);
	 * ```
	 *
	 * @client
	 * @param func should describe the listener function to add to the callback.
	 */
	do<X>(func: (...args: [...T]) => X): UPDATEClientObjectDeclaration<[X]>;
}

export declare type UPDATEDeclaration<T extends unknown[] = unknown[]> = UPDATEServerObjectDeclaration<T> &
	UPDATEClientObjectDeclaration<T>;
