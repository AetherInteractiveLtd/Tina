import { Players } from "@rbxts/services";

import { IS_CLIENT, IS_SERVER } from "../utilities/globals";
import { Connection } from "../utilities/simple-signal";
import { CrossBoundaryState } from "./cross-boundary-state";
import { ObservableValue } from "./ObservableValue";
import { getSubscribeParams } from "./utilities/helper";

const LocalPlayer = Players.LocalPlayer;

export class PlayerState<T> extends CrossBoundaryState {
	private values = new Map<Player, ObservableValue<T>>();
	private remote: RemoteEvent;
	private initialValue: T;

	constructor(initialValue: T, remote: RemoteEvent) {
		super();

		this.remote = remote;
		this.initialValue = initialValue; // TODO: This should be able to be a function

		if (IS_SERVER) {
			this.initServer();
		}

		if (IS_CLIENT) {
			this.initClient();
		}
	}

	private initPlayer(player: Player): void {
		if (this.values.has(player)) return;

		/* Create player value */
		const playerValue = new ObservableValue(this.initialValue);
		this.values.set(player, playerValue);

		/* Connect to value change */
		if (IS_SERVER) {
			playerValue.subscribe(value => this.remote.FireClient(player, value));
		}
	}

	private getPlayerValue(player: Player): ObservableValue<T> {
		this.initPlayer(player);
		return this.values.get(player)!;
	}

	private initServer(): void {
		Players.PlayerAdded.Connect(player => this.initPlayer(player));
		Players.PlayerRemoving.Connect(player => {
			this.values.get(player)?.destroy();
			this.values.delete(player);
		});

		/* Client pings server on setup to get current value */
		this.remote.OnServerEvent.Connect(player => {
			const value = this.getPlayerValue(player).getValue();
			this.remote.FireClient(player, value);
		});
	}

	private initClient(): void {
		/* Update value on client */
		this.remote.OnClientEvent.Connect((value: T) => this._set(LocalPlayer, value));

		/* Ping server to get current value */
		this.remote.FireServer();
	}

	public set(player: Player, value: T): void {
		assert(IS_SERVER, ".set() can only be called from the server");
		this._set(player, value);
	}

	private _set(player: Player, value: T): void {
		const playerValue = this.getPlayerValue(player);
		playerValue.set(value);
	}

	/**
	 * **CLIENT**
	 */
	public subscribe(observer: Observer<T>): Connection;
	/**
	 * **SERVER**
	 * @param player
	 * @param observer
	 */
	public subscribe(player: Player, observer: Observer<T>): Connection;
	public subscribe(player: Player | Observer<T>, observer?: Observer<T>): Connection {
		const [_player, _observer] = getSubscribeParams(player, observer);
		return this.getPlayerValue(_player).subscribe(_observer);
	}
}
