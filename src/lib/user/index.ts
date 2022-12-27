import { Players, RunService } from "@rbxts/services";

import { ClientUser } from "./default/client";
import { ClientUserImplementation } from "./default/client/types";
import { ServerUser } from "./default/server";
import { ServerUserImplementation } from "./default/server/types";
import { DefaultUserDeclaration } from "./default/types";

class DefaultClientUser extends ClientUser implements ClientUserImplementation { }
import { ClientUser } from "./default/client";
import { ClientUserImplementation } from "./default/client/types";
import { ServerUser } from "./default/server";
import { ServerUserImplementation } from "./default/server/types";
import { DefaultUserDeclaration } from "./default/types";

class DefaultClientUser extends ClientUser implements ClientUserImplementation { }

class DefaultServerUser extends ServerUser implements ServerUserImplementation { }
class DefaultServerUser extends ServerUser implements ServerUserImplementation { }

export namespace Users {
	const users: Map<number, DefaultUserDeclaration> = new Map();

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
		export function changeUserClass(userClass: new (ref: Player | number) => DefaultUserDeclaration): void {
			TINA_USER_CLASS = userClass;
		}

		export function get(ref: Player | number): DefaultUserDeclaration {
			return new TINA_USER_CLASS(ref); // Temporary until Network is accepted.
			export function get(ref: Player | number): DefaultUserDeclaration {
				return new TINA_USER_CLASS(ref); // Temporary until Network is accepted.
			}

			{
				/** Users creation */
				if (isServer) {
					Players.PlayerAdded.Connect(player => { });
					{
						/** Users creation */
						if (isServer) {
							Players.PlayerAdded.Connect(player => { });

							Players.PlayerRemoving.Connect(player => { });
						}
						Players.PlayerRemoving.Connect(player => { });
					}
				}
			}

			export { DefaultUserDeclaration as DefaultUser } from "./default/types";
			export { DefaultUserDeclaration as DefaultUser } from "./default/types";
