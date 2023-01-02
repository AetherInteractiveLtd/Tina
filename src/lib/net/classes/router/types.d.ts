import { BaseEndpoints } from "../../types";

/**
 * Router class implementation for bootstrapping
 */
export interface RouterDeclaration<T extends BaseEndpoints> {
	/**
	 * @hidden
	 */
	endpoints: T;

	/**
	 * Returns whatever it was stored within the specified directory.
	 *
	 * @param path as keyof T, should be an acceptable key of the dictionary passed with all the endpoints on `registerEndpoints`.
	 * @returns a directory or a Remote.
	 */
	dir<X extends keyof T>(path: X): T[X];
}
