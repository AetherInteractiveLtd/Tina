interface ClientNet {
	/**
	 * listen should connect a listener to the client binder.
	 *
	 * @example
	 * ```
	 * event.listen("identifier", (...args: unknown[]) => {});
	 * ```
	 *
	 * @param id as string, should denote the identifier name
	 * @param callback as a Callback (function), should denote the actual
	 */
	listen: (id: string, callback: (value: never) => void) => string;

	/**
	 * call should pack and compress everything, schedule it to be sent and release such memory when no longer needed.
	 *
	 * @param id as string, should denote the identifier name
	 * @param args, should be the actual parameters of type T.
	 * @returns unknown[], returns some arguments of type unknown being an array.
	 */
	send: <T>(id: string, value: T) => void;

	/**
	 * @hidden
	 */
	_init: () => void;
}

declare const ClientNet: ClientNet;
export = ClientNet;
