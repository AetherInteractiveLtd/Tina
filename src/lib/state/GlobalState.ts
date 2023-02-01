import { IS_CLIENT, IS_SERVER } from "../utilities/globals";
import { Connection } from "../utilities/simple-signal";
import { CrossBoundaryState } from "./cross-boundary-state";
import { ObservableValue } from "./ObservableValue";

export class GlobalState<T = unknown> extends CrossBoundaryState {
	private remote: RemoteEvent;
	private observable: ObservableValue<T>;

	constructor(initialValue: T, remote: RemoteEvent) {
		super();

		this.observable = new ObservableValue(initialValue);
		this.remote = remote;

		if (IS_CLIENT) {
			/* Update value on client */
			this.remote.OnClientEvent.Connect((value: T) => this._set(value));
			this.remote.FireServer();
		}

		if (IS_SERVER) {
			/* Update all clients when value is changed on server */
			this.observable.subscribe(currentValue => this.remote.FireAllClients(currentValue));

			/* User has pinged server to get current value (should only be fired when player joins game) */
			this.remote.OnServerEvent.Connect(player => this.remote.FireClient(player, this.observable.getValue()));
		}
	}

	/**
	 * This method should be called on the **SERVER ONLY**
	 * @param value
	 */
	public set(value: T): void {
		assert(IS_SERVER, ".set() can only be called from the server");
		this._set(value);
	}

	private _set(value: T): void {
		this.observable.set(value);
	}

	public subscribe(observer: Observer<T>): Connection {
		return this.observable.subscribe(observer);
	}
}
