import { AudienceDeclaration } from "../../../audience/types";

import { EventListener } from "../../../events";

import Client from "../../utilities/client";
import Server from "../../utilities/server";

import { Endpoints } from "./baseEndpoint";

import { UPDATEDeclaration } from "./updateTypes";

export class UpdateEndpoint<T> implements UPDATEDeclaration<T> {
	private identifier: string;

	constructor(id?: string) {
		this.identifier = Endpoints.createIdentifier(id);
	}

	when(): EventListener<[value: T]> {
		const eventListener: EventListener<[T]> = new EventListener();

		Client.listen(this.identifier, (value: never) => eventListener.call(value));

		return eventListener;
	}

	public send(to: AudienceDeclaration | Player, toSend: T): void {
		Server.send(
			this.identifier,
			typeOf(to) === "Instance" ? [to as Player] : (to as AudienceDeclaration).getListed(),
			toSend as {},
		);
	}

	public sendAll(value: T) {
		Server.sendAll(this.identifier, value);
	}

	public sendAllExcept(blacklist: AudienceDeclaration, value: T) {
		Server.sendAllExcept(this.identifier, blacklist.getListed(), value);
	}
}
