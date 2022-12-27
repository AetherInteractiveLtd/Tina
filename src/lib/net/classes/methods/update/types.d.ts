import { AudienceDeclaration } from "../../../../audience/types";
import { EventListener } from "../../../../events";

interface UPDATEServerObjectDeclaration<T> {
	/**
	 * UPDATE is a one-way method, which lets client listen for changes request from the server, client can't send any data back or send any packet at all.
	 *
	 * @example
	 * ```
	 * NET.get("core").path("networkObject").send(...);
	 * ```
	 *
	 * @server
	 * @param to should be an audience with listed users, or a player array.
	 * @param toSend should be the value described when declaring the method.
	 */
	send(to: AudienceDeclaration | Player, toSend: T): void;

	/**
	 * Used as a short-hand for sending to all players.
	 *
	 * @server
	 * @param value should be the value described when declaring the method.
	 */
	sendAll(value: T): void;
}

interface UPDATEClientObjectDeclaration<T> {
	/**
	 * when returns an event listener used to bind actions to be called.
	 *
	 * @client
	 * @returns an EventListener.
	 */
	when(): EventListener<[value: T]>;
}

export declare type UPDATEDeclaration<T> = UPDATEServerObjectDeclaration<T> & UPDATEClientObjectDeclaration<T>;
