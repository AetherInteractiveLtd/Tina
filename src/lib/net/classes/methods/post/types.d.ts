import { EventListener } from "../../../../events";
import { ServerEvent } from "../types";

export interface POSTServerObjectImplementation<T> {
	/**
	 * when returns an event listener used to bind actions to be called.
	 *
	 * @server
	 * @returns an EventListener with the first parameter being the user and the args passed to the declaration.
	 */
	when(): EventListener<ServerEvent<T>>;
}

export interface POSTClientObjectImplementation<T> {
	/**
	 * POST is a one-way method, which lets client send requests of change to the server, server won't be able to send any data back.
	 *
	 * @client
	 * @param toSend should be the arguments described before hand when creating the objects.
	 */
	send(toSend: T): void;
}

export declare type POSTDeclaration<T> = POSTServerObjectImplementation<T> &
	POSTClientObjectImplementation<T>;
