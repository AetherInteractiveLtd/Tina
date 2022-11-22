import { BaseEndpoints, EndpointsDeclaration, RouterDeclaration } from "./types";

export class Router<T extends EndpointsDeclaration<BaseEndpoints>> implements RouterDeclaration<T> {
	/**
	 * Should insert all the endpoints created.
	 *
	 * @param endpoints as EndpointsDeclaration, should denote the directories, remotes, etc. declared/registered to be an endpoint in your network layer.
	 */
	constructor(private readonly endpoints: T) {}

	/**
	 * dir should return a path/remote in the registered endpoints, it is RECOMMENDED that at top-level definitions, all should be Directories describing
	 * hierarchically a structure of remotes.
	 *
	 * @param path as keyof T, should be an acceptable key of the dictionary passed with all the endpoints on `registerEndpoints`.
	 * @returns a directory or a Remote.
	 */
	public get<X extends keyof T>(path: X): T[X] {
		return this.endpoints[path];
	}
}
