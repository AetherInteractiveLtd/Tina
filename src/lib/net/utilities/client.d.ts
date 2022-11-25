export namespace ClientNet {
	/**
	 * listen should connect a listener to the client binder.
	 *
	 * @example
	 * ```
	 * event.listen("internalIndentifier", (...args: unknown[]) => {});
	 * ```
	 *
	 * @param identifierName as string, should denote the identifier name
	 * @param callback as a Callback (function), should denote the actual
	 */
	export function listen(identifierName: string, callback: (value: never) => void): string;

	/**
	 * call should pack and compress everything, schedule it to be sent and release such memory when no longer needed.
	 *
	 * @param identifierName as string, should denote the identifier name
	 * @param args, should be the actual parameters of type T.
	 * @returns unknown[], returns some arguments of type unknown being an array.
	 */
	export function call(identifierName: string, ...args: unknown[]): void;

	/**
	 * @deprecated
	 * @param identifierName as string, should denote the identifier name
	 */
	export function waitFor(identifierName: string): unknown[];
}
