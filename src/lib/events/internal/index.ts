import { EventEmitter } from "..";
import { TinaInternalEvents } from "./types";

class InternalEvents extends EventEmitter<TinaInternalEvents> {
	public fire<X extends keyof TinaInternalEvents, U extends TinaInternalEvents[X]>(
		token: keyof TinaInternalEvents,
		...args: U
	): void {
		return this.emit(token, ...args);
	}
}

export const TinaEvents = new InternalEvents();
