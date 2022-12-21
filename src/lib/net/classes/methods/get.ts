import { EventListener } from "../../../events";

import { DefaultUser } from "../../../user/types";
import { User } from "../../../user";

import Client from "../../utilities/client";
import Server from "../../utilities/server";

import { Endpoints } from "./baseEndpoint";

import { GETDeclaration } from "./getTypes";

export class GetEndpoint<S, R> implements GETDeclaration<S, R> {
	private identifier: string;

	constructor(id?: string) {
		this.identifier = Endpoints.createIdentifier(id);
	}

	when(): EventListener<[R]> {
		const eventListener: EventListener<[R]> = new EventListener();

		Client.listen(this.identifier, (value: never) => eventListener.call(value));

		return eventListener;
	}

	reply(func: (user: DefaultUser & unknown, value: S) => R): void {
		Server.listen(this.identifier, (player: Player, value: never) =>
			Server.send(this.identifier, [player], func(User.get(player), value) as {}),
		);
	}

	send(toSend: S): void {
		Client.send(this.identifier, toSend);
	}

	get(): void {
		Client.send(this.identifier, undefined);
	}
}
