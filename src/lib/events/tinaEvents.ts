import { EventListener } from "./events";

export interface TinaInternalEvents {
	"user:added": () => void;
	"user:removing": () => void;
}

export namespace TinaEvents {
	const events: Map<string, Array<EventListener>> = new Map();

	export function addEventListener<T extends keyof TinaInternalEvents>(eventTo: T): EventListener<[never]> {
		const event = new EventListener<[never]>();
		const listeners = events.get(eventTo);

		if (listeners === undefined) {
			events.set(eventTo, [event]);
		} else {
			events.get(eventTo)!.push(event);
		}

		return event;
	}

	export function fireEventListener<T extends keyof TinaInternalEvents>(eventTo: T, ...args: unknown[]): void {
		const listeners = events.get(eventTo);

		if (listeners !== undefined) {
			for (const eventListener of listeners) {
				eventListener.call(...args);
			}
		}
	}
}
