import { RunService } from "@rbxts/services";

import { RouterClass } from "./classes/router";
import { RepositoryClass } from "./classes/directory";

/* Types */
import {
	BaseEndpoints,
	RepositoryDeclaration,
	RepositoryObjectDeclaration,
	EndpointsDeclaration,
	RouterDeclaration,
} from "./classes/types";

import { GetEndpointClient, GetEndpointServer } from "./classes/remotes/get";
import { GETDeclaration } from "./classes/remotes/getTypes";

export namespace Network {
	const isServer = RunService.IsServer();

	/**
	 * Network.Method lets you describe what type of Network object you will be working with.
	 */
	export namespace Method {
		export function GET<
			T extends (...args: unknown[]) => defined = (...args: unknown[]) => defined,
		>(): GETDeclaration<T> {
			if (isServer) {
				return new GetEndpointServer() as GETDeclaration<T>;
			} else {
				return new GetEndpointClient() as GETDeclaration<T>;
			}
		}
	}

	/**
	 * Network.registerEndpoints lets you create a new router, which will hold all your networking objects (repositories, methods, etc).
	 *
	 * @param endpoints as interface EndpointsDeclaration<BaseEndpoints>
	 * @returns a new Router object.
	 */
	export function registerEndpoints<T extends EndpointsDeclaration<BaseEndpoints>>(
		endpoints: T,
	): RouterDeclaration<T> {
		return new RouterClass(endpoints);
	}

	/**
	 * Network.repository should create a new Repository object that can either contain other repositories, or well, the networking objects you require.
	 *
	 * @param repositoryDescription should describe an object with the possible values that can be within.
	 * @returns a new Repository object.
	 */
	export function repository<T extends RepositoryDeclaration<BaseEndpoints>>(
		repositoryDescription: T,
	): RepositoryObjectDeclaration<T> {
		return new RepositoryClass(repositoryDescription);
	}
}

/**
 * Little testing place for typings
 */
const Endpoints = Network.registerEndpoints({
	dev: Network.repository({
		tests: Network.repository({
			event: Network.Method.GET<() => number>(),
		}),
	}).developmentOnly(),
});

Endpoints.get("dev").path("tests").path("event");
