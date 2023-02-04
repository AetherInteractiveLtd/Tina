import Signal, { Connection } from "../../utilities/simple-signal";
import { INetworkEvent } from "../types";

const SimulatedPlayer = { Name: "NetworkSimulation" } as Player;

export class NetworkSimulationEvent implements INetworkEvent {
	private serverSignal = new Signal<[Player, ...Array<unknown>]>();
	private clientSignal = new Signal<Array<unknown>>();

	public FireClient(_player: Player, ...args: Array<unknown>): void {
		this.clientSignal.Fire(...args);
	}

	public FireAllClients(...args: Array<unknown>): void {
		this.clientSignal.Fire(...args);
	}

	public FireServer(...args: Array<unknown>): void {
		this.serverSignal.Fire(SimulatedPlayer, ...args);
	}

	public OnServerEvent(callback: (player: Player, ...args: Array<unknown>) => void): Connection {
		return this.serverSignal.Connect(callback);
	}

	public OnClientEvent(callback: (...args: Array<unknown>) => void): Connection {
		return this.clientSignal.Connect(callback);
	}

	public Destroy(): void {
		this.serverSignal.DisconnectAll();
		this.clientSignal.DisconnectAll();
	}
}
