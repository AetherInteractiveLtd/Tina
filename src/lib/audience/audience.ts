import { AudienceDeclaration } from "./types";

import { UserType } from "../user/types";

export class Audience implements AudienceDeclaration {
	private listed: Player[] = [];

	public list(audience: UserType[] | Player[]): AudienceDeclaration {
		for (const viewer of audience) {
			this.listed.push(typeOf(viewer) === "Instance" ? (viewer as Player) : (viewer as UserType).player);
		}

		return this;
	}

	public get(): Player[] {
		return this.listed;
	}

	public clean(): AudienceDeclaration {
		this.listed = [];

		return this;
	}
}
