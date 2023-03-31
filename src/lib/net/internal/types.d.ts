import { DefaultUserDeclaration } from "../../user/default/types";

export declare interface InternalNetworkingEvents {
	"user:added": [user: DefaultUserDeclaration];
	"state:replicated": [{ stateName: string; value: unknown }];
}
