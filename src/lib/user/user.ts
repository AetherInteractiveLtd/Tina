import { Players, RunService } from "@rbxts/services";

import { DefaultUserDeclaration, OfflineUserDeclaration, UserType } from "./types";

import logger from "../logger";
import { TinaEvents } from "../events/tinaEvents";

export abstract class User implements DefaultUserDeclaration {
	public player: Player;

	constructor(private ref: Player | number) {
		this.player = (
			typeOf(this.ref) === "number" ? Players.GetPlayerByUserId(this.ref as number) : (this.ref as Player)
		)!;
	}

	async load(): Promise<UserType> {
		return "" as never; /** TODO */
	}

	async unload(): Promise<void> {}
}

class DefaultUser extends User implements DefaultUserDeclaration {
	constructor(ref: Player | number) {
		super(ref);
	}
}

class OfflineUser extends User implements OfflineUserDeclaration {
	release(): void {
		/** Somehow, release the offline user if no longer needed */
	}
}

export namespace Users {
	const usersMap: Map<Player, DefaultUserDeclaration> = new Map();

	let TINA_USER_CLASS = DefaultUser as never as new (ref: Player | number) => UserType;

	// eslint-disable-next-line no-inner-declarations
	async function add(player: Player) {
		const user = new TINA_USER_CLASS(player);
		await user
			.load()
			.then((user) => TinaEvents.fireEventListener("user:added", user))
			.catch((e) =>
				logger.warn(`[User]: Player's data couldn't be loaded correctly. More information: ${e}`),
			); /** User load? */

		usersMap.set(player, user);
	}

	// eslint-disable-next-line no-inner-declarations
	async function remove(player: Player) {
		const user = usersMap.get(player);
		if (user !== undefined) {
			await user
				.unload()
				.then(() => TinaEvents.fireEventListener("user:removing"))
				.catch((e) =>
					logger.warn(`[User]: Player's data couldn't be unloade correctly. More information: ${e}`),
				); /** User unload? */
		}

		usersMap.delete(player);
	}

	// eslint-disable-next-line no-inner-declarations
	function fromUserId(userId: number): UserType | undefined {
		let user: UserType | undefined;

		for (const [player, cachedUser] of usersMap) {
			if (player.UserId === userId) {
				user = cachedUser;
			}
		}

		return user;
	}

	// eslint-disable-next-line no-inner-declarations
	function fromPlayer(player: Player): UserType | undefined {
		return usersMap.get(player);
	}

	export function changeUserClass(userClass: new (ref: Player | number) => UserType): void {
		TINA_USER_CLASS = userClass;
	}

	/**
	 * Used to retrieve a player's user, in-game at that moment. To retrieve offline users use `.getOffline(userId: number)`.
	 *
	 * @server
	 *
	 * @param from a player or a number used to retrieve the player's user.
	 * @returns a User object constructed from your defined User class.
	 */
	export function get<T extends Player | number>(from: T): UserType {
		let user = typeOf(from) === "number" ? fromUserId(from as number) : fromPlayer(from as Player);
		if (user === undefined) user = new TINA_USER_CLASS(from);

		return user;
	}

	/**
	 * Used to retrieve and manipulate offline users.
	 *
	 * @server
	 *
	 * @param userId as number, should be the player's user id to retrieve the user from.
	 * @returns an OfflineUser object.
	 */
	export function getOffline(userId: number): OfflineUserDeclaration {
		if (RunService.IsClient()) return "Can't retrieve OfflineUser on client!" as never;

		return new OfflineUser(
			userId,
		); /** Initialisation and others can be done within the constructor of the offline user */
	}

	/** Players set/remove from Users */
	if (RunService.IsServer()) {
		for (const player of Players.GetPlayers()) add(player);

		Players.PlayerAdded.Connect(add);
		Players.PlayerRemoving.Connect(remove);

		game.BindToClose(() => {
			for (const player of Players.GetPlayers()) remove(player);
		});
	}
}
