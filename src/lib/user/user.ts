import { Players } from "@rbxts/services";
import { DefaultUser } from "./types";

export abstract class User implements DefaultUser {
	public player: Player;

	constructor(private ref: Player | number) {
		this.player = (
			typeOf(this.ref) === "number" ? Players.GetPlayerByUserId(this.ref as number) : (this.ref as Player)
		)!;
	}

	public static changeUserClass(userClass: new (ref: Player | number) => User): void {
		TINA_USER_CLASS = userClass;
	}

	public static get(from: Player | number): DefaultUser & unknown {
		return new TINA_USER_CLASS(from);
	}

	public load() {}

	public unload() {}
}

let TINA_USER_CLASS = User as never as new (ref: Player | number) => DefaultUser & unknown;
