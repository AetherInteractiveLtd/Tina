import TinaCore from "./lib/core";
import TinaGame from "./lib/core/game";

import logger from "./lib/logger";

import { Process } from "./lib/process/process";
import Scheduler from "./lib/process/scheduler";

/* Networking namespace */
import Client from "./lib/net/utilities/client";
import Server from "./lib/net/utilities/server";

import Identifiers from "./lib/net/utilities/identifiers";

/* User abstraction class */
import { User } from "./lib/user/user";
import { RunService } from "@rbxts/services";

export enum Protocol {
	/** Create/Load Online User Data */
	CLOUD = "CLOUD",
	LCTRL = "LCTRL",
	NET = "NET",
}

namespace Tina {
	/**
	 * ! ⚠️ **THIS SHOULD ONLY EVER BE USED ONCE PER GAME** ⚠️ !
	 *
	 * Register the game instance with Tina, this is required for Tina to work. All `Process`es will only begin **after** this is called.
	 *
	 * @param name Name of the game
	 * @returns The game instance, this isn't very useful but contains certain global methods.
	 */
	export function registerGame(name: string): TinaGame {
		{
			/** Networking start up for  */
			Server._init();
			Identifiers._init();
		}

		// TODO: Auto-Detect `manifest.tina.yml` and load it.
		return new TinaGame();
	}

	/**
	 * Starts up the client net, this is only to avoid infinite yields over identifiers.
	 *
	 * @client
	 */
	export function startNet(): void {
		if (RunService.IsClient()) {
			Client._init();
			Identifiers._init();
		}
	}

	/**
	 * ! ⚠️ **THIS SHOULD ONLY EVER BE USED ONCE PER GAME** ⚠️ !
	 *
	 * Override the default User/Player class (useful to define your own behaviours and overall data liveries).
	 *
	 * #### Usage example:
	 *
	 * ```ts
	 * import Tina from "@rbxts/tina";
	 *
	 * class User extends Tina.User {
	 * 	 constructor(userId: number) {
	 * 		super(userId);
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
	 * @param char The new User class constructor
	 */
	export function setUserClass(char: new (userId: number) => User): void {
		TINA_USER_CLASS = char;
		logger.warn("The User Class has been changed to:", char);
	}

	/**
	 * Fetch the Tina core, a replacement for the `game` object in the vanilla Roblox API.
	 */
	export function core(): TinaCore {
		return new TinaCore();
	}

	export function process(name: string): Process {
		if (Process.processes.has(name)) {
			return Process.processes.get(name)!;
		}

		return new Process(name, Scheduler);
	}

	/**
	 * `Tina.Mirror` defines any built-in classes that can be replaced.
	 *
	 * Use the methods on Tina's root (such as `Tina.setUserClass`) to actually apply any modifications.
	 */
	export namespace Mirror {}
}

/** Export Tina itself */
export default Tina;

/** Export Conditions Library */
export { X } from "./lib/conditions";

/** Export EventEmitter Library */
export { EventEmitter } from "./lib/events";

/** Export Network Library */
export { Network } from "./lib/net";

/** User abstract class */
export { User } from "./lib/user/user";

let TINA_USER_CLASS: new (id: number) => User = User as never as new (id: number) => User;
