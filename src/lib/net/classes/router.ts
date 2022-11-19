import { BaseEndpoints, EndpointsDeclaration, RouterDeclaration } from "./types";

export class RouterClass<T extends EndpointsDeclaration<BaseEndpoints>> implements RouterDeclaration<T> {
	protected readonly routes: T = {} as T;

	/**
	 * Should insert all the endpoints created.
	 *
	 * @param endpoints as EndpointsDeclaration, should denote the directories, remotes, etc. declared/registered to be an endpoint in your network layer.
	 */
	constructor(endpoints: T) {
		for (const [path, networkObject] of pairs(endpoints)) {
			this.routes[path as keyof T] = networkObject as T[keyof T];
		}
	}

	/**
	 * dir should return a path/remote in the registered endpoints, it is RECOMMENDED that at top-level definitions, all should be Directories describing
	 * hierarchically a structure of remotes.
	 *
	 * @param path as keyof T, should be an acceptable key of the dictionary passed with all the endpoints on `registerEndpoints`.
	 * @returns a directory or a Remote.
	 */
	public get<X extends keyof T>(path: X): T[X] {
		return this.routes[path] as unknown as T[X];
	}
}
