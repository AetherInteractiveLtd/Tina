import { EventListener } from "../../../events";
import { Users } from "../../../user";
import { DefaultUserDeclaration } from "../../../user/default/types";
import Client from "../../utilities/client";
import Server from "../../utilities/server";
import { Endpoints } from "./baseEndpoint";
import { GETDeclaration } from "./getTypes";

export class GetEndpoint<S, R> implements GETDeclaration<S, R> {
	private identifier: string;

	constructor(id?: string) {
		this.identifier = Endpoints.createIdentifier(id);
	}

	public when(): EventListener<[R]> {
		const eventListener: EventListener<[R]> = new EventListener();

		Client.listen(this.identifier, (value: never) => eventListener.call(value));

		return eventListener;
	}

	public reply(func: (user: DefaultUserDeclaration, value: S) => R): void {
		Server.listen(this.identifier, (player: Player, value: never) =>
			Server.send(this.identifier, [player], func(Users.get(player), value) as {}),
		);
	}

	public send(toSend: S): void {
		Client.send(this.identifier, toSend);
	}

	public get(): void {
		Client.send(this.identifier, undefined);
	}
}
