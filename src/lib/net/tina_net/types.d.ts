import { DefaultUserDeclaration } from "../../user/default/types";
import { GETDeclaration } from "../classes/methods/get/types";
import { UPDATEDeclaration } from "../classes/methods/update/types";

export interface ExposedEndpoints {
	"user:added": UPDATEDeclaration<DefaultUserDeclaration>;
	"user:removing": UPDATEDeclaration<DefaultUserDeclaration>;
}

/**
 * Exposed net events that can be used within Tina.when(""), goes
 */
export interface Exposed {
	"user:added": DefaultUserDeclaration;
	"user:removing": DefaultUserDeclaration;
}

export interface InternalEndpoints {
	"user:get": GETDeclaration<undefined, DefaultUserDeclaration>;
}

/**
 * Internal events such as users retrieve, replication of state, goes here.
 */
export interface Internals {
	"user:get": Player;
}
