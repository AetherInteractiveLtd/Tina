import { GetEndpoint } from "./classes/methods/get";
import { GETDeclaration } from "./classes/methods/get/types";
import { PostEndpoint } from "./classes/methods/post";
import { POSTDeclaration } from "./classes/methods/post/types";
import { UpdateEndpoint } from "./classes/methods/update";
import { UPDATEDeclaration } from "./classes/methods/update/types";
import { Repository } from "./classes/repository";
import { BaseRepository, RepositoryImplementation } from "./classes/repository/types";
import { Router } from "./classes/router";
import { RouterDeclaration } from "./classes/router/types";
import { BaseEndpoints, EndpointsDeclaration } from "./types";

export namespace Network {
	/**
	 * A namespace holding all the possible method for the networking interaction.
	 */
	export namespace Method {
		/**
		 * POST is used to send data such as `client -> server`.
		 *
		 * @param id possible unique identifier, can be empty.
		 */
		export function POST<T>(): POSTDeclaration<T> {
			return new PostEndpoint();
		}

		/**
		 * UPDATE is a network method which lets you send data to the client, this doesn't expect anything back.
		 *
		 * @param identifier possible unique identifier, can be empty.
		 */
		export function UPDATE<T>(): UPDATEDeclaration<T> {
			return new UpdateEndpoint();
		}

		/**
		 * GET is used to send and receive data from the client. You can imagine it as `client -> server -> client`.
		 *
		 * @param identifier possible unique identifier, can be empty.
		 */
		export function GET<S, R>(): GETDeclaration<S, R> {
			return new GetEndpoint();
		}
	}

	/**
	 * Creates a new router, which can be accessed later on to work with your endpoints. This method **SHOULD** be used once.
	 *
	 * @param endpoints your endpoints declaration.
	 */
	export function registerEndpoints<T extends EndpointsDeclaration<BaseEndpoints>>(
		endpoints: T,
	): RouterDeclaration<T> {
		return new Router(endpoints);
	}

	/**
	 * Creates a new repository for structuring your endpoints.
	 *
	 * @param repository your repository.
	 */
	export function repository<T extends BaseRepository>(
		repository: T,
	): RepositoryImplementation<T> {
		return new Repository(repository);
	}
}
