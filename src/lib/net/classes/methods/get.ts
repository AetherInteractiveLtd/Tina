import Tina from "../../../..";

import { EventListener } from "../../../events";

import { ClientNet } from "../../utilities/client";
import { ServerNet } from "../../utilities/server";

import { Endpoints } from "./baseEndpoint";

import { GETDeclaration } from "./getTypes";

export class GetEndpoint<T extends Callback> implements GETDeclaration<T> {
	private identifier: string;

	constructor(id?: string) {
		this.identifier = Endpoints.createIdentifier(id);
	}

	reply<P extends Parameters<T>, R extends ReturnType<T>>(func: (user: never, ...args: P) => R): void {
		ServerNet.listen(this.identifier, (player: Player, ...args: unknown[]) =>
			ServerNet.call(this.identifier, [player], func(Tina.Mirror.User.get(player), ...(args as P))),
		);
	}

	send<P extends Parameters<T>>(...args: P): void {
		ClientNet.call(this.identifier, ...(args as P));
	}

	get(): void {
		ClientNet.call(this.identifier);
	}

	when<X extends ReturnType<T>>(): EventListener<X> {
		let eventListener!: EventListener<X>;

		ClientNet.listen(this.identifier, (...args: unknown[]) => eventListener.call(...args));

		return eventListener;
	}
}
