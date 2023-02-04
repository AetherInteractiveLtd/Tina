/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection } from "../utilities/simple-signal";

export type Observer<T> = (value: T) => void;

export interface INetworkEvent {
	FireClient(player: Player, ...args: Array<any>): void;
	FireAllClients(...args: Array<any>): void;
	FireServer(...args: Array<any>): void;
	OnServerEvent(callback: (player: Player, ...args: Array<any>) => void): Connection;
	OnClientEvent(callback: Callback): Connection;
}
