// // type Props = Partial<Omit<Component, keyof Component>>;

import Sift, { None } from "@rbxts/sift";
import { t } from "@rbxts/t";

import { ComponentId, EntityId } from "../types/ecs";
import { Immutable } from "../types/readonly";
import { getNextComponentId } from "./entity-manager";

export type AnyComponent = Component<Tree<Type>>;
export type AnyComponentInternal = ComponentInternal<Tree<Type>>;

export type GetComponentSchema<C> = C extends Component<infer T> ? T : never;

export type ComponentInstance<T extends Tree<Type> = Tree<Type>> = Immutable<{
	readonly componentId: ComponentId;
	readonly data: T;
}>;

export type ComponentData<T extends Tree<Type>> = T extends Array<infer U> ? Array<U> : T;

export type OptionalKeys<T> = { [K in keyof T]: (T[K] extends Array<infer U> ? U : never) | None };

type ComponentIdField = { readonly componentId: ComponentId };

export type Component<T extends Tree<Type>> = {
	set<U extends Partial<OptionalKeys<T>>>(entityId: EntityId, data: U): void;
	// get<U extends keyof T>(entityId: EntityId, key: U): T[U] extends Array<infer K> ? K : never;
};

export type ComponentInternal<T extends Tree<Type>> = Component<T> & ComponentIdField & ComponentArray<T>;

export const ComponentTypes = {
	number: [0],
	string: [""],
	boolean: [false],
};

export type TagComponent = {
	[index: string]: never;
};

export type TagComponentInternal = ComponentIdField & {
	[index: string]: never;
};

/**
 *
 * @param schema
 */
export function createComponent<T extends Tree<Type>>(schema: T): Component<T>;
export function createComponent<T extends Tree<Type>>(schema: Tree<Type> = {}): Component<T> {
	const componentData = createComponentArray(schema, 10000);
	return Sift.Dictionary.merge(componentData, {
		componentId: getNextComponentId(),

		set<U extends Partial<OptionalKeys<T>>>(entityId: EntityId, data: U): void {
			// eslint-disable-next-line roblox-ts/no-array-pairs
			for (const [key, value] of pairs(data)) {
				componentData[key as never][entityId as never] = value as never;
			}
		},

		// get<U extends keyof T>(entityId: EntityId, key: U): T[U] extends Array<infer K> ? K : never {
		// 	return componentData[key as never][entityId as never];
		// },
	});
}

/**
 *
 * @returns
 */
export function createTag(): TagComponent {
	return {
		componentId: getNextComponentId(),
	} as TagComponentInternal;
}

/**
 *
 * @param def
 * @param max
 * @returns
 */
export function createComponentArray<T extends Tree<Type>>(def: T, max: number): ComponentArray<T> {
	if (type(def) === "function") {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return new (def as any)(max);
	}

	if (t.array(t.any)(def) === true) {
		if ((def as Array<T>).size() > 0) {
			// return [...new Array<T>(max)].map(def[0 as never]) as never;
			return new Array<T>(max, (def as Array<T>)[0 as never]) as never;
		}
		return new Array<T>(max) as never;
	}

	const ret: ComponentArray = {};

	// eslint-disable-next-line roblox-ts/no-array-pairs
	for (const [key, value] of pairs(def)) {
		ret[key as never] = createComponentArray(value as never, max);
	}
	return ret as never;
}

export type Tree<LeafType> = LeafType | { [key: string]: Tree<LeafType> };

export type Type = ArrayConstructor | Array<unknown>;

export type ComponentArray<T extends Tree<Type> = Tree<Type>> = T extends Array<unknown>
	? T
	: T extends ArrayConstructor
	? Array<typeof ComponentTypes>
	: T extends Exclude<Type, Array<unknown>>
	? InstanceType<T>
	: {
			[key in keyof T]: T[key] extends Tree<Type> ? ComponentArray<T[key]> : never;
	  };
