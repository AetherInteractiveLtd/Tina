import { Players, RunService } from "@rbxts/services";

import { TinaEvents } from "../events/tina_events";
import { TinaNet } from "../net/tina_net";
import { DefaultUserDeclaration } from "./default/types";

export namespace Users {
	const users: Map<Player, DefaultUserDeclaration> = new Map();
	const isServer = RunService.IsServer();

	export let tina_user_class: new (ref: Player | number) => DefaultUserDeclaration;

	/**
	 * Used to change the User class from where all the Users are created.
	 *
	 * @hidden
	 * @param userClass the new user-defined User class.
	 */
	export function setUserClass(
		userClass: new (ref: Player | number) => DefaultUserDeclaration,
	): void {
		tina_user_class = userClass;
	}

	/**
	 * Used to retrieve a player's user, in-game at that moment.
	 *
	 * @param from a player or a number used to retrieve the player's user.
	 * @returns a User object constructed from your defined User class.
	 */
	export function get(from: Player | number): DefaultUserDeclaration {
		const ref =
			type(from) === "number"
				? Players.GetPlayerByUserId(from as number) !== undefined
					? Players.GetPlayerByUserId(from as number)
					: error(`[Tina:User]: User seems to not exist at all, id provided=${from}`)
				: (from as Player);

		if (ref === undefined) {
			throw `[Tina:User]: Expected a valid Player's Instance reference or a UserId! Got: [${from}]`;
		}

		let user!: DefaultUserDeclaration;

		if (isServer) {
			const existingUser = users.get(ref);
			user = existingUser !== undefined ? existingUser : new tina_user_class(ref);
		} else {
			// TODO: Implement client retrieving Users.
		}

		return user;
	}

	/**
	 * Used to add user-created Users.
	 *
	 * @param player a Player Instance.
	 * @param user a User object.
	 */
	export function set(player: Player, user: DefaultUserDeclaration): void {
		users.set(player, user);
	}

	/**
	 * Events related to user creation
	 */
	{
		if (isServer) {
			Players.PlayerAdded.Connect(player => {
				const user = Users.get(player);

				{
					TinaEvents.fireEventListener("user:added", user as never);
					TinaNet.getExposed("user:added").send(player, user as never);
				}

				return Users.set(player, user);
			});

			Players.PlayerRemoving.Connect(player => {
				const user = users.get(player);

				if (user !== undefined) {
					{
						TinaEvents.fireEventListener("user:removing", user as never);
						TinaNet.getExposed("user:removing").send(player, user as never);
					}
				}

				return users.delete(player);
			});

			/**
			 * User being retrieved
			 */
			TinaNet.getInternal("user:get").reply(user => {
				return user;
			});
		}
	}
}

export { DefaultUserDeclaration as User } from "./default/types";
