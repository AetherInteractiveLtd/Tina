import { DefaultUser } from "../user/types";

import { AudienceDeclaration } from "./types";

export class Audience implements AudienceDeclaration {
	private listed: Player[] = [];

	public list(audience: (DefaultUser & unknown)[] | Player[]): AudienceDeclaration {
		for (const viewer of audience) {
			this.listed.push(typeOf(viewer) === "Instance" ? (viewer as Player) : (viewer as DefaultUser).player);
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
