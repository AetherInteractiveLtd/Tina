import { EventListener } from "../../../../events";
import { Users } from "../../../../user";
import Client from "../../../utilities/client";
import Server from "../../../utilities/server";
import { AbstractEndpoint } from "../endpoint/endpoint";
import { ServerEvent } from "../types";
import { POSTDeclaration } from "./types";

export class PostEndpoint<T> extends AbstractEndpoint implements POSTDeclaration<T> {
	public when(): EventListener<ServerEvent<T>> {
		const eventListener: EventListener<ServerEvent<T>> = new EventListener();

		Server.listen(this.id, (player: Player, value: never) =>
			eventListener.call(Users.get(player), value),
		);

		return eventListener;
	}

	public send(toSend: T): void {
		Client.send(this.id, toSend);
	}
}
