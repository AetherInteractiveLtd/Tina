import Sift from "@rbxts/sift";
import { t } from "@rbxts/t";

import { EntityId } from "../../types/ecs";
import { getNextComponentId, internal_getGlobalEntityId } from "../entity-manager";
import { Observer } from "../observer";
import {
	Component,
	ComponentData,
	ComponentInternal,
	ComponentInternalFields,
	Flyweight,
	FlyweightData,
	FlyweightInternal,
	FlyweightInternalFields,
	PartialComponentToKeys,
	TagComponent,
	TagComponentInternal,
} from "./types";

function Custom<T>(): Array<T> {
	return new Array<T>();
}

export enum ComponentType {
	Component,
	Flyweight,
	Tag,
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
	 * TODO: Currently this is hardcoded to use 10000 entities, how can we allow
	 * this to be configurable? It should also be possible to resize the array if
	 * required (although this would not be desirable).
	 *
	 * @param schema The properties of the component.
	 *
	 * @returns A single component instance.
	 */
	export function createComponent<T extends ComponentData>(schema: T): Component<T> {
		componentInstantiationCheck();

		const componentData = createComponentArray(schema as T, 10000);
		const observers = new Array<Observer>();
		return Sift.Dictionary.merge<[T, ComponentInternalFields<T>]>(componentData, {
			componentId: getNextComponentId(),
			componentType: ComponentType.Component,
			setDefaults: undefined,
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
				for (const [key] of pairs(componentData as ComponentData)) {
					componentData[key][toEntityId] = componentData[key][fromEntityId];
				}
			},

			/**
			 * Resets the data for the given entity to the default values if
			 * they are defined.
			 *
			 * @param entityId The entity to reset.
			 */
			reset(entityId: EntityId): void {
				if (this.setDefaults === undefined) {
					return;
				}

				const data = this.setDefaults();

				// eslint-disable-next-line roblox-ts/no-array-pairs
				for (const [key, value] of pairs(componentData as ComponentData)) {
					print(key, value);
					componentData[key][entityId] = data[key];
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
			set(entityId: EntityId, data: PartialComponentToKeys<T>): void {
				for (const observer of observers) {
					observer.world.observersToUpdate.push([entityId, observer]);
				}

				for (const [key, value] of pairs(data as ComponentData)) {
					componentData[key][entityId] = value;
				}
			},
		}) as ComponentInternal<T>;
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

		const tag: TagComponentInternal = {
			componentId: getNextComponentId(),
			componentType: ComponentType.Tag,
		};
		return tag as TagComponent;
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
	export function createFlyweight<T extends FlyweightData>(schema: T): Flyweight<T> {
		componentInstantiationCheck();

		const flyweight = Sift.Dictionary.merge<[T, FlyweightInternalFields<T>]>(schema, {
			componentId: getNextComponentId(),
			componentType: ComponentType.Flyweight,
			/**
			 * Sets the data for the flyweight.
			 *
			 * The set function is used to explicitly update the flyweight
			 * data. This a semantic choice to make it clear that the flyweight
			 * data is being updated
			 *
			 * @param data The data to update.
			 */
			set(data: Partial<T>): void {
				// eslint-disable-next-line roblox-ts/no-array-pairs
				for (const [key, value] of pairs(data as FlyweightData)) {
					(flyweight as FlyweightData)[key] = value;
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
 * @param componentData The default value to fill the array with.
 * @param arraySize The size of the array to create (the total number of
 * allowed entities).
 *
 * @returns The pre-allocated array.
 */
function createComponentArray<T extends ComponentData>(componentData: T, arraySize: number): T {
	const result: ComponentData = {};

	for (const [key, value] of pairs(componentData as ComponentData)) {
		if (!t.array(t.any)(value)) throw `Invalid component data key: ${key}`;

		result[key] = new Array<typeof value>(arraySize);
	}

	return result as T;
}
