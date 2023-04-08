import { ClientUserImplementation } from "./client/types";
import { ServerUserImplementation } from "./server/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type Constructable = new (...args: Array<any>) => object;

export declare type DefaultUserDeclaration =
	| ClientUserImplementation
	| ServerUserImplementation
	| never;
