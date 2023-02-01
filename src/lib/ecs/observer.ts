import { EntityId } from "../types/ecs";
import { AnyComponent, AnyComponentInternal } from "./component";
import { World } from "./world";

export const enum ECS {
	"OnAdded" = "OnAdded",
	"OnRemoved" = "OnRemoved",
	"OnSet" = "OnSet",
	"Unset" = "Unset",
}

/**
 *
 */
export class Observer {
	private readonly world: World;

	/** A set of components that must match for an entity to be valid. */
	private requiredComponents: Array<AnyComponent> = [];

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
		return this;
	}

	public forEach(callback: (entityId: EntityId) => void): void {
		print("forEach");
		for (const [event, entities] of this.storage) {
			print(entities);
			for (const entityId of entities) {
				print(entityId);
				for (const component of this.requiredComponents) {
					if (!this.world.hasComponent(entityId, component)) {
						continue;
					}
				}

				callback(entityId);
			}

			this.storage.set(event, new Set());
		}
	}

	public has(component: AnyComponent): boolean {
		return true;
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
	 * @param component
	 * @returns
	 */
	public with(component: AnyComponent): this {
		this.requiredComponents.push(component);

		return this;
	}
}

// createObserver (Position, Velocity)

// Map -> AnyComponent to PrimaryComponent?

// addComponent(Velocity)

// if (Observer.has(Velocity)) {
/**
 * Position Velocity
 * Position -> Position
 * Position > Position, Position | Velocity
 */
