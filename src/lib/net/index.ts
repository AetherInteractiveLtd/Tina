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

/* POST */
import { PostEndpoint } from "./classes/methods/post";
import { POSTDeclaration } from "./classes/methods/postTypes";

/* UPDATE */

/* GET */

export namespace Network {
	/**
	 * Network.Method is a namespace containing all the available methods that Tina offers to work with the networking layer.
	 */
	export namespace Method {
		/**
		 * POST is a network method which lets you send data to the server, this doesn't expect anything back. Shouldn't be used careless.
		 *
		 * @param identifier possible unique identifier, can be empty.
		 * @returns a POST Endpoint.
		 */
		export function POST<T extends unknown[] = unknown[]>(identifier?: string): POSTDeclaration<T> {
			return new PostEndpoint<T>();
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
