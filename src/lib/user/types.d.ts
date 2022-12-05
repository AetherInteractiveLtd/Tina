import { FriendPage } from "./methodsTypes";

/**
 * The default user for abstraction on the User abstract class.
 */
export interface DefaultUserDeclaration {
	player: Player;

	load(): Promise<unknown>;
	unload(): Promise<void>;

	/**
	 * Returns whether it's the first session of the player or not.
	 *
	 * @returns a boolean.
	 */
	isFirstSession(): boolean;

	/**
	 * Used to retrieve asynchronously a user's friends.
	 *
	 * @returns a map holding every friend's page by username.
	 */
	friends(): Promise<Map<string, FriendPage>>;

	/**
	 * Used to retrieve asynchronously a user's currently connected friends to the server.
	 *
	 * @returns a map holding every connected friend's page by username.
	 */
	connectedFriends(): Promise<Map<string, FriendPage>>;
}

/**
 * The offline type of user for abstraction on the OfflineUser class.
 */
export interface OfflineUserDeclaration {
	release(): void;
}

/**
 * The user type, for ease of writing
 */
export type UserType = DefaultUserDeclaration & unknown;
