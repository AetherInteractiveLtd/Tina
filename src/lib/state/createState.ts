/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReplicatedStorage } from "@rbxts/services";

import { IS_CLIENT } from "../util/globals";
import { NetworkEvent } from "./network/NetworkEvent";
import { RemoteNetworkEvent } from "./network/RemoteNetworkEvent";
import { NetworkBoundary } from "./types";
import { checkValidSchema } from "./utilities/checkValidSchema";
import { getOrCreateRemote } from "./utilities/getOrCreateRemote";
import {
	GlobalStateConfig,
	isStateConfig,
	PlayerStateConfig,
	StateConfig,
} from "./utilities/StateConfig";

export type ConvertSchemaToState<T extends {}> = Reconstruct<{
	[K in keyof T]: T[K] extends StateConfig<unknown>
		? ReturnType<T[K]["build"]>
		: T[K] extends {}
		? ConvertSchemaToState<T[K]>
		: never;
}>;

export const States = {
	GlobalState: <T>(initialValue: T) => new GlobalStateConfig(initialValue),
	PlayerState: <T>(initialValue: T) => new PlayerStateConfig(initialValue),
};

export interface StateOptions {
	remote?: NetworkEvent;
	boundary?: NetworkBoundary;
}

// TODO: This can be moved when we have a Tina base folder
const Folder = ReplicatedStorage;
const Remote = getOrCreateRemote("Tina State", Folder);
const Event = new RemoteNetworkEvent(Remote);

const DefaultOptions = {
	boundary: IS_CLIENT ? NetworkBoundary.Client : NetworkBoundary.Server,
	remote: Event,
};

/**
 * Recursively traverses the schema and instantiates the GlobalStates and PlayerStates
 */
export function createReplicatedState<T extends {}>(
	schema: T,
	options: StateOptions = {},
): ConvertSchemaToState<T> {
	checkValidSchema(schema);

	/* Apply default options to the options parameter */
	const stateOptions: Required<StateOptions> = { ...DefaultOptions, ...options };

	function buildStateTree(property: unknown, path: Array<string> = []): any {
		/* Build CrossBoundaryState from StateConfig */
		if (isStateConfig(property)) {
			return property.build(path.join("."), stateOptions);
		}

		/* property is not a StateConfig, create a nested object */
		const clone: Record<string, any> = {};
		for (const [key, value] of pairs(property as Record<string, any>)) {
			clone[key] = buildStateTree(value, [...path, key]);
		}

		return clone;
	}

	return buildStateTree(schema);
}
