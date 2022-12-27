import { Players, RunService } from "@rbxts/services";

import { TinaEvents } from "../events/tina_events";
import { TinaNet } from "../net/tina_net";
import { AbstractUser } from "./default";
import { DefaultUserImplementation, UserType } from "./default/types";

class DefaultUser extends AbstractUser implements DefaultUserImplementation {
	constructor(ref: Player | number) {
		super(ref);
	}
}

export namespace Users {
	const users: Map<Player, DefaultUserImplementation> = new Map();
	let TINA_USER_CLASS = DefaultUser as never as new (ref: Player | number) => DefaultUserImplementation;

	/**
	 * Used to change the User class from where all the Users are created.
	 *
	 * @hidden
	 * @param userClass the new user-defined User class.
	 */
	export function changeUserClass(userClass: new (ref: Player | number) => UserType): void {
		TINA_USER_CLASS = userClass;
	}

	/**
	 * Used to retrieve a player's user, in-game at that moment. To retrieve offline users use `.getOffline(userId: number)`.
	 *
	 * @param from a player or a number used to retrieve the player's user.
	 * @returns a User object constructed from your defined User class.
	 */
	export function get(from: Player | number): UserType {
		if (RunService.IsClient() === true) error("Can't retrieve users from the client.");

		const possiblePlayer = Players.GetPlayerByUserId(from as number);
		const ref =
			type(from) === "number"
				? possiblePlayer !== undefined
					? possiblePlayer
					: error("[Users]: Can't give ")
				: (from as Player);

		const possibleUser = users.get(ref);
		const user = possibleUser !== undefined ? possibleUser : new TINA_USER_CLASS(ref);

		return user;
	}

	/** Players set/remove from Users, operations for creating and caching, or removing players */
	if (RunService.IsServer() === true) {
		Players.PlayerAdded.Connect((player: Player): void => {
			const user = new TINA_USER_CLASS(player);
			users.set(player, user);

			// Events
			{
				TinaEvents.fireEventListener("user:added", user as never);
				TinaNet.get("user:added").send(player, user as never);
			}
		});

		Players.PlayerRemoving.Connect((player: Player): void => {
			const user = users.get(player);

			if (user !== undefined) {
				users.delete(player);

				// Events
				{
					TinaEvents.fireEventListener("user:removing", user as never);
					TinaNet.get("user:removing").send(player, user as never);
				}
			}
		});
	}
}

export { AbstractUser } from "./default";
