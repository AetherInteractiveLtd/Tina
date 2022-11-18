import { BaseEndpointObjectDeclaration } from "./remotes/types";

/*
 * Declarations
 */
export interface BaseEndpoints {}
export interface BaseDirectory {}

export declare type EndpointsDeclaration<T extends BaseEndpoints> = Record<
	string,
	BaseEndpointObjectDeclaration<[...Parameters<T[Extract<keyof T, string | symbol>]>]> | DirectoryDeclaration<T>
>;

export interface DirectoryDeclaration<T extends BaseDirectory>
	extends Record<
		string,
		BaseEndpointObjectDeclaration<[T[Extract<keyof T, string | symbol>]]> | DirectoryDeclaration<T>
	> {}

/**
 * Router class implementation for bootstrapping
 */
export interface RouterDeclaration<T extends BaseEndpoints> {
	dir<X extends keyof T>(path: X): T[X];
}

/**
 * Directory class implementation for bootstrapping
 */
export interface DirectoryObjectDeclaration<T extends BaseDirectory> {
	path<X extends keyof T>(event: X): T[X];
	developmentOnly(): DirectoryObjectDeclaration<T>;
}
