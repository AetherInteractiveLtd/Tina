import { IS_CLIENT, IS_SERVER } from "../utilities/globals";
import Signal, { Connection } from "../utilities/simple-signal";
import { CrossBoundaryState } from "./cross-boundary-state";

export class GlobalState<T = unknown> extends CrossBoundaryState {
	private value: T;
	private remote: RemoteEvent;
	private signal = new Signal<[T]>();

	constructor(initialValue: T, remote: RemoteEvent) {
		super();

		this.value = initialValue;
		this.remote = remote;

		if (IS_CLIENT) {
			this.remote.OnClientEvent.Connect((value: T) => {
				this._set(value);
			});
			this.remote.FireServer(); // Get current value from server on init
		}

		if (IS_SERVER) {
			this.remote.OnServerEvent.Connect(player => {
				this.remote.FireClient(player, this.value);
			});
		}
	}

	public set(value: T): void {
		assert(IS_SERVER, ".set() can only be called from the server");
		this._set(value);
	}

	private _set(value: T): void {
		// Update state value
		this.value = value;

		// Update observers
		this.signal.Fire(value);

		// Replicate
		if (IS_SERVER) {
			this.remote.FireAllClients(value);
		}
	}

	public subscribe(observer: (value: T) => void): Connection {
		return this.signal.Connect(observer);
	}
}
