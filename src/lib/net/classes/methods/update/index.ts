import { AudienceDeclaration } from "../../../../audience/types";
import { EventListener } from "../../../../events";
import { Client } from "../../../util/client";
import { Server } from "../../../util/server";
import { AbstractEndpoint } from "../endpoint/endpoint";
import { UPDATEDeclaration } from "./types";

export class UpdateEndpoint<T> extends AbstractEndpoint implements UPDATEDeclaration<T> {
	public when(): EventListener<[value: T]> {
		const eventListener: EventListener<[T]> = new EventListener();

		Client.listen(this.id, value => eventListener.call(value));

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
		Server.sendAll(this.id, value as never);
	}

	public sendAllExcept(blacklist: AudienceDeclaration, value: T): void {
		Server.sendAllExcept(this.id, blacklist.get(), value as never);
	}
}
