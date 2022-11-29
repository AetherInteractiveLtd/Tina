import { RunService } from "@rbxts/services";

import Identifiers from "../../utilities/identifiers";

/**
 * A namespace with utiliy functions for Endpoints.
 */
export namespace Endpoints {
	/**
	 * Creates compressed identifiers from previous uniquely generated beforehand, or depending on context.
	 *
	 * @param identifier possible identifier as string, this should denote a unique identifier.
	 * @returns a compressed/packed identifier.
	 */
	export function createIdentifier(identifier?: string): string {
		const id = identifier ?? "";

		return RunService.IsServer()
			? Identifiers.createIdentifier(id)
			: RunService.IsClient()
			? Identifiers.waitForIdentifier(id)
			: "";
	}
}
