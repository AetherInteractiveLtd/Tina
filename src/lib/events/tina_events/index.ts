import { EventListener } from "..";

export interface TinaInternalEvents {
	"user:added": () => void;
	"user:removing": () => void;
}

export namespace TinaEvents {
	const events: Map<string, Array<EventListener>> = new Map();

	/**
	 * Adds a listener to the specific event mentioned, approach as there can't be recursive
	 * imports from a file to the root file (Tina namespace).
	 *
	 * @param eventTo Tina event
	 * @returns and EventListener
	 */
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

	/**
	 * Should emit to the event, invoking and chaining all the listeners previously binded to it.
	 *
	 * @param eventTo event to emit.
	 * @param args arguments for the event, defined previously.
	 */
	export function fireEventListener<T extends keyof TinaInternalEvents>(eventTo: T, ...args: Array<unknown>): void {
		const listeners = events.get(eventTo);

		if (listeners !== undefined) {
			for (const eventListener of listeners) {
				void eventListener.call(...args);
			}
		}
	}
}
