import { EventListener } from "../../../../events";
import { Users } from "../../../../user";
import { UserType } from "../../../../user/default/types";
import Client from "../../../utilities/client";
import Identifiers from "../../../utilities/identifiers";
import Server from "../../../utilities/server";
import { GETDeclaration } from "./types";

export class GetEndpoint<S, R> implements GETDeclaration<S, R> {
	constructor(private readonly id: string) {
		this.id = Identifiers.create(id);
	}

	public when(): EventListener<[R]> {
		const eventListener: EventListener<[R]> = new EventListener();

		Client.listen(this.id, (value: never) => eventListener.call(value));

		return eventListener;
	}

	public reply(func: (user: UserType, value: S) => R): void {
		Server.listen(this.id, (player: Player, value: never) =>
			Server.send(this.id, [player], func(Users.get(player), value) as {}),
		);
	}

	public send(toSend: S): void {
		Client.send(this.id, toSend);
	}

	public get(): void {
		Client.send(this.id, undefined);
	}
}
