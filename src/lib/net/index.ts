/**
 * TODO: add methods functionality, add extra functionality to the Networking (feel like something is missing), add middleware.
 */

import { X } from "../conditions";
import { DirectoryClass } from "./classes/directory";
import { RemoteClass } from "./classes/remote";
import { RouterClass } from "./classes/router";

/* Types */
import {
	DirectoryDeclaration,
	DirectoryObjectDeclaration,
	EndpointsDeclaration,
	RemoteObjectDeclaration,
	RouterDeclaration,
} from "./types";

export namespace Network {
	export namespace Method {
		/**
		 * The async methods needs some discussion, also the ClientRequest it should ALWAYS be asynchronous, so it lets handle data when is sent back.
		 */

		export function ClientRequestAsync<T extends () => unknown>(): void {}

		export function ServerToClient<T extends unknown[]>(): RemoteObjectDeclaration<T> {
			return new RemoteClass();
		}

		export function ServerToClientAsync<T extends unknown[]>(): void {}

		export function ClientToServer<T extends unknown[]>() {}

		export function ClientToServerAsync<T extends unknown[]>(): void {}
	}

	export function registerEndpoints<T extends EndpointsDeclaration>(endpoints: T): RouterDeclaration<T> {
		return new RouterClass(endpoints);
	}

	export function directory<T extends DirectoryDeclaration>(directory: T): DirectoryObjectDeclaration<T> {
		return new DirectoryClass(directory);
	}
}

/**
 * Little testing place for typings
 */
const EndpointsDeclaration = Network.registerEndpoints({
	game: Network.directory({
		startGame: Network.Method.ServerToClient<[number]>(),
	}),
});

/**
 * Non-workable test, but it isn't intended to work either way, it's for typing testing.
 */
EndpointsDeclaration.path("game")
	.get("startGame")
	.do((guessingNumber: number) => {
		return "";
	})
	.condition(X.EVAL(X.AND(true, true))) // This won't let it run until I implement state as well, will test with falsy and truthy values instead on the unit test
	.do((winnerName: string) => print(`${winnerName} has won the gamed!`)); // This will ONLY run, only and only if the previous condition was satisfied as true, if not, will jump over the next.
