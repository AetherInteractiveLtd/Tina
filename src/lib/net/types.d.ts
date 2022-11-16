/**
 * Remotes type, later on some of them are used for inferance on the event being used
 */
export interface BaseEvent<T extends unknown[]> {
	condition<X extends () => boolean | boolean>(condition: X): BaseEvent<T>;
	do<X>(func: (...args: [...T]) => X): BaseEvent<[X]>;
	when(): BaseEvent<T>;
}

/**
 * Declarations
 */
export interface EndpointsDeclaration {
	[x: string]: unknown;
}

export interface DirectoryDeclaration {
	[x: string]: DirectoryDeclaration | (() => void);
}

/**
 * Router class implementation for bootstrapping
 */
export interface RouterDeclaration<T extends EndpointsDeclaration> {
	path<X extends keyof T>(path: X): T[X];
}

/**
 * Directory class implementation for bootstrapping
 */
export interface DirectoryObjectDeclaration<T> {
	get<X extends keyof T>(event: X): T[X];
}

/**
 *
 * Remotes class implementation for bootstrapping
 */
export interface RemoteObjectDeclaration<T extends unknown[]> {}
