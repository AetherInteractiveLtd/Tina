import { BaseEndpointObjectDeclaration } from "./baseEndpointTypes";

import { EventListener } from "../../../events";

interface UPDATEServerObjectDeclaration<T extends unknown[]> {
	/**
	 * UPDATE is a one-way method, which lets client listen for changes request from the server, client can't send any data back or send any packet at all.
	 *
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").send(...);
	 * ```
	 *
	 * @server
	 * @param args should be the arguments described beforehand when creating the objects.
	 */
	send(to: Player[], ...args: [...T]): void;
}

interface UPDATEClientObjectDeclaration<T extends unknown[]> extends BaseEndpointObjectDeclaration<T> {
	/**
	 * when returns an event listener used to bind actions to be called.
	 *
	 * @server
	 * @returns an EventListener.
	 */
	when(): EventListener<T>;
}

export declare type UPDATEDeclaration<T extends unknown[] = unknown[]> = UPDATEServerObjectDeclaration<T> &
	UPDATEClientObjectDeclaration<T>;
