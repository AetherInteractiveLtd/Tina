interface ClientNet {
	/**
	 * Binds a callback for server's request.
	 *
	 * @param id endpoint's id.
	 * @param callback being a function of type `(value: never) => void`.
	 */
	listen: (id: string, callback: (value: never) => void) => string;

	/**
	 * Sends data over the network to the server.
	 *
	 * @param id endpoint's id.
	 * @param value of type `T` described previously on declaration.
	 */
	send: <T>(id: string, value: T) => void;

	/**
	 * @hidden
	 */
	_init: () => void;
}

declare const ClientNet: ClientNet;
export = ClientNet;
