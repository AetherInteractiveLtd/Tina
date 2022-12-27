import { AudienceDeclaration } from "../../../audience/types";

export interface FriendPage {
	AvatarFinal: boolean;
	AvatarUri: string;
	Id: number;
	Username: string;
	IsOnline: boolean;
}

export interface ServerUserImplementation {
	player: Player;

	/**
	 * Retrieves a user's friends.
	 *
	 * @server
	 *
	 * @param onlineOnly if set to true, will only return friends online.
	 */
	friends(onlineOnly?: boolean): Promise<Map<string, FriendPage>>;

	/**
	 * Retrieves friends who are connected within the user's server.
	 *
	 * @server
	 */
	friendsInServer(): Promise<Map<string, FriendPage>>;

	/**
	 * Teleports a user to the given place id.
	 *
	 * @server
	 *
	 * @param placeId the place id.
	 * @param users an audience.
	 * @param options TeleportOptions, optional (pun intended).
	 */
	teleport(placeId: number, options?: TeleportOptions): Promise<TeleportAsyncResult>;
}
