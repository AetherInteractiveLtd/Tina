interface ServerNet {
	/**
	 * Binds a callback for client's request.
	 *
	 * @param id endpoint's id.
	 * @param callback being a function of type `(player: Player, value: never) => void`.
	 */
	listen: (id: string, callback: (player: Player, value: never) => void) => string;

	/**
	 * Sends data over the network to the client.
	 *
	 * @param id endpoint's id.
	 * @param value of type `T` described previously on declaration.
	 */
	send: <T extends {}>(id: string, to: Array<Player>, contents: T) => void;

	/**
	 * Sends data over the network to all the connected clients.
	 *
	 * @param id endpoint's id.
	 * @param value of type `T` described previously on declaration.
	 */
	sendAll: <T>(id: string, value: T) => void;

	/**
	 * Sends data over the network to all the non-blacklisted clients.
	 *
	 * @param id endpoint's id.
	 * @param blacklist should be an array of players to blacklist.
	 * @param value of type `T` described previously on declaration.
	 */
	sendAllExcept: <T>(id: string, blacklist: Array<Player>, value: T) => void;

	/**
	 * @hidden
	 */
	_init: () => void;
}

declare const ServerNet: ServerNet;
export = ServerNet;
