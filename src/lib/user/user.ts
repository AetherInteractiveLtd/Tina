import { Players, RunService } from "@rbxts/services";

import { TinaEvents } from "../events/tina_events";
import { FriendPage } from "./methods";

import { DefaultUserDeclaration, OfflineUserDeclaration, UserType } from "./types";

export abstract class User implements DefaultUserDeclaration {
	public player: Player;

	constructor(private ref: Player | number) {
		this.player = (
			typeOf(this.ref) === "number" ? Players.GetPlayerByUserId(this.ref as number) : (this.ref as Player)
		)!;
	}

	public isFirstSession(): boolean {
		return true;
	}

	public async friends(): Promise<Map<string, FriendPage>> {
		const friends: Map<string, FriendPage> = new Map();

		try {
			const friendsPages = Players.GetFriendsAsync(this.player.UserId);

			if (friendsPages !== undefined) {
				do {
					for (const page of friendsPages.GetCurrentPage()) {
						friends.set(page.Username, page);
					}

					friendsPages.AdvanceToNextPageAsync();
				} while (!friendsPages.IsFinished);
			}
		} catch (e) {
			warn(
				`There was an error while trying to retrieve ${this.player.DisplayName}'s friends. More information on why this happened: ${e}`,
			);
		}

		return friends;
	}

	public async friendsInServer(): Promise<Map<string, FriendPage>> {
		const friends: Map<string, FriendPage> = new Map();

		try {
			const friendsPages = Players.GetFriendsAsync(this.player.UserId);

			if (friendsPages !== undefined) {
				do {
					for (const page of friendsPages.GetCurrentPage()) {
						if (Players.FindFirstChild(page.Username) !== undefined) {
							friends.set(page.Username, page);
						}
					}

					friendsPages.AdvanceToNextPageAsync();
				} while (!friendsPages.IsFinished);
			}
		} catch (e) {
			warn(
				`There was an error while trying to retrieve ${this.player.DisplayName}'s connected friends. More information on why this happened: ${e}`,
			);
		}

		return friends;
	}
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
		TinaEvents.fireEventListener("user:added", user)

		usersMap.set(player, user);
	}

	// eslint-disable-next-line no-inner-declarations
	async function remove(player: Player) {
		const user = usersMap.get(player);
		if (user !== undefined) {
			TinaEvents.fireEventListener("user:removing", user) /** User removement */
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

	/**
	 * Used to change the User class from where all the Users are created.
	 *
	 * @param userClass the new user-defined User class.
	 * @hidden
	 */
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
		if (RunService.IsClient())
			return "Can't retrieve users from the client." as never; /** Is this alright? Or JSDoc was enough? */

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

	/** Players set/remove from Users, operations for creating and caching, or removing players */
	if (RunService.IsServer()) {
		for (const player of Players.GetPlayers()) add(player);

		Players.PlayerAdded.Connect(add);
		Players.PlayerRemoving.Connect(remove);

		game.BindToClose(() => {
			for (const player of Players.GetPlayers()) remove(player);
		});
	}
}
