/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalState } from "./global-state";
import { GlobalStateConfig, PlayerStateConfig } from "./schema/state-config";
import { isStateConfig } from "./utilities/helper";
import { checkValidSchema } from "./utilities/validate-schema";

type Convert<T extends {}> = Reconstruct<{
	[K in keyof T]: T[K] extends GlobalStateConfig<infer U> ? GlobalState<U> : T[K] extends {} ? Convert<T[K]> : never;
}>;

export const States = {
	GlobalState: <T>(initialValue: T) => new GlobalStateConfig(initialValue),
	PlayerState: <T>(initialValue: T) => new PlayerStateConfig(initialValue),
};

/**
 * Recursively traverses the schema and instantiates the GlobalStates and PlayerStates
 */
export function createState<T extends {}>(schema: T, rootFolder: Instance): Convert<T> {
	checkValidSchema(schema);

	function buildStateTree(property: unknown, path: Array<string> = []): any {
		// Build CrossBoundaryState from StateConfig
		if (isStateConfig(property)) {
			return property.build(rootFolder, path);
		}

		// property is not a StateConfig, create a nested object
		const clone: Record<string, any> = {};
		for (const [key, value] of pairs(property as Record<string, any>)) {
			clone[key] = buildStateTree(value, [...path, key]);
		}

		return clone;
	}

	return buildStateTree(schema);
}
