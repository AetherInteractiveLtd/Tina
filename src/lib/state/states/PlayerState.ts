import { Players } from "@rbxts/services";

import { ValueOrSetter } from "../../types/global";
import { ObservableValue } from "../../utilities/ObservableValue";
import { Connection } from "../../utilities/simple-signal";
import { NetworkEvent } from "../network/NetworkEvent";
import { NetworkBoundary, Observer, UpdateObject } from "../types";

const LocalPlayer = Players.LocalPlayer ?? ({} as Player);

export class PlayerState<T> {
	private values = new Map<Player, ObservableValue<T>>();
	private remote: NetworkEvent;
	private initialValue: T;

	private isClient: boolean;
	private isServer: boolean;

	public name: string;

	constructor(name: string, initialValue: T, remote: NetworkEvent, boundary: NetworkBoundary) {
		this.name = name;
		this.remote = remote;
		this.initialValue = initialValue; // TODO: This should be able to be a function

		this.isClient = boundary === NetworkBoundary.Client;
		this.isServer = boundary === NetworkBoundary.Server;

		if (this.isClient) {
			this.initClient();
		}

		if (this.isServer) {
			this.initServer();
		}
	}

	private initPlayer(player: Player): void {
		if (this.values.has(player)) return;

		/* Create player value */
		const playerValue = new ObservableValue(this.initialValue);
		this.values.set(player, playerValue);

		/* Connect to value change */
		if (this.isServer) {
			playerValue.subscribe(value => this.remote.FireClient(player, { name: this.name, value }));
		}
	}

	private getPlayerValue(player: Player): ObservableValue<T> {
		const playerToLookup = this.isClient ? LocalPlayer : player;
		this.initPlayer(playerToLookup);
		return this.values.get(playerToLookup)!;
	}

	private onPlayerAdded(player: Player): void {
		this.initPlayer(player);
	}

	private onPlayerRemoving(player: Player): void {
		this.values.get(player)?.destroy();
		this.values.delete(player);
	}

	private initServer(): void {
		Players.PlayerAdded.Connect(player => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect(player => this.onPlayerRemoving(player));

		/* Client pings server on setup to get current value */
		this.remote.OnServerEvent(player => {
			const value = this.getPlayerValue(player).getValue();
			this.remote.FireClient(player, { name: this.name, value });
		});
	}

	private initClient(): void {
		/* Update value on client */
		this.remote.OnClientEvent((obj: UpdateObject<T>) => {
			if (this.name !== obj.name) return;
			this._set(LocalPlayer, obj.value);
		});

		/* Ping server to get current value */
		this.remote.FireServer();
	}

	public set(player: Player, value: ValueOrSetter<T>): void {
		assert(this.isServer, ".set() can only be called from the server");
		this._set(player, value);
	}

	private _set(player: Player, value: ValueOrSetter<T>): void {
		const playerValue = this.getPlayerValue(player);
		playerValue.set(value);
	}

	public subscribe(player: Player, observer: Observer<T>): Connection {
		return this.getPlayerValue(player).subscribe(observer);
	}

	public getValue(player: Player): T {
		return this.getPlayerValue(player).getValue();
	}
}
