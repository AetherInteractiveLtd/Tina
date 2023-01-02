import { Players } from "@rbxts/services";

import { BucketType } from "../../container/classes/bucket/types";
import { ItemType } from "../../container/classes/item/types";
import { Template } from "../../container/types";
import { DefaultUserImplementation, FriendPage, Loader } from "./types";

export abstract class AbstractUser implements DefaultUserImplementation {
	private firstSession!: boolean;
	private items: Map<string, ItemType<never>> = new Map();

	public player: Player;

	constructor(private ref: Player | number) {
		this.player = (
			typeOf(this.ref) === "number" ? Players.GetPlayerByUserId(this.ref as number) : (this.ref as Player)
		)!;
	}

	public isFirstSession(): boolean {
		return this.firstSession;
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

	public loadInto<T extends Template>(bucket: BucketType<T>): Loader<T> {
		return {
			as: (id: string): T => {
				const bucketItem = bucket.getItem(id);

				this.items.set(bucket.key, bucketItem as ItemType<never>);
				this.firstSession = bucketItem!.metadata.is_first_session;

				return bucketItem!.data;
			},
		};
	}

	public unloadFrom<T extends Template>(bucket: BucketType<T>): void {
		const isLoadedOn = this.items.has(bucket.key);

		if (isLoadedOn !== undefined && isLoadedOn === true) {
			const itemLoadedOn = this.items.get(bucket.key);
			itemLoadedOn?.lose();

			this.items.delete(bucket.key);
		}
	}
}
