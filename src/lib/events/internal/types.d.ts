import { DefaultUserDeclaration } from "../../user/default/types";

export interface TinaInternalEvents {
	"user:added": [user: DefaultUserDeclaration];
	"user:removing": [user: DefaultUserDeclaration];
}
