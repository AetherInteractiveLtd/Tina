import { Players } from "@rbxts/services";

import { TinaEvents } from "../events/tina_events";
import { TinaNet } from "../net/tina_net";
import { ClientUser } from "./default/client";
import { ClientUserImplementation } from "./default/client/types";
import { ServerUser } from "./default/server";
import { ServerUserImplementation } from "./default/server/types";
import { DefaultUserDeclaration } from "./default/types";

class DefaultClientUser extends ClientUser implements ClientUserImplementation { }

class DefaultServerUser extends ServerUser implements ServerUserImplementation { }
class DefaultServerUser extends ServerUser implements ServerUserImplementation { }

export namespace Users {
	const users: Map<Player, DefaultUserImplementation> = new Map();
	let TINA_USER_CLASS = DefaultUser as never as new (ref: Player | number) => DefaultUserImplementation;

	/**
	 * Used to change the User class from where all the Users are created.
	 *
	 * @hidden
	 * @param userClass the new user-defined User class.
	 */
	export function changeUserClass(userClass: new (ref: Player | number) => DefaultUserDeclaration): void {
		export function changeUserClass(userClass: new (ref: Player | number) => DefaultUserDeclaration): void {
			TINA_USER_CLASS = userClass;
		}

		/**
		 * Used to retrieve a player's user, in-game at that moment. To retrieve offline users use `.getOffline(userId: number)`.
		 *
		 * @param from a player or a number used to retrieve the player's user.
		 * @returns a User object constructed from your defined User class.
		 */
		export function get(from: Player | number): UserType {
			if (RunService.IsClient() === true) error("Can't retrieve users from the client.");

			const ref =
				type(from) === "number"
					? Players.GetPlayerByUserId(from as number) !== undefined
						? Players.GetPlayerByUserId(from as number)
						: error(`[Tina:User]: User seems to not exist at all, id provided=${from}`)
					: (from as Player);

			const possibleUser = users.get(ref!);
			const user = possibleUser !== undefined ? possibleUser : new TINA_USER_CLASS(ref!);

			return user;
		}

		{
			/** Users creation */
			if (isServer) {
				Players.PlayerAdded.Connect(player => { });
				{
					/** Users creation */
					if (isServer) {
						Players.PlayerAdded.Connect(player => { });

						// Events
						{
							TinaEvents.fireEventListener("user:added", user as never);
							TinaNet.get("user:added").send(player, user as never);
						}
					}

					Players.PlayerRemoving.Connect((player: Player): void => {
						const user = users.get(player);

						if (user !== undefined) {
							users.delete(player);

							// Events
							{
								TinaEvents.fireEventListener("user:removing", user as never);
								TinaNet.get("user:removing").send(player, user as never);
							}
						}
					});
				}
			}

			export { DefaultUserDeclaration as DefaultUser } from "./default/types";
			export { DefaultUserDeclaration as DefaultUser } from "./default/types";
