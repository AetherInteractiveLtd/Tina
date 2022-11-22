import { EventListener } from "../../../events";

import { ClientNet } from "../../utilities/client";
import { ServerNet } from "../../utilities/server";

import { Endpoints } from "./baseEndpoint";
import { ServerEvent } from "./baseEndpointTypes";

import { POSTDeclaration } from "./postTypes";

export class PostEndpoint<T extends unknown[]> implements POSTDeclaration<T> {
	private identifier: string;

	constructor() {
		this.identifier = Endpoints.createIdentifier();
	}

	when(): EventListener<ServerEvent<T>> {
		let eventListener!: EventListener<ServerEvent<T>>;

		ServerNet.listen(this.identifier, (player: Player, ...args: unknown[]) => eventListener.call(player, ...args));

		return eventListener;
	}

	public send(...args: T): void {
		ClientNet.call(this.identifier, ...args);
	}
}
