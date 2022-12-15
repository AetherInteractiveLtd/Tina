import { UserType } from "../user/types";
import { AudienceDeclaration } from "./types";

export class Audience implements AudienceDeclaration {
	private listed: Array<Player> = [];

	public list(audience: Array<UserType> | Array<Player>): AudienceDeclaration {
		for (const viewer of audience) {
			this.listed.push(typeOf(viewer) === "Instance" ? (viewer as Player) : (viewer as UserType).player);
		}

		return this;
	}

	public get(): Array<Player> {
		return this.listed;
	}

	public clean(): AudienceDeclaration {
		this.listed = [];

		return this;
	}
}
