import { Connection } from "../../utilities/simple-signal";
import { NetworkEvent } from "./NetworkEvent";

/**
 * A wrapper for a RemoteEvent which allows for it to be overwritten for unit tests
 */
export class RemoteNetworkEvent extends NetworkEvent {
	public instance: RemoteEvent;

	constructor(remote: RemoteEvent) {
		super();
		this.instance = remote;
	}

	public FireClient(player: Player, ...args: Array<unknown>): void {
		this.instance.FireClient(player, ...args);
	}

	public FireAllClients(...args: Array<unknown>): void {
		this.instance.FireAllClients(...args);
	}

	public FireServer(...args: Array<unknown>): void {
		this.instance.FireServer(...args);
	}

	public OnServerEvent(callback: (player: Player, ...args: Array<unknown>) => void): Connection {
		return this.instance.OnServerEvent.Connect(callback);
	}

	public OnClientEvent(callback: Callback): Connection {
		return this.instance.OnClientEvent.Connect(callback);
	}
}
