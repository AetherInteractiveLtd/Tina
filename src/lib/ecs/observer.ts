import { EntityId } from "../types/ecs";
import { AnyComponent, Component, GetComponentSchema, Tree, Type } from "./component";
import { World } from "./world";

type ChangeStorage<T extends Tree<Type>> = {
	old: GetComponentSchema<T> | undefined;
	new: GetComponentSchema<T> | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PickOne<T> = {
	[P in keyof T]: Record<P, T[P]> & Partial<Record<Exclude<keyof T, P>, undefined>>;
}[keyof T];

/**
 * An observer is a way to listen for when an entity's data changes.
 *
 * The observer will only be called when the data has been changed via the
 * component `set` method, therefore you should ensure that any updates needed
 * are made this way.
 *
 * An observer acts like a query, therefore the entities that match the
 * observer will only be matched once the observer is called.
 *
 * If a system only ran once per second, all entities that match the given
 * observer will be stored until the system is called, and only flushed once
 * the observer is iterated over.
 *
 * @note Do not create an observer directly, instead use the
 * {@link World.createObserver} method, otherwise any changes will not be
 * registered.
 */
export class Observer<T extends Tree<Type>> {
	/** A set of components that must match for an entity to be valid. */
	private requiredComponents: Array<AnyComponent> = [];

	/** The world this observer belongs to. */
	public readonly world: World;

	/** The primary component that the observer is watching. */
	public primaryComponent: AnyComponent;
	/**
	 * A cache of all entities that match the observer.
	 *
	 * This will store all entities that match the given event, and will not be
	 * flushed until the observer is called.
	 *
	 * If an entity matches an event more than once before the observer is
	 * called, it will only be stored once.
	 */
	public storage: Set<EntityId> = new Set();

	/**
	 * TODO: It would be nice to get the "old" data when we observe the change.
	 * How can we do this? We can't just have a copy of the data because it is
	 * not stored together.
	 * @hidden */
	private testStorage: Map<EntityId, ChangeStorage<T>> = new Map();

	constructor(world: World, component: Component<T>) {
		this.world = world;
		this.primaryComponent = component;
	}

	/**
	 * Iterates over all entities that match the observer.
	 *
	 * @param callback The callback to run for each entity.
	 */
	public forEach(callback: (entityId: EntityId) => void): void {
		for (const entityId of this.storage) {
			let valid = true;

			for (const component of this.requiredComponents) {
				if (valid && !this.world.hasComponent(entityId, component)) {
					valid = false;
				}
			}

			if (!valid) {
				continue;
			}

			callback(entityId);
		}

		this.storage.clear();
	}

	/**
	 * Ensures that any entities that match the observer also have a given
	 * component.
	 *
	 * Within each forEach call for each entity, this is syntactic sugar for:
	 * ```ts
	 * if (!world.hasComponent(component)) {
	 *     return;
	 * }
	 * ```
	 *
	 * @param component The component to check for.
	 *
	 * @returns The observer instance.
	 */
	public with(component: AnyComponent): this {
		this.requiredComponents.push(component);

		return this;
	}
}
