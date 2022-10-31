/* eslint-disable @typescript-eslint/no-explicit-any */
import { RunService, ReplicatedStorage, Players } from "@rbxts/services";

enum EPacketType {
	"invoke",
	"send",
}

interface IPacket {
	players: Player[] | "all";
	packetType: EPacketType;
	contents: any[];
}

const packetQueue: IPacket[] = [];
const RemoteEvent: RemoteEvent = new Instance("RemoteEvent");
RemoteEvent.Parent = ReplicatedStorage;
RemoteEvent.Name = "TinaRemoteEvent";

RunService.PostSimulation.Connect((delta) => {
	const players: Player[] = Players.GetPlayers();
	const sendStructure: Map<Player, any[][]> = new Map();
	packetQueue.forEach((value) => {
		if (value.players === "all") {
			players.forEach((player) => {
				const potential = sendStructure.get(player);
				if (!potential) {
					sendStructure.set(player, [value.contents]);
				}
			});
		} else if (type(value.players) === "table") {
			value.players.forEach((player) => {
				const potential = sendStructure.get(player);
				if (!potential) {
					sendStructure.set(player, [value.contents]);
				}
			});
		}
	});

	players.forEach((player) => {
		RemoteEvent.FireClient(player, sendStructure.get(player));
	});
});



export namespace server {
	export function call(packet: IPacket) {
		packetQueue.push(packet);
	}
}
