import { ConditionCallback } from "../../../conditions/types";

export interface ClientRemoteObjectDeclaration<T extends unknown[]> {}

export interface ServerRemoteObjectDeclaration<T extends unknown[]> {}

/**
 * Remotes type, later on some of them are used for inferance on the event being used
 */
export interface BaseEndpointObjectDeclaration<T extends unknown[]> {
	condition<X extends ConditionCallback>(condition: X): BaseEndpointObjectDeclaration<T>;
	do<X>(func: (...args: [...T]) => X): BaseEndpointObjectDeclaration<[X]>;
	when(): BaseEndpointObjectDeclaration<T>;
}
