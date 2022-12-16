import { Players, RunService } from "@rbxts/services";

import { Container } from "../container";
import { ItemType } from "../container/classes/item/types";
import { Template } from "../container/types";
import { TinaEvents } from "../events/tina_events";
import logger from "../logger";
import { TinaNet } from "../net/tina_net";
import { FriendPage } from "./methods";
import { DefaultUserDeclaration, LoadingOptions, OfflineUserDeclaration, UserType } from "./types";

export abstract class User implements DefaultUserDeclaration {
	public player: Player;

	/** All data related */
	private firstSession!: boolean;
	private item!: ItemType<Template>;

	constructor(private ref: Player | number) {
		this.player = (
			typeOf(this.ref) === "number" ? Players.GetPlayerByUserId(this.ref as number) : (this.ref as Player)
		)!;
	}

	public isFirstSession(): boolean {
		return this.firstSession;
	}

	public async friends(onlineOnly: boolean): Promise<Map<string, FriendPage>> {
		const friends: Map<string, FriendPage> = new Map();

		try {
			const friendsPages = Players.GetFriendsAsync(this.player.UserId);

			if (friendsPages !== undefined) {
				do {
					for (const page of friendsPages.GetCurrentPage()) {
						if (onlineOnly && page.IsOnline) {
							friends.set(page.Username, page);
						} else if (onlineOnly === undefined) {
							friends.set(page.Username, page);
						}
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

	public async load({
		bucket: bucketKey,
		item: itemKey,
		template,
	}: LoadingOptions): Promise<typeof template | undefined> {
		const bucket = Container.getBucket(bucketKey, template);
		const item = await bucket
			.getItem(itemKey + this.player.UserId)
			.catch((e: string) =>
				logger.warn(
					"[Container]: Trying to load Item, didn't work. Please rejoin the experience. Further detail: " + e,
				),
			);

		this.item = item as ItemType<Template>;

		if (item !== undefined) {
			this.firstSession = item.metadata.is_first_session;
			return item.data;
		}
	}

	public unload(): void {
		this.item?.lose();
	}
}

class DefaultUser extends User implements DefaultUserDeclaration {
	constructor(ref: Player | number) {
		super(ref);
	}
}

class OfflineUser extends User implements OfflineUserDeclaration {
	public release(): void {
		/** Somehow, release the offline user if no longer needed */
	}
}

export namespace Users {
	const usersMap: Map<Player, DefaultUserDeclaration> = new Map();

	let TINA_USER_CLASS = DefaultUser as never as new (ref: Player | number) => UserType;

	// eslint-disable-next-line no-inner-declarations
	function add(player: Player): void {
		const user = new TINA_USER_CLASS(player);

		TinaNet.getRoute("user:added").sendAll(user);
		TinaEvents.fireEventListener("user:added", user);

		usersMap.set(player, user);
	}

	// eslint-disable-next-line no-inner-declarations
	function remove(player: Player): void {
		const user = usersMap.get(player);

		if (user !== undefined) {
			TinaEvents.fireEventListener("user:removing", user);
			TinaNet.getRoute("user:added").sendAll(user);

			user.unload();
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
	 * @hidden
	 * @param userClass the new user-defined User class.
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
		if (RunService.IsClient() === true) error("Can't retrieve users from the client.");

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
		if (RunService.IsClient() === true) error("Can't retrieve offline users on client!");

		return new OfflineUser(
			userId,
		); /** Initialisation and others can be done within the constructor of the offline user */
	}

	/** Players set/remove from Users, operations for creating and caching, or removing players */
	if (RunService.IsServer() === true) {
		for (const player of Players.GetPlayers()) add(player);

		Players.PlayerAdded.Connect(add);
		Players.PlayerRemoving.Connect(remove);

		game.BindToClose(() => {
			for (const player of Players.GetPlayers()) remove(player);
		});
	}
}
