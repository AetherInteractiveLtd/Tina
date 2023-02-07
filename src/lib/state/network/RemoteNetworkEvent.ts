<<<<<<< HEAD
import { Connection } from "../../util/simple-signal";
=======
import { Connection } from "../../utilities/simple-signal";
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
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

<<<<<<< HEAD
	public fireClient(player: Player, ...args: Array<unknown>): void {
		this.instance.FireClient(player, ...args);
	}

	public fireAllClients(...args: Array<unknown>): void {
		this.instance.FireAllClients(...args);
	}

	public fireServer(...args: Array<unknown>): void {
		this.instance.FireServer(...args);
	}

	public onServerEvent(callback: (player: Player, ...args: Array<unknown>) => void): Connection {
		return this.instance.OnServerEvent.Connect(callback);
	}

	public onClientEvent(callback: Callback): Connection {
=======
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
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
		return this.instance.OnClientEvent.Connect(callback);
	}
}
