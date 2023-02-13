import Signal, { Connection } from "../../utilities/simple-signal";
import { NetworkEvent } from "./NetworkEvent";

const SimulatedPlayer = { Name: "NetworkSimulation" } as Player;

export class NetworkSimulationEvent extends NetworkEvent {
	private serverSignal = new Signal<[Player, ...Array<unknown>]>();
	private clientSignal = new Signal<Array<unknown>>();

	public fireClient(_player: Player, ...args: Array<unknown>): void {
		this.clientSignal.Fire(...args);
	}

	public fireAllClients(...args: Array<unknown>): void {
		this.clientSignal.Fire(...args);
	}

	public fireServer(...args: Array<unknown>): void {
		this.serverSignal.Fire(SimulatedPlayer, ...args);
	}

	public onServerEvent(callback: (player: Player, ...args: Array<unknown>) => void): Connection {
		return this.serverSignal.Connect(callback);
	}

	public onClientEvent(callback: (...args: Array<unknown>) => void): Connection {
		return this.clientSignal.Connect(callback);
	}
}
