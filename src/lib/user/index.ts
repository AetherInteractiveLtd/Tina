import { Players, RunService } from "@rbxts/services";

import { TinaEvents } from "../events/tina_events";
import { TinaNet } from "../net/tina_net";
import { ClientUser } from "./default/client";
import { ClientUserImplementation } from "./default/client/types";
import { ServerUser } from "./default/server";
import { ServerUserImplementation } from "./default/server/types";
import { DefaultUserDeclaration } from "./default/types";

class DefaultClientUser extends ClientUser implements ClientUserImplementation { }

class DefaultServerUser extends ServerUser implements ServerUserImplementation { }

export namespace Users {
	const users: Map<Player, DefaultUserDeclaration> = new Map();

	const isServer = RunService.IsServer();

	/**
	 * @hidden
	 */
	export let TINA_USER_CLASS = (isServer ? DefaultServerUser : DefaultClientUser) as never as new (
		ref: Player | number,
	) => DefaultUserDeclaration;

	/**
	 * Used to change the User class from where all the Users are created.
	 *
	 * @hidden
	 * @param userClass the new user-defined User class.
	 */
	export function changeUserClass(userClass: new (ref: Player | number) => DefaultUserDeclaration): void {
		TINA_USER_CLASS = userClass;
	}

	export function get(ref: Player | number): DefaultUserDeclaration {
		return new TINA_USER_CLASS(ref); // Temporary until Network is accepted.
	}

	{
		/** Users creation */
		if (isServer) {
			Players.PlayerAdded.Connect(player => { });

			TinaEvents.fireEventListener("user:added", user);
			TinaNet.get("user:added")?.send(player, user as never);
		}

		Players.PlayerRemoving.Connect((player: Player): void => {
			const user = users.get(player);

			if (user !== undefined) {
				users.delete(player);

				TinaEvents.fireEventListener("user:removing", user);
				TinaNet.get("user:removing")?.send(player, user as never);
			}
		});
	}
}

export { DefaultUserDeclaration as DefaultUser } from "./default/types";
