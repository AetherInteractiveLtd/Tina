import { Players } from "@rbxts/services";

import { AudienceDeclaration } from "../../../audience/types";

import { EventListener } from "../../../events";

import { ClientNet } from "../../utilities/client";
import { ServerNet } from "../../utilities/server";

import { Endpoints } from "./baseEndpoint";

import { UPDATEDeclaration } from "./updateTypes";

export class UpdateEndpoint<T> implements UPDATEDeclaration<T> {
	private identifier: string;

	constructor(id?: string) {
		this.identifier = Endpoints.createIdentifier(id);
	}

	when(): EventListener<[value: T]> {
		let eventListener!: EventListener<[T]>;

		ClientNet.listen(this.identifier, (value: never) => eventListener.call(value));

		return eventListener;
	}

	public send(to: AudienceDeclaration | Player, toSend: T): void {
		ServerNet.call(
			this.identifier,
			typeOf(to) === "Instance" ? [to as Player] : (to as AudienceDeclaration).getListed(),
			toSend,
		);
	}

	public sendAll(value: T) {
		ServerNet.call(this.identifier, Players.GetPlayers(), value); /* How one retrieve all the users available? */
	}
}
