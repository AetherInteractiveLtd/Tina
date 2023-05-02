import { EntityId } from "../types/ecs";
import { SparseSet } from "./collections/sparse-set";
import { AllComponentTypes, AnyComponent, AnyComponentInternal } from "./component";
import { World } from "./world";

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
export class Observer {
	/** A set of components that must match for an entity to be valid. */
	private requiredComponents: Array<AllComponentTypes> = [];

	/** The world this observer belongs to. */
	public readonly world: World;

	/** The primary component that the observer is watching. */
	public primaryComponent: AllComponentTypes;
	/**
	 * A cache of all entities that match the observer.
	 *
	 * This will store all entities that match the given event, and will not be
	 * flushed until the observer is called.
	 *
	 * If an entity matches an event more than once before the observer is
	 * called, it will only be stored once.
	 */
	public storage: SparseSet = new SparseSet();

	constructor(world: World, component: AllComponentTypes) {
		this.world = world;
		this.primaryComponent = component;
		(component as AnyComponentInternal).observers.push(this);
	}

	/**
	 * Iterates over all entities that match the observer.
	 *
	 * @param callback The callback to run for each entity.
	 */
	public *iter(): Generator<EntityId> {
		for (const entityId of this.storage.dense) {
			let valid = true;

			for (const component of this.requiredComponents) {
				if (valid && !this.world.hasComponent(entityId, component as AnyComponent)) {
					valid = false;
				}
			}

			if (!valid) {
				continue;
			}

			yield entityId;
		}

		this.storage.dense = [];
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
	public with(component: AllComponentTypes): this {
		this.requiredComponents.push(component);

		return this;
	}
}
