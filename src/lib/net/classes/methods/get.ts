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
		ServerNet.listen(
			this.identifier,
			(player: Player, ...args: unknown[]) =>
				ServerNet.call(
					this.identifier,
					[player],
					func("" as never, ...(args as P)),
				) /* The string part is a user, still need to work that out. */,
		);
	}

	send<P extends Parameters<T>>(...args: P): void {
		ClientNet.call(
			this.identifier,
			...(args as P),
		); /* typescript dumb right here, delete the as P and you'll see an error */
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
