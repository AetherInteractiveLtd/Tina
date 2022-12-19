import { Players } from "@rbxts/services";
import { DefaultUser } from "./types";

export abstract class User implements DefaultUser {
	public player: Player;

	private static users: Map<number, DefaultUser> = new Map();

	constructor(private ref: Player | number) {
		this.player = (
			typeOf(this.ref) === "number" ? Players.GetPlayerByUserId(this.ref as number) : (this.ref as Player)
		)!;
	}

	public static changeUserClass(userClass: new (ref: Player | number) => User): void {
		TINA_USER_CLASS = userClass;
	}

	public static get(from: Player | number): DefaultUser & unknown {
		let id = typeOf(from) === "number" ? from as number : (from as Player).UserId;
		return this.users.get(id)! ?? this.users.set(id, new TINA_USER_CLASS(from)).get(id)!;
	}

	public getGui(name: string = "ScreenGui") {
		return this.player.FindFirstChild("PlayerGui")?.FindFirstChild(name) as ScreenGui | undefined;
	}

	public load() {}

	public unload() {}
}

let TINA_USER_CLASS = User as never as new (ref: Player | number) => DefaultUser & unknown;
