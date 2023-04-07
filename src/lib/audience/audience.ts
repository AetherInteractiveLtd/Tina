import { DefaultUserDeclaration } from "../user/default/types";
import { AudienceDeclaration } from "./types";

export class Audience implements AudienceDeclaration {
	private listed: Array<Player> = [];

	public list(audience: Array<DefaultUserDeclaration> | Array<Player>): AudienceDeclaration {
		for (const viewer of audience) {
			this.listed.push(
				typeOf(viewer) === "Instance"
					? (viewer as Player)
					: (viewer as DefaultUserDeclaration).player,
			);
		}

		return this;
	}

	public get(): Array<Player> {
		return this.listed;
	}

	public isEmpty(): boolean {
		return this.listed.isEmpty();
	}

	public clean(): AudienceDeclaration {
		table.clear(this.listed);

		return this;
	}
}
