/* Types */
/* GET */
import { GetEndpoint } from "./classes/methods/get";
import { GETDeclaration } from "./classes/methods/getTypes";
/* POST */
import { PostEndpoint } from "./classes/methods/post";
import { POSTDeclaration } from "./classes/methods/postTypes";
/* UPDATE */
import { UpdateEndpoint } from "./classes/methods/update";
import { UPDATEDeclaration } from "./classes/methods/updateTypes";
import { Repository } from "./classes/repository";
/**
 * Networking object holders
 */
import { Router } from "./classes/router";
import {
	BaseEndpoints,
	EndpointsDeclaration,
	RepositoryDeclaration,
	RepositoryObjectDeclaration,
	RouterDeclaration,
} from "./classes/types";

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
		export function POST<T>(identifier?: string): POSTDeclaration<T> {
			return new PostEndpoint(identifier);
		}

		/**
		 * UPDATE is a network method which lets you send data to the client, this doesn't expect anything back.
		 *
		 * @param identifier possible unique identifier, can be empty.
		 * @returns an UPDATE Endpoint
		 */
		export function UPDATE<T>(identifier?: string): UPDATEDeclaration<T> {
			return new UpdateEndpoint(identifier);
		}

		/**
		 * GET is a network method, lets you retrieve data, send data to the server and expect a response back from it. All the data being sent back
		 * is handled by an EventListener via chaining (this opens the opportunity to handle the data being sent back with conditions, this makes this
		 * method powerful).
		 * ```
		 *
		 * @param identifier possible unique identifier, can be empty.
		 * @returns a GET Endpoint.
		 */
		export function GET<S, R>(identifier?: string): GETDeclaration<S, R> {
			return new GetEndpoint(identifier);
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
		return new Router(endpoints);
	}

	/**
	 * Network.repository should create a new Repository object that can either contain other repositories, or well, the networking objects you require.
	 *
	 * @param repositoryObject should describe an object with the possible values that can be within.
	 * @returns a new Repository object.
	 */
	export function repository<T extends RepositoryDeclaration>(repositoryObject: T): RepositoryObjectDeclaration<T> {
		return new Repository(repositoryObject);
	}
}
