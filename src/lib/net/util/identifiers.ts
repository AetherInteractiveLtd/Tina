/* eslint-disable roblox-ts/lua-truthiness */

import { RunService } from "@rbxts/services";

export namespace Identifiers {
	let autoSerde: Folder | undefined;
	let numOfSerials = 0;

	const limit = 65536;

	const receiveDict: { [x: string]: unknown } = {};
	const sendDict: { [x: string]: string | undefined } = {};

	const isServer = RunService.IsServer();

	/** @hidden */
	export function init(): void {
		if (!isServer) {
			autoSerde = script.WaitForChild("auto_serde") as Folder;

			for (const [id, value] of autoSerde.GetAttributes()) {
				sendDict[id] = value as string;
				receiveDict[value as never] = id;
			}

			autoSerde.AttributeChanged.Connect((id: string) => {
				const packed = autoSerde?.GetAttribute(id) as string;

				if (packed !== undefined) {
					sendDict[id] = packed;
					receiveDict[packed as never] = id;
				} else {
					const old = sendDict[id];

					sendDict[id] = undefined;
					receiveDict[old as never] = undefined;
				}
			});
		} else {
			autoSerde = new Instance("Folder");
			autoSerde.Name = "auto_serde";
			autoSerde.Parent = script;
		}
	}

	/**
	 * Creates a unique identifier for an endpoint, if it's on client it awaits for the result.
	 *
	 * @server
	 *
	 * @param id an id to compress from.
	 */
	export function create(): string {
		const current = ++numOfSerials;
		const id = tostring(current);

		if (current >= limit) {
			throw `Over the identification cap ${id}`;
		}

		if (!sendDict[id] && !isServer) {
			return Identifiers.await(id);
		} else if (sendDict[id] && !isServer) {
			return sendDict[id]!;
		}

		const packed = string.pack("H", current);
		autoSerde?.SetAttribute(id, packed);

		sendDict[id] = packed;
		receiveDict[packed] = id;

		numOfSerials = current;

		return packed;
	}

	/**
	 * Yields current thread waiting for the identifier existence.
	 *
	 * @client
	 *
	 * @param identifierName identifier to wait for.
	 */
	export function await(id: string): string {
		let identifier =
			sendDict[id] ||
			((autoSerde?.Parent !== undefined ? autoSerde.GetAttribute(id) : undefined) as string);

		if (identifier) {
			return identifier;
		} else {
			task.delay(2, () => {
				throw `[Networking]: Infinite yield possible within ${id}`;
			});

			do {
				identifier =
					sendDict[id] ||
					((autoSerde?.Parent !== undefined
						? autoSerde.GetAttribute(id)
						: undefined) as string);
			} while (identifier !== undefined);

			sendDict[id] = identifier;

			return identifier;
		}
	}

	/**
	 * Returns the initial decompressed identifier.
	 *
	 * @param compressedIdentifier compressed identifier.
	 */
	export function fromCompressed(compressed: string): string | undefined {
		return receiveDict[compressed] as string;
	}

	/**
	 * Compressed identifier is returned.
	 *
	 * @param fullIdentifier identifier string.
	 */
	export function fromIdentifier(identifier: string): string | undefined {
		return sendDict[identifier];
	}
}
