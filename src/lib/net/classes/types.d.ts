import { BaseEndpointObjectDeclaration, Endpoint } from "./methods/baseEndpointTypes";

/*
 * Declarations
 */
export interface BaseEndpoints {}
export interface BaseRepository {}

export declare type EndpointsDeclaration<T extends BaseEndpoints> = Record<
	string,
	| BaseEndpointObjectDeclaration<[...Parameters<T[Extract<keyof T, string | symbol>]>]>
	| RepositoryObjectDeclaration<T>
>;

export type RepositoryDeclaration<T extends BaseRepository> = {
	[X in keyof T]: Endpoint<[T[X]]> | RepositoryObjectDeclaration<T>;
};

/**
 * Router class implementation for bootstrapping
 */
export interface RouterDeclaration<T extends BaseEndpoints> {
	get<X extends keyof T>(path: X): T[X];
}

/**
 * Directory class implementation for bootstrapping
 */
export interface RepositoryObjectDeclaration<T extends BaseRepository> {
	path<X extends keyof T>(event: X): T[X];
	developmentOnly(): RepositoryObjectDeclaration<T>;
}
