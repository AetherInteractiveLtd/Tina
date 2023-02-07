<<<<<<< HEAD
<<<<<<< HEAD
import { ValueOrSetter } from "../../types/global";
import { ObservableValue } from "../../util/ObservableValue";
import { Connection } from "../../util/simple-signal";
=======
=======
import { ValueOrSetter } from "../../types/global";
>>>>>>> 222a4d1 (Add support for function setters for state for nicer syntax)
import { ObservableValue } from "../../utilities/ObservableValue";
import { Connection } from "../../utilities/simple-signal";
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
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
<<<<<<< HEAD
			this.remote.onClientEvent((obj: UpdateObject<T>) => {
				if (obj.name !== name) return;
				this._set(obj.value);
			});
			this.remote.fireServer();
=======
			this.remote.OnClientEvent((obj: UpdateObject<T>) => {
				if (obj.name !== name) return;
				this._set(obj.value);
			});
			this.remote.FireServer();
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
		}

		if (this.isServer) {
			/* Update all clients when value is changed on server */
<<<<<<< HEAD
<<<<<<< HEAD
			this.observable.when(value => this.remote.fireAllClients({ name, value }));

			/* User has pinged server to get current value (should only be fired when player joins game) */
			this.remote.onServerEvent(player =>
				this.remote.fireClient(player, { name, value: this.observable.getValue() }),
=======
			this.observable.subscribe(value => this.remote.FireAllClients({ name, value }));
=======
			this.observable.when(value => this.remote.FireAllClients({ name, value }));
>>>>>>> 2da8b3a (Rename .subscribe to .when on State)

			/* User has pinged server to get current value (should only be fired when player joins game) */
			this.remote.OnServerEvent(player =>
				this.remote.FireClient(player, { name, value: this.observable.getValue() }),
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
			);
		}
	}

	/**
	 * This method should be called on the **SERVER ONLY**
	 * @param value
	 */
<<<<<<< HEAD
<<<<<<< HEAD
	public set(value: ValueOrSetter<T>): void {
=======
	public set(value: T): void {
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
=======
	public set(value: ValueOrSetter<T>): void {
>>>>>>> 222a4d1 (Add support for function setters for state for nicer syntax)
		assert(this.isServer, ".set() can only be called from the server");
		this._set(value);
	}

<<<<<<< HEAD
<<<<<<< HEAD
	private _set(value: ValueOrSetter<T>): void {
		this.observable.set(value);
	}

	public when(observer: Observer<T>): Connection {
		return this.observable.when(observer);
<<<<<<< HEAD
=======
	private _set(value: T): void {
=======
	private _set(value: ValueOrSetter<T>): void {
>>>>>>> 222a4d1 (Add support for function setters for state for nicer syntax)
		this.observable.set(value);
	}

	public subscribe(observer: Observer<T>): Connection {
		return this.observable.subscribe(observer);
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
=======
>>>>>>> 2da8b3a (Rename .subscribe to .when on State)
	}

	public getValue(): T {
		return this.observable.getValue();
	}
}
