/**
 * TODO: routing extra functionality, it needs a way to let user define not only directories but events at the same level, even for only fast-testing purposes
 */

import { DirectoryDeclaration, EndpointsDeclaration, RouterDeclaration } from "../types";

export class RouterClass<T extends EndpointsDeclaration> implements RouterDeclaration<T> {
	protected readonly routes: Map<keyof T, DirectoryDeclaration> = new Map();

	/**
	 * TODO: add functionality.
	 *
	 * @param endpoints as EndpointsDeclaration, should denote the directories, remotes, etc. declared/registered to be an endpoint in your network layer.
	 */
	constructor(endpoints: T) {}

	path<X extends keyof T>(path: X): T[X] {
		return this.routes.get(path)! as T[X];
	}
}
