import { Players, TeleportService } from "@rbxts/services";

import { FriendPage, ServerUserImplementation } from "./server/types";
import { Constructable } from "./types";

export function DefaultUser<T extends Constructable>(BaseClass: T) {
	class ServerUser extends BaseClass implements ServerUserImplementation {
		public player: Player;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		constructor(...args: Array<any>) {
			const neverArgs = args as Array<never>;
			super(...neverArgs);

			this.player = neverArgs[0];
		}

		public async friends(onlineOnly?: boolean): Promise<Map<string, FriendPage>> {
			const friends: Map<string, FriendPage> = new Map();

			try {
				const friendsPages = Players.GetFriendsAsync(this.player.UserId);

				if (friendsPages !== undefined) {
					do {
						for (const page of friendsPages.GetCurrentPage()) {
							if (onlineOnly && !page.IsOnline) {
								continue;
							}

							friends.set(page.Username, page);
						}

						friendsPages.AdvanceToNextPageAsync();
					} while (!friendsPages.IsFinished);
				}
			} catch (e) {
				warn(
					`[Tina:User]: There has been an error while trying to retrieve ${
						this.player
					}'s${onlineOnly === true ? " online" : ""} friends. More information: ${e}`,
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
							if (!page.IsOnline) {
								continue;
							}

							if (Players.FindFirstChild(page.Username) !== undefined) {
								friends.set(page.Username, page);
							}
						}

						friendsPages.AdvanceToNextPageAsync();
					} while (!friendsPages.IsFinished);
				}
			} catch (e) {
				warn(
					`[Tina:User]: There has been an error while trying to retrieve ${this.player}'s friends in server. More information: `,
					e,
				);
			}

			return friends;
		}

		public async teleport(
			placeId: number,
			options?: TeleportOptions | undefined,
		): Promise<TeleportAsyncResult> {
			return TeleportService.TeleportAsync(placeId, [this.player], options);
		}
	}

	return ServerUser;
}
