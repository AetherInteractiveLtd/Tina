import { Players } from "@rbxts/services";

<<<<<<< HEAD
<<<<<<< HEAD
import { ValueOrSetter } from "../../types/global";
import { ObservableValue } from "../../util/ObservableValue";
import { Connection } from "../../util/simple-signal";
=======
=======
import { ValueOrSetter } from "../../types/global";
>>>>>>> 222a4d1 (Add support for function setters for state for nicer syntax)
import { ObservableValue } from "../../utilities/ObservableValue";
import { Connection } from "../../utilities/simple-signal";
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
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
<<<<<<< HEAD
<<<<<<< HEAD
			playerValue.when(value => this.remote.fireClient(player, { name: this.name, value }));
=======
			playerValue.subscribe(value => this.remote.FireClient(player, { name: this.name, value }));
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
=======
			playerValue.when(value => this.remote.FireClient(player, { name: this.name, value }));
>>>>>>> 2da8b3a (Rename .subscribe to .when on State)
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
<<<<<<< HEAD
		this.remote.onServerEvent(player => {
			const value = this.getPlayerValue(player).getValue();
			this.remote.fireClient(player, { name: this.name, value });
=======
		this.remote.OnServerEvent(player => {
			const value = this.getPlayerValue(player).getValue();
			this.remote.FireClient(player, { name: this.name, value });
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
		});
	}

	private initClient(): void {
		/* Update value on client */
<<<<<<< HEAD
		this.remote.onClientEvent((obj: UpdateObject<T>) => {
=======
		this.remote.OnClientEvent((obj: UpdateObject<T>) => {
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
			if (this.name !== obj.name) return;
			this._set(LocalPlayer, obj.value);
		});

		/* Ping server to get current value */
<<<<<<< HEAD
		this.remote.fireServer();
	}

	public set(player: Player, value: ValueOrSetter<T>): void {
=======
		this.remote.FireServer();
	}

<<<<<<< HEAD
	public set(player: Player, value: T): void {
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
=======
	public set(player: Player, value: ValueOrSetter<T>): void {
>>>>>>> 222a4d1 (Add support for function setters for state for nicer syntax)
		assert(this.isServer, ".set() can only be called from the server");
		this._set(player, value);
	}

<<<<<<< HEAD
<<<<<<< HEAD
	private _set(player: Player, value: ValueOrSetter<T>): void {
=======
	private _set(player: Player, value: T): void {
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
=======
	private _set(player: Player, value: ValueOrSetter<T>): void {
>>>>>>> 222a4d1 (Add support for function setters for state for nicer syntax)
		const playerValue = this.getPlayerValue(player);
		playerValue.set(value);
	}

<<<<<<< HEAD
<<<<<<< HEAD
	public when(player: Player, observer: Observer<T>): Connection {
		return this.getPlayerValue(player).when(observer);
=======
	public subscribe(player: Player, observer: Observer<T>): Connection {
		return this.getPlayerValue(player).subscribe(observer);
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
=======
	public when(player: Player, observer: Observer<T>): Connection {
		return this.getPlayerValue(player).when(observer);
>>>>>>> 2da8b3a (Rename .subscribe to .when on State)
	}

	public getValue(player: Player): T {
		return this.getPlayerValue(player).getValue();
	}
}
<<<<<<< HEAD
=======

// /**
//  * **CLIENT**
//  */
// public subscribe(observer: Observer<T>): Connection;
// /**
//  * **SERVER**
//  * @param player
//  * @param observer
//  */
// public subscribe(player: Player, observer: Observer<T>): Connection;

// /**
//  * TODO
//  * @param playerOrCallback
//  * @param callback
//  * @returns
//  */
// private getSubscribeParams<T>(
// 	playerOrCallback: Player | Observer<T>,
// 	callback?: Observer<T>,
// ): LuaTuple<[Player, Observer<T>]> {
// 	/* Return the LocalPlayer and the callback */
// 	if (this.isClient) {
// 		assert(
// 			typeIs(playerOrCallback, "function"),
// 			".subscribe() requires only an observer when called on the Client",
// 		);
// 		return $tuple(Players.LocalPlayer, playerOrCallback);
// 	}

// 	/* Return the passed player and callback */
// 	assert(typeIs(callback, "function"), "Observer must be a function");
// 	assert(typeIs(playerOrCallback, "Instance") && playerOrCallback.IsA("Player"));
// 	return $tuple(playerOrCallback as Player, callback as Observer<T>);
// }
>>>>>>> 5ee74d5 (Added createState to Tina namespace)
