import { Players, RunService } from "@rbxts/services";

import { EventListener } from "../../events";
import { FunctionUtil } from "../../util/functions";
import { Identifiers } from "../util/identifiers";
import { ClientListener, Packet, ServerListener } from "../util/types";
import { InternalNetworkingEvents } from "./types";

export namespace Internals {
	let remote: RemoteEvent | undefined;

	const listeners: Map<string, Array<ClientListener | ServerListener>> = new Map();
	const isServer = RunService.IsServer();

	const queue: Array<{ to?: Array<Player>; contents?: object; id: string }> = [];

	// eslint-disable-next-line no-inner-declarations
	function listen(id: string, callback: ClientListener | ServerListener): void {
		if (listeners.has(id)) {
			listeners.set(id, [callback]);
		} else {
			listeners.get(id)!.push(callback);
		}
	}

	/** @hidden */
	export function init(): void {
		if (!isServer) {
			remote = script.WaitForChild("[Internals]") as RemoteEvent | undefined;

			RunService.PostSimulation.Connect(() => {
				if (queue.size() < 1) return;
				remote?.FireServer(queue);

				table.clear(queue);
			});

			remote?.OnClientEvent.Connect((packet: Packet) => {
				for (const listener of listeners.get(packet.id)!) {
					FunctionUtil.runOnFreeThread(listener, packet.contents);
				}
			});
		} else {
			remote = new Instance("RemoteEvent", script);
			remote.Name = "[Internals]";

			RunService.PostSimulation.Connect(() => {
				if (queue.size() < 1) return;

				for (const packet of queue) {
					if (packet.to === undefined) return;

					for (const player of packet.to) {
						remote?.FireClient(player, {
							id: packet.id,
							contents: packet.contents,
						});
					}
				}

				table.clear(queue);
			});

			remote.OnServerEvent.Connect((player, packets) => {
				for (const packet of packets as typeof queue) {
					if (listeners.has(packet.id)) {
						warn(
							`[InternalNetworking:Server]: Callback expected got nil on ${Identifiers.decompress(
								packet.id,
							)}`,
						);
					} else {
						for (const listener of listeners.get(packet.id)!) {
							FunctionUtil.runOnFreeThread(listener, player, packet.contents);
						}
					}
				}
			});
		}
	}

	/**
	 * Updates client within the internal event.
	 *
	 * @server
	 *
	 * @param to player to send to.
	 * @param id event id.
	 * @param contents for packet being sent.
	 */
	export function update<T extends keyof InternalNetworkingEvents>(
		to: Player,
		id: T,
		contents?: object,
	): void {
		return void queue.push({ to: [to], id, contents });
	}

	/**
	 * Updates all clients within the internal event.
	 *
	 * @server
	 *
	 * @param id event id.
	 * @param contents for packet being sent.
	 */
	export function updateAll<T extends keyof InternalNetworkingEvents>(
		id: T,
		contents?: object,
	): void {
		return void queue.push({ to: Players.GetPlayers(), id, contents });
	}

	/**
	 * Posts a request to the server.
	 *
	 * @client
	 *
	 * @param id event id.
	 * @param contents for packet being sent.
	 */
	export function post<T extends keyof InternalNetworkingEvents>(id: T, contents?: object): void {
		return void queue.push({ id, contents });
	}

	/**
	 * Binds callback to event specified (either client or server).
	 *
	 * @param id event id.
	 */
	export function when<T extends keyof InternalNetworkingEvents>(
		id: T,
	): EventListener<InternalNetworkingEvents[T]> {
		const eventListener: EventListener<InternalNetworkingEvents[T]> = new EventListener();

		listen(id, (...args: Array<unknown>) => eventListener.call(...args));

		return eventListener;
	}
}
