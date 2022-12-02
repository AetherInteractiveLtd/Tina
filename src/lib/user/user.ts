import { Players, RunService } from "@rbxts/services";

import { DefaultUserDeclaration, OfflineUserDeclaration } from "./types";

import logger from "../logger";

export class User implements DefaultUserDeclaration {
	public player: Player;

	constructor(private ref: Player | number) {
		this.player = (
			typeOf(this.ref) === "number" ? Players.GetPlayerByUserId(this.ref as number) : (this.ref as Player)
		)!;
	}

	async load(): Promise<unknown> {
		return ""; /** What it is "loading" itself? And from "where"? */
	}

	async unload(): Promise<void> {}
}

class OfflineUser extends User implements OfflineUserDeclaration {
	release(): void {
		/** Somehow, release the offline user if no longer needed */
	}
}

export namespace Users {
	const usersMap: Map<Player, DefaultUserDeclaration> = new Map();

	let TINA_USER_CLASS = User as never as new (ref: Player | number) => DefaultUserDeclaration & unknown;

	export async function add(player: Player) {
		const user = new TINA_USER_CLASS(player);
		await user
			.load()
			.catch((e) =>
				logger.warn(`[User]: Player's data couldn't be loaded correctly. More information: ${e}`),
			); /** User load? */

		usersMap.set(player, user);
	}

	export async function remove(player: Player) {
		const user = usersMap.get(player);
		if (user !== undefined) {
			await user
				.unload()
				.catch((e) =>
					logger.warn(`[User]: Player's data couldn't be unloade correctly. More information: ${e}`),
				); /** User unload? */
		}

		usersMap.delete(player);
	}

	export function changeUserClass(userClass: new (ref: Player | number) => DefaultUserDeclaration & unknown): void {
		TINA_USER_CLASS = userClass;
	}

	export function get<T extends Player | number>(
		from: T,
	): T extends number ? OfflineUserDeclaration : DefaultUserDeclaration & unknown {
		const user =
			usersMap.get(typeOf(from) === "Instance" ? (from as Player) : Players.GetPlayerByUserId(from as number)!) ??
			new TINA_USER_CLASS(from);

		if (user === undefined) {
			/** If user is undefined, it means that it is offline and it should be retrieved, loaded and cached for later
			 * access, maybe this should be another type of User itself, so it has methods like .release() when no longer needed.
			 */
			const offlineUser = new OfflineUser(from as number);

			return offlineUser;
		}

		return user as T extends number ? OfflineUserDeclaration : DefaultUserDeclaration & unknown;
	}

	/** Players set/remove from Users */
	if (RunService.IsServer()) {
		for (const player of Players.GetPlayers()) add(player);

		Players.PlayerAdded.Connect(add);
		Players.PlayerRemoving.Connect(remove);

		game.BindToClose(() => {
			for (const player of Players.GetPlayers()) remove(player);
		});
	}
}
