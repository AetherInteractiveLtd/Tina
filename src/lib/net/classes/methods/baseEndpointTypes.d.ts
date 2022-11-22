import { GETDeclaration } from "./getTypes";
import { POSTDeclaration } from "./postTypes";

/**
 * Base endpoint declaration object, describing what it should be like.
 */
export interface BaseEndpointObjectDeclaration<T extends unknown[]> {}

/**
 * Endpoint insertion for the event types, so we do it and users don't be mad at us for not doing it automatically.
 */
export type ServerEvent<T extends unknown[]> = [user: never, ...args: T];

/**
 * General type of endpoints
 */
export declare type Endpoint<T> =
	| GETDeclaration<T extends Callback ? Callback : never>
	| POSTDeclaration<T extends unknown[] ? unknown[] : never>;
