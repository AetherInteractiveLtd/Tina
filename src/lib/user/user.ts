import { Players } from "@rbxts/services";

import { DefaultUser } from "./types";

export abstract class User implements DefaultUser {
	constructor(private ref: Player | number) {}

	/**
	 * Returns a User defined class.
	 */
	public static get(from: Player | never | string | number): never {
		return "" as never; /* This still makes no sense to me, what exactly is a "User" if it's of type never always */
	}

	public player(): Player {
		return (typeOf(this.ref) === "number" ? Players.GetPlayerByUserId(this.ref as number) : (this.ref as Player))!;
	}

	public load() {}

	public unload() {}
}
