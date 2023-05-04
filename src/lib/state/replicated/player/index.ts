import { Players, RunService } from "@rbxts/services";
import { t } from "@rbxts/t";

import { EventEmitter } from "../../../events";
import { Internals } from "../../../net/internal";
import { User } from "../../../user";
import { FunctionUtil } from "../../../util/functions";
import { InferredSetter, PlayerStateEventEmitter } from "../../types";
import { PlayerStateImplementation } from "./types";

export class PlayerState<T>
	extends EventEmitter<PlayerStateEventEmitter<T>>
	implements PlayerStateImplementation<T>
{
	private readonly values: Map<Player, T> = new Map();

	private initialValue: T;

	constructor(public readonly name: number, initialValue?: InferredSetter<T>) {
		super();

		{
			this.initialValue = FunctionUtil.isFunction(initialValue)
				? initialValue()
				: initialValue;

			if (!RunService.IsServer()) {
				const player = Players.LocalPlayer;

				Internals.when("state:replicated").do(({ id, value }) => {
					if (id === name) {
						this.values.set(player, value as T);

						return void this.emit("_default", player, value as T);
					}
				});

				this.values.set(player, this.initialValue);
			} else {
				const added = (player: Player): void => {
					if (this.values.has(player)) return;

					this.values.set(player, this.initialValue);
				};

				const removing = (player: Player): void => {
					return void this.values.delete(player);
				};

				for (const player of Players.GetPlayers()) {
					added(player);
				}

				Players.PlayerAdded.Connect(added);
				Players.PlayerRemoving.Connect(removing);

				this.when().do((player, value) => {
					Internals.update(player, "state:replicated", {
						stateName: name,
						value,
					});

					return value;
				});
			}
		}
	}

	public set({ player }: User, setter: InferredSetter<T>): void {
		if (!RunService.IsServer()) {
			throw `[PlayerState:Client]: State can only be set from the server.`;
		}

		const oldValue = this.values.get(player);

		let value: T;
		if (FunctionUtil.isFunction(setter)) {
			value = setter(oldValue);
		} else {
			if (t.table(setter)) {
				value = { ...oldValue, ...setter } as T;
			} else {
				value = setter as T;
			}
		}

		this.values.set(player, value);

		return void this.emit("_default", player, value);
	}

	public get(player: Player): T | undefined {
		return this.values.get(player);
	}
}
