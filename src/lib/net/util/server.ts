import { Players, RunService } from "@rbxts/services";

import { FunctionUtil } from "../../util/functions";
import { Identifiers } from "./identifiers";
import { Contents, InitialPacket, Packet, ServerListener } from "./types";

function getWhiteListed(list: { [x: string]: boolean }): Array<Player> {
	const to: Array<Player> = [];

	for (const player of Players.GetPlayers()) {
		if (list[player.Name] !== undefined) {
			to.push(player);
		}
	}

	return to;
}

export namespace Server {
	const queue: Array<InitialPacket> = [];
	const listeners: { [x: string]: Array<ServerListener> } = {};

	/** @hidden */
	export function init(): void {
		const remote = new Instance("RemoteEvent", script.Parent?.Parent);
		remote.Name = "[...Tina]";

		RunService.PostSimulation.Connect(() => {
			for (const packet of queue) {
				for (const player of packet.to) {
					remote.FireClient(player, {
						contents: packet.contents,
					} as Packet);
				}
			}

			table.clear(queue);
		});

		remote.OnServerEvent.Connect((player, packets) => {
			for (const packet of packets as Array<Packet>) {
				if (listeners[packet.id] === undefined) {
					warn(
						`[Networking:Server]: Callback expected got nil on ${Identifiers.fromCompressed(
							packet.id,
						)}`,
					);
				} else {
					for (const listener of listeners[packet.id]) {
						FunctionUtil.runOnFreeThread(listener, player, packet.contents);
					}
				}
			}
		});
	}

	/**
	 * Sends data over the network to the client.
	 *
	 * @param id endpoint's id.
	 * @param value of type `T` described previously on declaration.
	 */
	export function send(id: string, to: Array<Player>, contents: Contents): void {
		queue.push({ id, to, contents });
	}

	/**
	 * Sends data over the network to all the connected clients.
	 *
	 * @param id endpoint's id.
	 * @param value of type `T` described previously on declaration.
	 */
	export function sendAll(id: string, contents: Contents): void {
		queue.push({ id, to: Players.GetPlayers(), contents });
	}

	/**
	 * Sends data over the network to all the non-blacklisted clients.
	 *
	 * @param id endpoint's id.
	 * @param blacklist should be an array of players to blacklist.
	 * @param value of type `T` described previously on declaration.
	 */
	export function sendAllExcept(id: string, blacklist: Array<Player>, contents: Contents): void {
		const blacklisted: { [x: string]: boolean } = {};

		for (const player of blacklist) {
			blacklisted[player.Name] = true;
		}

		queue.push({ id, to: getWhiteListed(blacklisted), contents });
	}

	/**
	 * Binds a callback for client's request.
	 *
	 * @param id endpoint's id.
	 * @param callback being a function of type `(player: Player, value: never) => void`.
	 */
	export function listen(id: string, callback: ServerListener): void {
		if (listeners[id] === undefined) {
			listeners[id] = [callback];
		} else {
			listeners[id].push(callback);
		}
	}
}
