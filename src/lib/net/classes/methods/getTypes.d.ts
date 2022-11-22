export interface GETServerObjectDeclaration<T extends Callback> {
	/**
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").reply(callback);
	 * ```
	 *
	 * @server can't be used on client.
	 * @param func should describe the listener function to add as a callback for the reply, the return type is the expected type at the receiving end.
	 */
	reply<X extends ReturnType<T>>(func: (user: never, ...args: Parameters<T>) => X): void;
}

export interface GETClientObjectDeclaration<T extends unknown[]> {
	/**
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").reply(callback);
	 * ```
	 *
	 * @client can't be used on server.
	 * @param func should describe the listener function to add as a callback for the doing, the return is chained.
	 */
	do<X>(func: (...args: [...T]) => X): GETClientObjectDeclaration<[X]>;
}

export declare type GETDeclaration<T extends Callback> = GETServerObjectDeclaration<T> &
	GETClientObjectDeclaration<Parameters<T>>;
