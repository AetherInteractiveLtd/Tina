import { BaseEndpointObjectDeclaration } from "./types";

export interface POSTServerObjectDeclaration<T extends unknown[]> extends BaseEndpointObjectDeclaration<T> {
	/**
	 * @server only
	 * @param func should describe the listener function to add to the callback.
	 */
	do<X>(func: (...args: [...T]) => X): POSTServerObjectDeclaration<[X]>;
}

export interface POSTClientObjectDeclaration<T extends unknown[]> extends BaseEndpointObjectDeclaration<T> {
	/**
	 * POST is a one-way method, which lets client send requests of change to the server, server won't be able to send any data back.
	 *
	 * @client only
	 * @param args should be the arguments described before hand when creating the objects.
	 */
	send(...args: [...T]): void;
}

export declare type POSTDeclaration<T extends unknown[] = unknown[]> = POSTServerObjectDeclaration<T> &
	POSTClientObjectDeclaration<T>;
