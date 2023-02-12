import Sift, { None } from "@rbxts/sift";
import { t } from "@rbxts/t";

import { ComponentId, EntityId } from "../types/ecs";
import { getNextComponentId } from "./entity-manager";
import { ECS, Observer } from "./observer";

type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

export type AnyComponent = Component<Tree<Type>>;
export type AnyComponentInternal = ComponentInternal<Tree<Type>>;

export type GetComponentSchema<C> = C extends Component<infer T> ? T : never;

export type ComponentData<T extends Tree<Type>> = T extends Array<infer U> ? Array<U> : T;

export type OptionalKeys<T> = { [K in keyof T]: (T[K] extends Array<infer U> ? U : never) | None };

export type Component<T extends Tree<Type>> = Mutable<ComponentData<T>> & {
	set<U extends Partial<OptionalKeys<T>>>(entityId: EntityId, data: U): void;
};

export type ComponentInternal<T extends Tree<Type>> = Component<T> &
	ComponentIdField & {
		observers: Array<Observer>;
	};

export type TagComponent = {
	[index: string]: never;
};

export type TagComponentInternal = ComponentIdField & {
	[index: string]: never;
};

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

type ComponentIdField = { readonly componentId: ComponentId };

function Custom<T>(init: () => T): [() => T];
function Custom<T>(): Array<T>;
function Custom<T>(init?: () => T): Array<() => T> {
	return init ? [init] : [];
}

/**
 * Types that can be used as component properties. These are the types that can
 * will support built-in serialization.
 *
 * TODO: Support custom serialization (and serialization of any type).
 * If you want to use a custom type, you can use the `Custom` function to create
 * a component that uses a custom type, and then provide a custom serializer.
 */
export const ComponentTypes = {
	Custom,
	Boolean: [false],
	CFrame: [new CFrame()],
	Color3: [new Color3()],
	Number: [0],
	String: [""],
	Vector2: [new Vector2()],
	Vector2int16: [new Vector2int16()],
	Vector3: [new Vector3()],
	Vector3int16: [new Vector3int16()],
};

// const test = createComponent({
// 	x: ComponentTypes.Number,
// });

// test.x[1] = 1;

/**
 * Creates a component that matches the given schema.
 *
 * Internally this creates an array for each property in the schema, where the
 * index of the array matches an entity id. This allows for fast lookups of
 * component data.
 *
 * The array is pre-allocated to the given size, so it is important to ensure
 * that you do not access the component data for an entity that does not exist,
 * or that does not have the component. This is because the array could hold
 * data for a given entity, despite the fact that the entity would be invalid.
 *
 * Components are singletons, and should be created once per component type.
 * Components also persist between worlds, therefore you do not need more than
 * one component per world. EntityIds are global, therefore the index of a
 * given entity will always match the index of the component data.
 *
 * TODO: Currently this is hardcoded to use 10000 entities, how can we allow
 * this to be configurable? It should also be possible to resize the array if
 * required (although this would not be desirable).
 *
 * @param schema The properties of the component.
 *
 * @returns A single component instance.
 */
export function createComponent<T extends Tree<Type>>(schema: T): Component<T> {
	const componentData = createComponentArray<T>(schema as T, 10000);
	const observers = new Array<Observer>();
	return Sift.Dictionary.merge(componentData, {
		componentId: getNextComponentId(),

		observers: observers,

		// TODO: This currently does not use the component schema properly,
		// nested objects are not supported.
		set<U extends Partial<OptionalKeys<T>>>(entityId: EntityId, data: U): void {
			// TODO: Look into removing this check to improve performance.
			// It would be beneficial to just use the component data directly
			// rather than going through this function.
			for (const observer of observers) {
				observer.world.observersToUpdate.push([entityId, observer, ECS.OnChanged]);
			}

			// eslint-disable-next-line roblox-ts/no-array-pairs
			for (const [key, value] of pairs(data)) {
				componentData[key as never][entityId as never] = value as never;
			}
		},
	}) as unknown as ComponentInternal<T>;
}

/**
 * Creates a tag component; a component that has no data.
 *
 * Tags are useful for marking entities as having a certain property, without
 * the overhead of storing any data. For example, you could use a tag component
 * to mark an entity as being a player, and then use a system to query for all
 * entities that have the player tag.
 *
 * Tags are singletons, and should be created once per component type. Tags
 * also persist between worlds, therefore you do not need more than one Tag per
 * world.
 *
 * @returns A tag component.
 */
export function createTag(): TagComponent {
	return {
		componentId: getNextComponentId(),
	} as TagComponentInternal;
}

/**
 * Creates an array of the given size, and fills it with the given default
 * value.
 *
 * @param defaultValue The default value to fill the array with.
 * @param arraySize The size of the array to create (the total number of
 * allowed entities).
 *
 * @returns The pre-allocated array.
 */
function createComponentArray<T extends Tree<Type>>(
	defaultValue: T,
	arraySize: number,
): ComponentArray<T> {
	if (typeOf(defaultValue) === "function") {
		return new (defaultValue as ArrayConstructor)(arraySize) as ComponentArray<T>;
	}

	if (t.array(t.any)(defaultValue) === true) {
		if ((defaultValue as Array<T>).size() > 0) {
			return new Array<T>(arraySize, (defaultValue as Array<T>)[0]) as ComponentArray<T>;
		}

		return new Array<T>(arraySize) as ComponentArray<T>;
	}

	const result: ComponentArray = {};

	for (const [key, value] of pairs(defaultValue as Record<keyof typeof ComponentTypes, T>)) {
		result[key] = createComponentArray(value, arraySize);
	}

	return result as never;
}
