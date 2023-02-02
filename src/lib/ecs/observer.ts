import { EntityId } from "../types/ecs";
import { AnyComponent, AnyComponentInternal, ComponentInternal } from "./component";
import { World } from "./world";

export const enum ECS {
	"OnAdded" = "OnAdded",
	"OnRemoved" = "OnRemoved",
	"OnSet" = "OnChanged",
}

/**
 * An observer is a way to listen for specific events on entities, such as
 * reacting to when a component is added to an entity.
 *
 * An observer acts like a query, therefore the entities that match the
 * observer will only be matched once the observer is called.
 *
 * If a system only ran once per second, all entities that match the given
 * observer will be stored until the system is called, and only flushed once
 * the observer is iterated over.
 *
 */
export class Observer {
	/** A set of components that must match for an entity to be valid. */
	private requiredComponents: Array<AnyComponent> = [];

	public readonly world: World;

	/** The primary component that the observer is watching. */
	public primaryComponent: AnyComponent;
	/**
	 * A cache of all entities that match the given event.
	 *
	 * This will store all entities that match the given event, and will not be
	 * flushed until the observer is called.
	 *
	 * If an entity matches an event more than once before the observer is
	 * called, it will only be stored once.
	 */
	public storage: Map<ECS, Set<EntityId>> = new Map();

	constructor(world: World, component: AnyComponent) {
		this.world = world;
		this.primaryComponent = component;
	}

	/**
	 * Adds a matching event to the observer.
	 *
	 * For example:
	 * ```ts
	 * const onPositionAdded = world.createObserver(Position).event(ECS.OnAdded);
	 * onPositionAdded.forEach((entityId) => {
	 * 	// Called when a position component is added to any entity.
	 * });
	 * ```
	 *
	 * @param eventType The event to match.
	 *
	 * @returns The observer instance.
	 */
	public event(eventType: ECS): this {
		this.storage.set(eventType, new Set());

		if (eventType === ECS.OnSet) {
			(this.primaryComponent as AnyComponentInternal).observers.push(this);
		}

		return this;
	}

	/**
	 * Iterates over all entities that match the observer.
	 *
	 * @param callback The callback to run for each entity.
	 */
	public forEach(callback: (entityId: EntityId) => void): void {
		for (const [event, entities] of this.storage) {
			print(entities);
			for (const entityId of entities) {
				let valid = true;

				for (const component of this.requiredComponents) {
					if (valid && !this.world.hasComponent(entityId, component)) {
						valid = false;
					}
				}

				if (valid) {
					callback(entityId);
				}
			}

			this.storage.set(event, new Set());
		}
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
