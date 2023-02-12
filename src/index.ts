import { RunService } from "@rbxts/services";

import TinaCore from "./lib/core";
import TinaGame from "./lib/core/game";
/* Networking namespace */
import { EventListener } from "./lib/events";
import { TinaEvents, TinaInternalEvents } from "./lib/events/tina_events";
import { Scope } from "./lib/logger";
import Client from "./lib/net/utilities/client";
import Identifiers from "./lib/net/utilities/identifiers";
import Server from "./lib/net/utilities/server";
import { Process } from "./lib/process/process";
import Scheduler from "./lib/process/scheduler";
import { Users } from "./lib/user";
import { AbstractUser } from "./lib/user/default";
import { UserType } from "./lib/user/default/types";

export enum Protocol {
	/** Create/Load Online User Data */
	CLOUD = "CLOUD",
	LCTRL = "LCTRL",
	NET = "NET",
}

namespace Tina {
	const isClient = RunService.IsClient();
	const isServer = RunService.IsServer();

	/**
	 * ! ⚠️ **THIS SHOULD ONLY EVER BE USED ONCE PER GAME** ⚠️ !
	 *
	 * Register the game instance with Tina, this is required for Tina to work. All `Process`es will only begin **after** this is called.
	 *
	 * @param name Name of the game
	 * @returns The game instance, this isn't very useful but contains certain global methods.
	 */
	export function registerGame(name: string): TinaGame {
		/**
		 * Processes initialisation.
		 */
		{
			if (isServer) {
				Server._init();
			} else if (isClient) {
				Client._init();
			}

			Identifiers._init();
		}

		Logger.setName(name);

		// TODO: Auto-Detect `manifest.tina.yml` and load it.
		return new TinaGame();
	}

	/**
	 * ! ⚠️ **THIS SHOULD ONLY EVER BE USED ONCE PER GAME** ⚠️ !
	 *
	 * Override the default User/Player class (useful to define your own behaviours and overall data liveries).
	 *
	 * #### Usage example:
	 *
	 * ```ts
	 * import Tina, { User } from "@rbxts/tina";
	 *
	 * class  extends User {
	 * 	 constructor(ref: Player | number) {
	 * 		super(ref);
	 *   }
	 * }
	 *
	 * Tina.setUserClass(User); // THIS SHOULD BE CALLED **BEFORE** `Tina.registerGame`
	 * Tina.registerGame("MyGame");
	 *
	 * ```
	 *
	 * *NOTE: The Client and Server can use their own User classes, but they should remain compatible with each other.*
	 *
	 * @param userClass The new User class constructor
	 */
	export function setUserClass(userClass: new (ref: Player | number) => UserType): void {
		Users.changeUserClass(userClass); // Changes internally the way user is defined and constructed

		Logger.warn("The User Class has been changed to:", userClass); // Not sure why this is being warned at all.
	}

	/**
	 * Fetch the Tina core, a replacement for the `game` object in the vanilla Roblox API.
	 */
	export function core(): TinaCore {
		return new TinaCore();
	}

	/**
	 * Used to add new processes to the processor.
	 *
	 * @param name process name to add.
	 * @returns a Process object.
	 */
	export function process(name: string): Process {
		if (Process.processes.has(name)) {
			return Process.processes.get(name)!;
		}

		return new Process(name, Scheduler);
	}

	export const Logger = new Scope("unnamed");

	/**
	 * Used to connect to Tina's internal events, such as when a user is registed, etc.
	 *
	 * @param event event name (defined internally specially for Tina)
	 * @returns an EventListener object.
	 */
	export function when<T extends keyof TinaInternalEvents>(event: T): EventListener<[TinaInternalEvents[T]]> {
		return TinaEvents.addEventListener(event);
	}

	/**
	 * `Tina.Mirror` defines any built-in classes that can be replaced.
	 *
	 * Use the methods on Tina's root (such as `Tina.setUserClass`) to actually apply any modifications.
	 */
	export namespace Mirror {
		export const User = AbstractUser;
	}
}

/** Export Tina itself */
export default Tina;

/** Export Conditions Library */
export { COND } from "./lib/conditions";

/** Export EventEmitter Library */
export { EventEmitter, EventListener } from "./lib/events";

/** Export Network Library */
export { Network } from "./lib/net";

/** Audience Utility */
export { Audience } from "./lib/audience/audience";

/** Users namespace */
export { Users } from "./lib/user";

/** Container export */
export { Container } from "./lib/container";

/** Util exports */
export { FunctionUtil } from "./lib/utilities/functions";
