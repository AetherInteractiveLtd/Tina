import { UPDATEDeclaration } from "../classes/methods/update/types";

export interface InternalRouter {
	"user:added": UPDATEDeclaration<never>;
	"user:removing": UPDATEDeclaration<never>;
}
