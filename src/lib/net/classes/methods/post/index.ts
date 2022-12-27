import { EventListener } from "../../../../events";
import { Users } from "../../../../user";
import Client from "../../../utilities/client";
import Identifiers from "../../../utilities/identifiers";
import Server from "../../../utilities/server";
import { ServerEvent } from "../types";
import { POSTDeclaration } from "./types";

export class PostEndpoint<T> implements POSTDeclaration<T> {
	constructor(private readonly id: string) {
		this.id = Identifiers.create(id);
	}

	public when(): EventListener<ServerEvent<T>> {
		const eventListener: EventListener<ServerEvent<T>> = new EventListener();

		Server.listen(this.id, (player: Player, value: never) => eventListener.call(Users.get(player), value));

		return eventListener;
	}

	public send(toSend: T): void {
		Client.send(this.id, toSend);
	}
}
