<<<<<<< HEAD
import { Connection } from "../../util/simple-signal";

export abstract class NetworkEvent {
	public abstract fireClient(player: Player, ...args: Array<unknown>): void;
	public abstract fireAllClients(...args: Array<unknown>): void;
	public abstract fireServer(...args: Array<unknown>): void;
	public abstract onServerEvent(
		callback: (player: Player, ...args: Array<unknown>) => void,
	): Connection;
	public abstract onClientEvent(callback: Callback): Connection;
=======
import { Connection } from "../../utilities/simple-signal";

export abstract class NetworkEvent {
	public abstract FireClient(player: Player, ...args: Array<unknown>): void;
	public abstract FireAllClients(...args: Array<unknown>): void;
	public abstract FireServer(...args: Array<unknown>): void;
	public abstract OnServerEvent(callback: (player: Player, ...args: Array<unknown>) => void): Connection;
	public abstract OnClientEvent(callback: Callback): Connection;
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
}
