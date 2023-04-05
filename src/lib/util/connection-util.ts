/**
 * Used to infer the parameters of a callback function.
 */
type InferSignalParameters<S> = S extends SignalLike
	? Parameters<
			Parameters<
				S["Connect"] extends Callback
					? S["Connect"]
					: S["connect"] extends Callback
					? S["connect"]
					: S["on"] extends Callback
					? S["on"]
					: S["do"] extends Callback
					? S["do"]
					: never
			>[0]
	  >
	: never;

export interface ConnectionLike {
	Destroy?(): void;
	Disconnect?(): void;
	destroy?(): void;
	disconnect?(): void;
}

export interface SignalLike {
	Connect?(callback: Callback): ConnectionLike;
	connect?(callback: Callback): ConnectionLike;
	do?(callback: Callback): ConnectionLike;
	on?(callback: Callback): ConnectionLike;
}

const EVENT_CONNECT_METHODS = ["Connect", "do", "on", "connect"];
const EVENT_DISCONNECT_METHODS = ["Disconnect", "Destroy", "disconnect", "destroy"];

/**
 * Utility functions for connecting and disconnecting to events that are not
 * guaranteed to be of type `RBXScriptSignal`.
 */
export namespace ConnectionUtil {
	/**
	 * Connects to an event.
	 *
	 * @param event a function that must have a `Connect`, `connect`, `on`, or
	 * `do` method
	 * @param callback The callback to call when the event is fired
	 * @returns A connection object that can be used to disconnect from the event
	 */
	export function connect(event: SignalLike, callback: Callback): ConnectionLike {
		if (typeIs(event, "RBXScriptSignal")) {
			return event.Connect(callback);
		}

		for (const method of EVENT_CONNECT_METHODS) {
			if (type(event[method as keyof SignalLike["Connect"]]) === "function") {
				return event[method as keyof SignalLike]!(callback);
			}
		}

		throw `Cannot connect to event ${event}. No valid connection method found.`;
	}

	/**
	 * Disconnects from an event.
	 *
	 * @param connection A connection object that has a `Disconnect`, `Destroy`,
	 * `disconnect`, or `destroy` method.
	 */
	export function disconnect(connection: ConnectionLike): void {
		if (typeIs(connection, "RBXScriptConnection")) {
			return connection.Disconnect();
		}

		for (const method of EVENT_DISCONNECT_METHODS) {
			if (type(connection[method as keyof ConnectionLike["Destroy"]]) === "function") {
				connection[method as keyof ConnectionLike]!();
			}
		}
	}
}
