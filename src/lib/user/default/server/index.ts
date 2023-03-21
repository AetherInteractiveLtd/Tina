import { Players, TeleportService } from "@rbxts/services";

import { Constructable } from "../types";
import { FriendPage, ServerUserImplementation } from "./types";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ServerUser<T extends Constructable>(BaseClass: T) {
	class ServerUser extends BaseClass implements ServerUserImplementation {
		public player: Player;
		public ref: Player | number;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		constructor(...args: Array<any>) {
			const neverArgs = args as Array<never>;

			super(...neverArgs);
			this.ref = neverArgs[0];
			this.player = (
				typeOf(this.ref) === "number"
					? Players.GetPlayerByUserId(this.ref as number)
					: (this.ref as Player)
			)!;
		}

		public async friends(onlineOnly?: boolean): Promise<Map<string, FriendPage>> {
			const friends: Map<string, FriendPage> = new Map();

			try {
				const friendsPages = Players.GetFriendsAsync(this.player.UserId);

				if (friendsPages !== undefined) {
					do {
						for (const page of friendsPages.GetCurrentPage()) {
							// if (onlineOnly && page.IsOnline) {
							friends.set(page.Username, page);
							// } else if (onlineOnly === undefined) {
							//	friends.set(page.Username, page);
							// }
						}

						friendsPages.AdvanceToNextPageAsync();
					} while (!friendsPages.IsFinished);
				}
			} catch (e) {
				warn(
					`[TinaUser]: There has been an error while trying to retrieve ${this.player}'s${
						onlineOnly === true ? " online" : ""
					} friends. More information: ${e}`,
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
							if (page.IsOnline === false) continue;

							if (Players.FindFirstChild(page.Username) !== undefined) {
								friends.set(page.Username, page);
							}
						}

						friendsPages.AdvanceToNextPageAsync();
					} while (!friendsPages.IsFinished);
				}
			} catch (e) {
				warn(
					`[TinaUser]: There has been an error while trying to retrieve ${this.player}'s friends in server. More information: `,
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
