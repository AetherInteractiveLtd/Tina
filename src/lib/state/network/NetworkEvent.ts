import { Connection } from "../../utilities/simple-signal";

export abstract class NetworkEvent {
	public abstract fireClient(player: Player, ...args: Array<unknown>): void;
	public abstract fireAllClients(...args: Array<unknown>): void;
	public abstract fireServer(...args: Array<unknown>): void;
	public abstract onServerEvent(callback: (player: Player, ...args: Array<unknown>) => void): Connection;
	public abstract onClientEvent(callback: Callback): Connection;
}
