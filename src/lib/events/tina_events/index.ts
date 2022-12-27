import { RunService } from "@rbxts/services";

import { TinaNet } from "../../net/tina_net";
import { EventListener } from "..";

export interface TinaInternalEvents {
	"user:added": never;
	"user:removing": never;
}

export namespace TinaEvents {
	const events: Map<string, Array<EventListener>> = new Map();

	/**
	 * Adds a listener to the specific event mentioned, approach as there can't be recursive
	 * imports from a file to the root file (Tina namespace).
	 *
	 * @param to Tina event
	 * @returns and EventListener
	 */
	export function addEventListener<T extends keyof TinaInternalEvents>(
		to: T,
	): EventListener<[TinaInternalEvents[T]]> {
		const isServer = RunService.IsServer();

		if (isServer) {
			const event = new EventListener<[never]>();
			const listeners = events.get(to as string);

			if (listeners === undefined) {
				events.set(to as string, [event]);
			} else {
				events.get(to as string)!.push(event);
			}

			return event;
		} else {
			return TinaNet.get(to).when();
		}
	}

	/**
	 * Invoke of the specified event.
	 *
	 * @param to event to emit.
	 * @param args the arguments for such event.
	 */
	export function fireEventListener<T extends keyof TinaInternalEvents>(
		to: T,
		...args: [...TinaInternalEvents[T]]
	): void {
		const listeners = events.get(to);

		if (listeners !== undefined) {
			for (const eventListener of listeners) {
				void eventListener.call(...args);
			}
		}
	}
}
