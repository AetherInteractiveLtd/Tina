import { RepositoryImplementation } from "./classes/repository/types";

export interface BaseEndpoints { }
export declare type EndpointsDeclaration<T extends BaseEndpoints> = Record<string, RepositoryImplementation<T> | T>;
