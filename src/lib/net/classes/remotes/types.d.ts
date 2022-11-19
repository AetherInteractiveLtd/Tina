import { ConditionCallback } from "../../../conditions/types";
import { GETDeclaration } from "./getTypes";
import { POSTDeclaration } from "./postTypes";

/**
 * Remotes type, later on some of them are used for inferance on the event being used
 */
export interface BaseEndpointObjectDeclaration<T extends unknown[]> {
	condition<X extends ConditionCallback>(condition: X): BaseEndpointObjectDeclaration<T>;
	do<X>(func: (...args: [...T]) => X): BaseEndpointObjectDeclaration<[X]>;
	when(): BaseEndpointObjectDeclaration<T>;
}

/**
 * General type of endpoints
 */
export declare type Endpoint<T> =
	| GETDeclaration<T extends Callback ? Callback : never>
	| POSTDeclaration<T extends unknown[] ? unknown[] : never>;
