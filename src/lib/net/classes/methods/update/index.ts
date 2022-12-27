import { AudienceDeclaration } from "../../../../audience/types";
import { EventListener } from "../../../../events";
import Client from "../../../utilities/client";
import Identifiers from "../../../utilities/identifiers";
import Server from "../../../utilities/server";
import { UPDATEDeclaration } from "./types";

export class UpdateEndpoint<T> implements UPDATEDeclaration<T> {
	constructor(private readonly id: string) {
		this.id = Identifiers.create(id);
	}

	public when(): EventListener<[value: T]> {
		const eventListener: EventListener<[T]> = new EventListener();

		Client.listen(this.id, (value: never) => eventListener.call(value));

		return eventListener;
	}

	public send(to: AudienceDeclaration | Player, toSend: T): void {
		Server.send(
			this.id,
			typeOf(to) === "Instance" ? [to as Player] : (to as AudienceDeclaration).get(),
			toSend as {},
		);
	}

	public sendAll(value: T): void {
		Server.sendAll(this.id, value);
	}

	public sendAllExcept(blacklist: AudienceDeclaration, value: T): void {
		Server.sendAllExcept(this.id, blacklist.get(), value);
	}
}
