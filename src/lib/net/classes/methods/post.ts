import { EventListener } from "../../../events/events";

import { Users } from "../../../user/user";

import Client from "../../utilities/client";
import Server from "../../utilities/server";

import { Endpoints } from "./baseEndpoint";
import { ServerEvent } from "./baseEndpointTypes";

import { POSTDeclaration } from "./postTypes";

export class PostEndpoint<T> implements POSTDeclaration<T> {
	private identifier: string;

	constructor(id?: string) {
		this.identifier = Endpoints.createIdentifier(id);
	}

	when(): EventListener<ServerEvent<T>> {
		const eventListener: EventListener<ServerEvent<T>> = new EventListener();

		Server.listen(this.identifier, (player: Player, value: never) => eventListener.call(Users.get(player), value));

		return eventListener;
	}

	send(toSend: T): void {
		Client.send(this.identifier, toSend);
	}
}
