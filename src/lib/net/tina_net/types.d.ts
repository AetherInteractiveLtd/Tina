import { UPDATEDeclaration } from "../classes/methods/updateTypes";

export interface InternalRouter {
	"user:added": UPDATEDeclaration<never>;
	"user:removing": UPDATEDeclaration<never>;
}
