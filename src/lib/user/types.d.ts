import { Template } from "../container/types";
import { FriendPage } from "./methods";

/**
 * The default user for abstraction on the User abstract class.
 */
export interface DefaultUserDeclaration {
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
	friends(onlineOnly: boolean): Promise<Map<string, FriendPage>>;

	/**
	 * Used to retrieve asynchronously a user's currently connected friends to the server.
	 *
	 * @returns a map holding every connected friend's page by username.
	 */
	friendsInServer(): Promise<Map<string, FriendPage>>;

	/**
	 * Used to load the User into a bucket. It loads their data.
	 *
	 * @returns a promise, the loaded data it's returned successfully from it.
	 */
	load(options: LoadingOptions): Promise<typeof options["template"] | undefined>;

	/**
	 * Used to unload a User from the bucket he was inserted into. It unloads and saves their data.
	 *
	 * @returns void
	 */
	unload(): void;
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

/**
 * Loader types
 */
export type LoadingOptions = {
	bucket: string;
	item: string;

	template?: Template;
};
