import { EventListener } from "../../../events";

import { ClientNet } from "../../utilities/client";
import { ServerNet } from "../../utilities/server";

import { Endpoints } from "./baseEndpoint";

import { UPDATEDeclaration } from "./updateTypes";

export class UpdateEndpoint<T extends unknown[]> implements UPDATEDeclaration<T> {
	private identifier: string;

	constructor(id?: string) {
		this.identifier = Endpoints.createIdentifier(id);
	}

	when(): EventListener<T> {
		let eventListener!: EventListener<T>;

		ClientNet.listen(this.identifier, (...args: unknown[]) => eventListener.call(...args));

		return eventListener;
	}

	public send(user: never, ...args: T): void {
		ServerNet.call(this.identifier, [(user as { player: Player }).player], ...args);
	}

	public sendAll(...args: T) {
		ServerNet.call(this.identifier, [], ...args); /* Left blank, the all Users needs discussion */
	}
}
