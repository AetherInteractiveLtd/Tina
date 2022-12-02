import { DefaultUserDeclaration } from "../user/types";

import { AudienceDeclaration } from "./types";

export class Audience implements AudienceDeclaration {
	private listed: Player[] = [];

	public list(audience: (DefaultUserDeclaration & unknown)[] | Player[]): AudienceDeclaration {
		for (const viewer of audience) {
			this.listed.push(typeOf(viewer) === "Instance" ? (viewer as Player) : (viewer as DefaultUserDeclaration).player);
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
