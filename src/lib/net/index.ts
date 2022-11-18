/**
 * TODO: add methods functionality, add extra functionality to the Networking (feel like something is missing), add middleware.
 */

import { ServerRemote } from "./classes/remotes/serverEndpoint";
import { RouterClass } from "./classes/router";

import { DirectoryClass } from "./classes/directory";

/* Types */
import {
	BaseDirectory,
	BaseEndpoints,
	DirectoryDeclaration,
	DirectoryObjectDeclaration,
	EndpointsDeclaration,
	RouterDeclaration,
} from "./classes/types";

export namespace Network {
	export namespace Method {}

	export function registerEndpoints<T extends EndpointsDeclaration<BaseEndpoints>>(
		endpoints: T,
	): RouterDeclaration<T> {
		return new RouterClass(endpoints);
	}

	export function dir<T extends BaseDirectory, U extends DirectoryDeclaration<T>>(
		directory: U,
	): DirectoryObjectDeclaration<U> {
		return new DirectoryClass(directory);
	}
}

/**
 * Little testing place for typings
 */
const EndpointsDeclaration = Network.registerEndpoints({
	dev: Network.dir({
		tests: Network.dir({
			event: new ServerRemote<[player: Player, ...args: unknown[]]>("server"),
		}),
	}).developmentOnly(),
});
