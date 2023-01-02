import { BucketType } from "../../container/classes/bucket/types";
import { Template } from "../../container/types";

/**
 * The default user for abstraction on the User abstract class.
 */
export interface DefaultUserImplementation {
	player: Player;

	/**
	 * Used to check if it's the User's first session.
	 *
	 * @returns a boolean.
	 */
	isFirstSession(): boolean;

	/**
	 * Used to retrieve asynchronously a user's friends.
	 *
	 * @returns a map holding every friend's page by username.
	 */
	friends(onlineOnly?: boolean): Promise<Map<string, FriendPage>>;

	/**
	 * Used to retrieve asynchronously a user's currently connected friends to the server.
	 *
	 * @returns a map holding every connected friend's page by username.
	 */
	friendsInServer(): Promise<Map<string, FriendPage>>;

	/**
	 * Loads the user to retrieve it's data.
	 *
	 * @param bucket that was already declared.
	 */
	loadInto<T extends Template>(bucket: BucketType<T>): Loader<T>;

	/**
	 * Unloads the user from the specified bucket.
	 *
	 * @param bucket that was already declared.
	 */
	unloadFrom<T extends Template>(bucket: BucketType<T>): void;
}

/**
 * The user type, for ease of writing
 */
export type UserType = DefaultUserImplementation & unknown;

/**
 * The FriendPage types
 */
export interface FriendPage {
	AvatarFinal: boolean;
	AvatarUri: string;
	Id: number;
	Username: string;
	IsOnline: boolean;
}

/**
 * Load into
 */
export interface Loader<T extends Template> {
	as: (id: string) => T;
}
