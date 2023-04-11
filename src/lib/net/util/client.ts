import { RunService } from "@rbxts/services";

import { Identifiers } from "./identifiers";
import { ClientListener, Contents, Packet } from "./types";

export namespace Client {
	const queue: Array<Packet> = [];
	const listeners: { [x: string]: Array<ClientListener> } = {};

	/** @hidden */
	export function init(): void {
		const remote = script.Parent?.Parent?.WaitForChild("[...Tina]") as RemoteEvent;

		RunService.PostSimulation.Connect(() => {
			remote.FireServer(queue);
			table.clear(queue);
		});

		remote.OnClientEvent.Connect((packet: Packet) => {
			if (listeners[packet.id] === undefined) {
				warn(
					`[Networking:Client]: Callback expected got nil on ${Identifiers.decompress(
						packet.id,
					)}`,
				);
			} else {
				for (const listener of listeners[packet.id]) {
					task.spawn(() => listener(packet.contents));
				}
			}
		});
	}

	/**
	 * Sends data over the network to the server.
	 *
	 * @param id endpoint's id.
	 * @param value of type `T` described previously on declaration.
	 */
	export function send(id: string, contents: Contents): void {
		queue.push({ id, contents });
	}

	/**
	 * Binds a callback for server's request.
	 *
	 * @param id endpoint's id.
	 * @param callback being a function of type `(value: never) => void`.
	 */
	export function listen(id: string, callback: ClientListener): void {
		if (listeners[id] === undefined) {
			listeners[id] = [callback];
		} else {
			listeners[id].push(callback);
		}
	}
}
