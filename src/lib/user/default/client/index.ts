import { ClientUserImplementation } from "./types";

export class ClientUser implements ClientUserImplementation {
	constructor(public readonly player: Player) {}

	public move(to: CFrame | BasePart): void {
		const character = this.player.Character;

		if (character !== undefined) {
			character.PivotTo(type(to) === "userdata" ? (to as CFrame) : (to as BasePart).CFrame);
		}
	}
}
