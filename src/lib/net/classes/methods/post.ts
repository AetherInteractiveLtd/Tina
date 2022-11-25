import Tina from "../../../..";
import { EventListener } from "../../../events";

import { ClientNet } from "../../utilities/client";
import { ServerNet } from "../../utilities/server";

import { Endpoints } from "./baseEndpoint";
import { ServerEvent } from "./baseEndpointTypes";

import { POSTDeclaration } from "./postTypes";

export class PostEndpoint<T> implements POSTDeclaration<T> {
	private identifier: string;

	constructor(id?: string) {
		this.identifier = Endpoints.createIdentifier(id);
	}

	when(): EventListener<ServerEvent<T>> {
		let eventListener!: EventListener<ServerEvent<T>>;

		ServerNet.listen(this.identifier, (player: Player, value: never) =>
			eventListener.call(Tina.Mirror.User.get(player), value),
		);

		return eventListener;
	}

	send(toSend: T): void {
		ClientNet.call(this.identifier, toSend);
	}
}
