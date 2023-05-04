import { Players, RunService } from "@rbxts/services";

import { TinaEvents } from "../events/internal";
import { Internals } from "../net/internal";
import { ClientUser as Client } from "./default/client";
import { ServerUser as Server } from "./default/server";
import { DefaultUserDeclaration } from "./default/types";

/**
 * Users, a namespace capable of creating/deleting/retrieving Users from your experience.
 *
 * A User is an abstraction of the Player Instance with much more utilities, Users
 * are retrieved with the `.get()` method and you can create your own Users with the `.set()` method.
 *
 * Users are done automatically and internally within Tina, to start interacting with them, make sure
 * to provide a Users class which extends from the Default User.
 *
 * @example
 * ```ts
 * import Tina, { Users } from "@rbxts/tina";
 *
 * class MyUser extends Users.DefaultUser {}
 *
 * Tina.setUserClass(MyUser);
 * ```
 */
export namespace Users {
	const users: Map<Player, DefaultUserDeclaration> = new Map();
	const isServer = RunService.IsServer();

	export const ServerUser = Server;
	export const ClientUser = Client;

	export let tina_user_class: new (player: Player) => DefaultUserDeclaration = isServer
		? ServerUser
		: ClientUser;

	/**
	 * Used to change the User class from where all the Users are created.
	 *
	 * @hidden
	 *
	 * @param userClass the new user-defined User class.
	 */
	export function setUserClass(userClass: new (ref: Player) => DefaultUserDeclaration): void {
		tina_user_class = userClass;
	}

	/**
	 * Used to retrieve a player's users.
	 *
	 * @server
	 *
	 * @param from a player or a number used to retrieve the player's user.
	 * @returns a User object constructed from your defined User class.
	 */
	export function get(from: Player | number): DefaultUserDeclaration {
		const ref =
			type(from) === "number"
				? Players.GetPlayerByUserId(from as number)
				: typeOf(from) === "Instance"
				? (from as Instance).IsA("Player")
					? (from as Player)
					: undefined
				: undefined;

		if (ref === undefined) {
			throw `[Tina:User]: Expected a valid Player's Instance reference or a UserId! Got: [${from}]`;
		}

		let user: DefaultUserDeclaration | undefined = users.get(ref);

		if (user === undefined) {
			user = new tina_user_class(ref);
			Users.set(ref, user);
		}

		return user;
	}

	/**
	 * Used to add user-created User.
	 *
	 * @param player a Player Instance.
	 * @param user a User object.
	 * @returns the User passed.
	 */
	export function set(player: Player, user: DefaultUserDeclaration): void {
		return void users.set(player, user);
	}

	/**
	 * Used to remove a user.
	 *
	 * @param player a Player Instance.
	 * @returns the last User linked to the player given.
	 */
	export function remove(player: Player): void {
		return void users.delete(player);
	}

	/**
	 * Returns an array of all the connected users.
	 */
	export function items(): Array<DefaultUserDeclaration> {
		const itemsList: Array<DefaultUserDeclaration> = [];

		for (const [, user] of users) {
			itemsList.push(user);
		}

		return itemsList;
	}

	/**
	 * @hidden
	 */
	export function init(): void {
		if (!isServer) {
			Internals.when("user:added").do(({ id }) => {
				TinaEvents.fire("user:added", Users.get(id));
			});

			Internals.when("user:removing").do(({ id }) => {
				const user = Users.get(id);
				TinaEvents.fire("user:removing", user);

				Users.remove(user.player);
			});
		} else {
			Players.PlayerAdded.Connect(player => {
				const user = Users.get(player);

				Internals.update(player, "user:added", { id: player.UserId });
				TinaEvents.fire("user:added", user);

				return void Users.set(player, user);
			});

			Players.PlayerRemoving.Connect(player => {
				const user = users.get(player);

				if (user !== undefined) {
					Internals.update(player, "user:removing", { id: player.UserId });
					TinaEvents.fire("user:removing", user);

					return void Users.remove(player);
				}
			});
		}
	}
}

export { DefaultUserDeclaration as User } from "./default/types";
