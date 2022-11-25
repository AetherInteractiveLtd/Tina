import Tina from "../../../..";

import { EventListener } from "../../../events";

import { ClientNet } from "../../utilities/client";
import { ServerNet } from "../../utilities/server";

import { Endpoints } from "./baseEndpoint";

import { GETDeclaration } from "./getTypes";

export class GetEndpoint<S, R> implements GETDeclaration<S, R> {
	private identifier: string;

	constructor(id?: string) {
		this.identifier = Endpoints.createIdentifier(id);
	}

	reply(func: (user: Tina.Mirror.User & unknown, value: S) => R): void {
		ServerNet.listen(this.identifier, (player: Player, value: never) =>
			ServerNet.call(this.identifier, [player], func(Tina.Mirror.User.get(player), value)),
		);
	}

	send(toSend: S): void {
		ClientNet.call(this.identifier, toSend);
	}

	get(): void {
		ClientNet.call(this.identifier);
	}

	when(): EventListener<[R]> {
		let eventListener!: EventListener<[R]>;

		ClientNet.listen(this.identifier, (value: never) => eventListener.call(value));

		return eventListener;
	}
}
