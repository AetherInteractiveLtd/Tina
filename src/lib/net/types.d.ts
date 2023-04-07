import { RepositoryImplementation } from "./classes/repository/types";

export declare type BaseEndpoints = object;

export declare type EndpointsDeclaration<T extends BaseEndpoints> = Record<
	string,
	RepositoryImplementation<T>
>;
