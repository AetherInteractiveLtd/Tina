interface ServerNet {
	/**
	 * listen should connect a listener to the server binder.
	 *
	 * @example
	 * ```
	 * event.listen("internalIndentifier", (plr: Player, ...args: unknown[]) => { ... });
	 * ```
	 *
	 * @param id as string, should denote the identifier name.
	 * @param callback as a Callback (function), should denote the actual.
	 */
	listen: (id: string, callback: (player: Player, value: never) => void) => string;

	/**
	 * send should pack and compress everything, schedule it to be sent and release such memory when no longer needed.
	 *
	 * @param id as string, should denote the identifier name.
	 * @param to as Player[], should be the list of players to send the remote to.
	 * @param contents, of type T.
	 */
	send: <T extends {}>(id: string, to: Player[], contents: T) => void;

	/**
	 * sendAll should do the same, but individually by the Group
	 *
	 * @param id as string, should denote the identifier name.
	 * @param contents of type T.
	 */
	sendAll: <T>(id: string, contents: T) => void;

	/**
	 * Fires the remote for everyone with a blacklist.
	 *
	 * @param id as string, should denote the identifier name.
	 * @param blacklist as Player[], should mark the places where you can't be.
	 * @param contents of type T.
	 */
	sendAllExcept: <T>(id: string, blacklist: Player[], contents: T) => void;

	/**
	 * @hidden
	 */
	_init: () => void;
}

declare const ServerNet: ServerNet;
export = ServerNet;
