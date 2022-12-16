import { UserType } from "../../user/types";
import { UPDATEDeclaration } from "../classes/methods/updateTypes";

export interface InternalRouter {
	"user:added": UPDATEDeclaration<UserType>;
	"user:removing": UPDATEDeclaration<UserType>;
}
