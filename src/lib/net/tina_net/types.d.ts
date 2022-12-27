import { UPDATEDeclaration } from "../classes/methods/update/types";

/**
 * Internal endpoints used within Tina, necessary for every interaction that may concern us from the final user.
 */
export interface InternalRouter {
	"user:added": UPDATEDeclaration<never>;
	"user:removing": UPDATEDeclaration<never>;
}
