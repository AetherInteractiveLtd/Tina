import { ClientUserImplementation } from "./client/types";
import { ServerUserImplementation } from "./server/types";

export declare type DefaultUserDeclaration = ClientUserImplementation & ServerUserImplementation & unknown;
