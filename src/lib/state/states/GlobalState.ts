import { ObservableValue } from "../../utilities/ObservableValue";
import { Connection } from "../../utilities/simple-signal";
import { NetworkEvent } from "../network/NetworkEvent";
import { NetworkBoundary, Observer, UpdateObject } from "../types";

export class GlobalState<T = unknown> {
	private remote: NetworkEvent;
	private observable: ObservableValue<T>;

	private isClient: boolean;
	private isServer: boolean;

	constructor(name: string, initialValue: T, remote: NetworkEvent, boundary: NetworkBoundary) {
		this.observable = new ObservableValue(initialValue);
		this.remote = remote;

		this.isClient = boundary === NetworkBoundary.Client;
		this.isServer = boundary === NetworkBoundary.Server;

		if (this.isClient) {
			/* Update value on client */
			this.remote.OnClientEvent((obj: UpdateObject<T>) => {
				if (obj.name !== name) return;
				this._set(obj.value);
			});
			this.remote.FireServer();
		}

		if (this.isServer) {
			/* Update all clients when value is changed on server */
			this.observable.subscribe(value => this.remote.FireAllClients({ name, value }));

			/* User has pinged server to get current value (should only be fired when player joins game) */
			this.remote.OnServerEvent(player =>
				this.remote.FireClient(player, { name, value: this.observable.getValue() }),
			);
		}
	}

	/**
	 * This method should be called on the **SERVER ONLY**
	 * @param value
	 */
	public set(value: T): void {
		assert(this.isServer, ".set() can only be called from the server");
		this._set(value);
	}

	private _set(value: T): void {
		this.observable.set(value);
	}

	public subscribe(observer: Observer<T>): Connection {
		return this.observable.subscribe(observer);
	}

	public getValue(): T {
		return this.observable.getValue();
	}
}
