import Sift, { None } from "@rbxts/sift";
import { t } from "@rbxts/t";

import { ComponentId, EntityId } from "../types/ecs";
import { Immutable } from "../types/readonly";
import { getNextComponentId, internal_getGlobalEntityId } from "./entity-manager";
import { Observer } from "./observer";

type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

export type AllComponentTypes = AnyComponent | TagComponent | AnyFlyweight;

export type AnyComponent = Component<Tree<Type>>;
export type AnyComponentInternal = ComponentInternal<Tree<Type>>;

export type AnyFlyweight = Flyweight<object>;

export type GetComponentSchema<C> = C extends Component<infer T> ? T : never;

export type ComponentData<T extends Tree<Type>> = T extends Array<infer U> ? Array<U> : T;

export type OptionalKeys<T> = {
	[K in keyof T]:
		| (T[K] extends Array<infer U> ? U : T[K] extends object ? OptionalKeys<T[K]> : never)
		| None;
};

export type Component<T extends Tree<Type>> = Mutable<ComponentData<T>> & {
	/**
	 * The default values for this component. This is used when adding a
	 * component to an entity; each property that is specified in this object
	 * will be given to the entity.
	 */
	defaults?: Partial<OptionalKeys<T>>;
	/**
	 * Clones all the data from one entity to another. This will
	 * overwrite any existing data for the target entity. If you want
	 * to copy specific properties, then you should do this manually.
	 *
	 * @param fromEntityId The entity to copy from.
	 * @param toEntityId The entity to copy to.
	 */
	clone(fromEntityId: EntityId, toEntityId: EntityId): void;
	/**
	 * Resets the data for the given entity to the default values if
	 * they are defined.
	 *
	 * @param entityId The entity to reset.
	 */
	reset(entityId: EntityId): void;
	/**
	 * Sets the data for the given entity.
	 *
	 * The set function is used to update any observers that are
	 * watching the given component. If there are no observers, then it
	 * is recommended to use the component data directly.
	 *
	 * There is no equality check, so it is recommended to only use this
	 * function when the data has changed.
	 *
	 * @param entityId The entity to update.
	 * @param data The data to update.
	 */
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

export type Flyweight<T extends object> = Immutable<T> & {
	set<U extends Partial<T>>(data: U): void;
};

export type FlyweightInternal<T extends object> = Flyweight<T> & ComponentIdField;

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
 * If you want to use a custom type, you can use the `Custom` function to create
 * a component that uses a custom type, and then provide a custom serializer.
 *
 * TODO: Support custom serialization (and serialization of any type).
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

function componentInstantiationCheck(): void {
	assert(
		internal_getGlobalEntityId() === 0,
		"Cannot create a component after entities have been created.",
	);
}

export namespace ComponentInternalCreation {
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
	 * @param schema The properties of the component.
	 *
	 * @returns A single component instance.
	 */
	export function createComponent<T extends Tree<Type>>(schema: T): Component<T> {
		componentInstantiationCheck();

		// TODO: Currently this is hardcoded to use 10000 entities, how can we allow
		// this to be configurable? It should also be possible to resize the array if
		// required (although this would not be desirable).
		const componentData = createComponentArray<T>(schema as T, 10000);
		const observers = new Array<Observer>();
		return Sift.Dictionary.merge(componentData, {
			componentId: getNextComponentId(),
			defaults: undefined,
			observers: observers,

			/**
			 * Clones all the data from one entity to another. This will
			 * overwrite any existing data for the target entity. If you want
			 * to copy specific properties, then you should do this manually.
			 *
			 * @param fromEntityId The entity to copy from.
			 * @param toEntityId The entity to copy to.
			 */
			clone(fromEntityId: EntityId, toEntityId: EntityId): void {
				// eslint-disable-next-line roblox-ts/no-array-pairs
				for (const [key] of pairs(componentData)) {
					componentData[key as never][toEntityId as never] =
						componentData[key as never][fromEntityId as never];
				}
			},

			/**
			 * Resets the data for the given entity to the default values if
			 * they are defined.
			 *
			 * @param entityId The entity to reset.
			 */
			reset(entityId: EntityId): void {
				if (this.defaults === undefined) {
					return;
				}

				// eslint-disable-next-line roblox-ts/no-array-pairs
				for (const [key, value] of pairs(this.defaults)) {
					componentData[key as never][entityId as never] = value as never;
				}
			},

			/**
			 * Sets the data for the given entity.
			 *
			 * The set function is used to update any observers that are
			 * watching the given component. If there are no observers, then it
			 * is recommended to use the component data directly.
			 *
			 * There is no equality check, so it is recommended to only use this
			 * function when the data has changed.
			 *
			 * @param entityId The entity to update.
			 * @param data The data to update.
			 */
			set<U extends Partial<OptionalKeys<T>>>(entityId: EntityId, data: U): void {
				for (const observer of observers) {
					observer.world.observersToUpdate.push([entityId, observer]);
				}

				function setRecursive(someData: U, currentData: Partial<ComponentArray<T>>): void {
					// eslint-disable-next-line roblox-ts/no-array-pairs
					for (const [key, value] of pairs(someData)) {
						if (type(value) === "table") {
							if (type((value as Array<any>)[0]) !== "table") {
								setRecursive(
									value as any,
									currentData[key as keyof ComponentArray<T>] as any,
								);
								continue;
							}
						}

						currentData[key as never][entityId as never] = value as never;
					}
				}

				setRecursive(data, componentData);
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
		componentInstantiationCheck();

		return {
			componentId: getNextComponentId(),
		} as TagComponentInternal;
	}

	/**
	 * Creates a flyweight component; a component that holds data that is
	 * shared between all entities that have the component.
	 *
	 * Flyweight components are useful for minimizing memory usage by only
	 * storing one set of data for a given component. Rather than having an
	 * array of data for each entity, there is only a single set of data.
	 *
	 * @param schema The properties of the component.
	 *
	 * @returns A flyweight component.
	 */
	export function createFlyweight<T extends object>(schema: T): Flyweight<T> {
		componentInstantiationCheck();

		const flyweight = Sift.Dictionary.merge(schema, {
			componentId: getNextComponentId(),

			/**
			 * Sets the data for the flyweight.
			 *
			 * The set function is used to explicitly update the flyweight
			 * data. This a semantic choice to make it clear that the flyweight
			 * data is being updated
			 *
			 * @param data The data to update.
			 */
			set<U extends Partial<T>>(data: U): void {
				// eslint-disable-next-line roblox-ts/no-array-pairs
				for (const [key, value] of pairs(data)) {
					flyweight[key as never] = value as never;
				}
			},
		}) as FlyweightInternal<T>;

		return flyweight as Flyweight<T>;
	}
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
		return new Array<T>(arraySize) as ComponentArray<T>;
	}

	const result: ComponentArray = {};

	// eslint-disable-next-line roblox-ts/no-array-pairs
	for (const [key, value] of pairs(defaultValue)) {
		result[key as keyof Tree<Type>] = createComponentArray(value as Tree<Type>, arraySize);
	}

	return result as ComponentArray<T>;
}
