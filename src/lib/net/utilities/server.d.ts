export namespace ServerNet {
	/**
	 * listen should connect a listener to the server binder.
	 *
	 * @example
	 * ```
	 * event.listen("internalIndentifier", (plr: Player, ...args: unknown[]) => {});
	 * ```
	 *
	 * @param identifierName as string, should denote the identifier name
	 * @param callback as a Callback (function), should denote the actual
	 */
	export function listen(identifierName: string, callback: (player: Player, ...args: unknown[]) => void): string;

	/**
	 * call should pack and compress everything, schedule it to be sent and release such memory when no longer needed.
	 *
	 * @param identifierName as string, should denote the identifier name
	 * @param to as Player[], should be the list of players to send the remote to.
	 * @param args, should be the actual parameters of type T.
	 * @returns unknown[], returns some arguments of type unknown being an array.
	 */
	export function call<T extends unknown[]>(to: Player[], identifierName: string, ...args: T): unknown[];

	/**
	 * @deprecated
	 * @param identifierName as string, should denote the identifier name
	 */
	export function waitFor(identifierName: string): unknown[];

	/**›
	 * Should be called for creating identifiers for server remotes. (ffrost's code denotes that by checking if the id previously
	 * created with this method is valid).
	 *
	 * @param identifierName as a string, should denote the identifier id which is going to be created.
	 */
	export function createIdentifier<T extends string>(identifierName: T): T;
}
