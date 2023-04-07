/* eslint-disable roblox-ts/lua-truthiness */

import { RunService } from "@rbxts/services";

export namespace Identifiers {
	let identifiers: Folder | undefined;
	let numOfSerials = 0;

	const limit = 65536;

	const receiveDict: { [x: string]: string | undefined } = {};
	const sendDict: { [x: string]: string | undefined } = {};

	const isServer = RunService.IsServer();

	/** @hidden */
	export function init(): void {
		if (!script.FindFirstChild("auto_serde")) {
			identifiers = new Instance("Folder");
			identifiers.Name = "auto_serde";
			identifiers.Parent = script;
		}

		if (!isServer) {
			identifiers = script.WaitForChild("auto_serde") as Folder;

			for (const [id, value] of identifiers.GetAttributes()) {
				sendDict[id] = value as string;
				receiveDict[value as never] = id;
			}

			identifiers.AttributeChanged.Connect((id: string) => {
				const packed = identifiers?.GetAttribute(id) as string;

				if (packed !== undefined) {
					sendDict[id] = packed;
					receiveDict[packed as never] = id;
				} else {
					const old = sendDict[id];

					sendDict[id] = undefined;
					receiveDict[old as never] = undefined;
				}
			});
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
		const current = numOfSerials++;
		const id = tostring(current);

		if (current >= limit) {
			throw `Over the identifier cap ${id}`;
		}

		/**
		 * First checks for it to be the client, if so, it awaits
		 * the identifier to exist.
		 *
		 * Second check is for it to be client but the identifier it's already there, if so,
		 * return it directly.
		 */
		if (!sendDict[id] && !isServer) {
			return Identifiers.await(id);
		} else if (sendDict[id] && !isServer) {
			return sendDict[id]!;
		}

		const packed = string.pack("H", current);
		identifiers?.SetAttribute(id, packed);

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
			((identifiers?.Parent !== undefined
				? identifiers.GetAttribute(id)
				: undefined) as string);

		if (identifier) {
			return identifier;
		} else {
			task.delay(2, () => {
				throw `[Networking]: Infinite yield possible within ${id}`;
			});

			do {
				identifier =
					sendDict[id] ||
					((identifiers?.Parent !== undefined
						? identifiers.GetAttribute(id)
						: undefined) as string);
			} while (identifier !== undefined);

			sendDict[id] = identifier;

			return identifier;
		}
	}

	/**
	 * Returns the initial decompressed identifier.
	 *
	 * @param compressed compressed identifier.
	 */
	export function decompress(compressed: string): string | undefined {
		return receiveDict[compressed];
	}

	/**
	 * Compressed identifier is returned.
	 *
	 * @param fullIdentifier identifier string.
	 */
	export function compress(identifier: string): string | undefined {
		return sendDict[identifier];
	}
}
