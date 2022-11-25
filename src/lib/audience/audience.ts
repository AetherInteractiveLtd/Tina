import { DefaultUser } from "../../types";

import { AudienceDeclaration } from "./types";

export class Audience implements AudienceDeclaration {
	private listed: Player[] = [];

	public list(users: never[] | Player[]): AudienceDeclaration {
		for (const user of users) {
			this.listed.push((user as unknown as DefaultUser).player?.() ?? user);
		}

		return this;
	}

	public getListed(): Player[] {
		return this.listed;
	}

	public cleanList(): AudienceDeclaration {
		this.listed = [];

		return this;
	}
}
