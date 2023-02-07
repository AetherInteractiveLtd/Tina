import { Connection } from "../../utilities/simple-signal";

export abstract class NetworkEvent {
	public abstract FireClient(player: Player, ...args: Array<unknown>): void;
	public abstract FireAllClients(...args: Array<unknown>): void;
	public abstract FireServer(...args: Array<unknown>): void;
	public abstract OnServerEvent(callback: (player: Player, ...args: Array<unknown>) => void): Connection;
	public abstract OnClientEvent(callback: Callback): Connection;
}
