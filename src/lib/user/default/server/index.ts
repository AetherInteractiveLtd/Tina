import { Players, TeleportService } from "@rbxts/services";

import logger from "../../../logger";
import { FriendPage, ServerUserImplementation } from "./types";

export class ServerUser implements ServerUserImplementation {
	public player: Player;

	constructor(private ref: Player | number) {
		this.player = (
			typeOf(this.ref) === "number" ? Players.GetPlayerByUserId(this.ref as number) : (this.ref as Player)
		)!;
	}

	public async friends(onlineOnly?: boolean): Promise<Map<string, FriendPage>> {
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
			logger.warn(
				`[TinaUser]: There has been an error while trying to retrieve ${this.player}'s${onlineOnly === true ? " online" : ""
				} friends. More information: `,
				e,
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
			logger.warn(
				`[TinaUser]: There has been an error while trying to retrieve ${this.player}'s friends in server. More information: `,
				e,
			);
		}

		return friends;
	}

	public async teleport(placeId: number, options?: TeleportOptions | undefined): Promise<TeleportAsyncResult> {
		return TeleportService.TeleportAsync(placeId, [this.player], options);
	}
}
