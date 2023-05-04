import { ComponentId, EntityId } from "../../types/ecs";
import { Immutable } from "../../types/readonly";
import { Observer } from "../observer";
import { ComponentType } from ".";

/*
	//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
	\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
	//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

	Helper Types
*/

export declare type PartialComponentToKeys<T extends ComponentData> = {
	[K in keyof T]?: T[K][EntityId];
};

export declare type GetComponentSchema<C> = C extends Component<infer T> ? T : never;

export declare type Internal<T> = T extends Component<infer K>
	? ComponentInternal<K>
	: T extends Flyweight<infer K>
	? FlyweightInternal<K>
	: T extends TagComponent
	? TagComponentInternal
	: T extends object
	? object & ComponentIdField
	: never;

export declare type AllComponentTypes<T = unknown> =
	| AnyComponent<T>
	| AnyFlyweight<T>
	| TagComponent;

/*
	//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
	\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
	//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

	Component Types
*/

export declare type ComponentData = Record<string, Array<unknown>>;
export declare type FlyweightData = Record<string, unknown>;

export declare type Component<T extends ComponentData> = T & ComponentMethods<T>;
export declare type Flyweight<T extends FlyweightData> = Immutable<T> & FlyweightMethods<T>;
export declare type TagComponent = object & {
	[index: string]: never;
};

export declare type ComponentInternal<T extends ComponentData> = Component<T> &
	ComponentIdField & {
		observers: Array<Observer>;
	};
export declare type FlyweightInternal<T extends FlyweightData> = Flyweight<T> & ComponentIdField;
export declare type TagComponentInternal = object & ComponentIdField;

export declare type AnyComponent<T = unknown> = T extends ComponentData
	? Component<T>
	: Component<{}>;
export declare type AnyFlyweight<T = unknown> = T extends FlyweightData
	? Flyweight<T>
	: Flyweight<{}>;

/*
	//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
	\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
	//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

	Component Composition Types
*/

export declare type ComponentIdField = {
	readonly componentId: ComponentId;
	readonly componentType: ComponentType;
};

export declare type ComponentInternalFields<T extends ComponentData> = ComponentMethods<T> &
	ComponentIdField & {
		observers: Array<Observer>;
	};
export declare type FlyweightInternalFields<T extends FlyweightData> = FlyweightMethods<T> &
	ComponentIdField;

export declare type ComponentMethods<T extends ComponentData> = {
	/**
	 * The default values for this component. This is used when adding a
	 * component to an entity; each property that is specified in this object
	 * will be given to the entity.
	 */
	setDefaults?: () => PartialComponentToKeys<T>;

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
	set(entityId: EntityId, data: PartialComponentToKeys<T>): void;
};
export declare type FlyweightMethods<T extends FlyweightData> = {
	set(data: Partial<T>): void;
};
