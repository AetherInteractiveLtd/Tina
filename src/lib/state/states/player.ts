import { Players, RunService } from "@rbxts/services";

import { EventListener } from "../../events";
import { Internals } from "../../net/internal";
import { FunctionUtil } from "../../util/functions";
import { StateSetter } from "../types";

export class PlayerState<T = unknown> {
	private readonly isServer = RunService.IsServer();
	private readonly values: Map<Player, T> = new Map();

	private readonly subscription: EventListener<[Player, T]> = new EventListener();
	private readonly replicator: EventListener<[Player, T]> = new EventListener();

	private initialValue: T;

	constructor(public readonly name: string, initialValue: StateSetter<T>) {
		this.initialValue = FunctionUtil.isFunction(initialValue) ? initialValue() : initialValue;

		if (!this.isServer) {
			Internals.when("state:replicated").do(({ stateName, value }) => {
				if (stateName !== name) return;

				const player = Players.LocalPlayer;
				this.values.set(player, value as T);

				void this.subscription.call(player, value);
			});

			this.values.set(Players.LocalPlayer, this.initialValue);
		} else {
			const added = (player: Player): void => {
				if (this.values.has(player)) return;

				this.values.set(player, this.initialValue);
				this.replicator.do((player: Player, value: T) => {
					void this.subscription.call(player, value);
					return void Internals.update(player, "state:replicated", {
						stateName: name,
						value,
					});
				});
			};

			const removing = (player: Player): void => {
				this.values.delete(player);
			};

			Players.PlayerAdded.Connect(added);
			Players.PlayerRemoving.Connect(removing);
		}
	}

	public subscribe(): EventListener<[Player, T]> {
		return this.subscription;
	}

	/** @server */
	public set(player: Player, setter: StateSetter<T>): void {
		if (!this.isServer) {
			throw `[PlayerState:Client]: State can only be set from the server.`;
		}

		let value: T;

		if (FunctionUtil.isFunction(setter)) {
			const oldValue = this.values.get(player);
			value = setter(oldValue);

			this.values.set(player, value);
		} else {
			value = setter;

			this.values.set(player, value);
		}

		return void this.replicator.call(player, value);
	}

	public get(player: Player = Players.LocalPlayer): T | undefined {
		return this.values.get(player);
	}
}