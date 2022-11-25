import { EntityId } from "../types/ecs";
import { EntityManager } from "./entity-manager";

export interface WorldOptions {
	/**
	 * The name of the world. This can be used for debugging purposes
	 * (potentially useful if you have multiple worlds). Defaults to "World".
	 */
	name?: string;
}

/**
 * The world is the container for all the ECS data, which stores all the
 * entities and their components, queries, and run systems.
 *
 * Typically there is only a single world, but there is no limit on the number
 * of worlds an application can create.
 */
export class World {
	public name: string;
	public readonly entityManager: EntityManager;
	public readonly options: WorldOptions;

	constructor(options: WorldOptions) {
		this.options = options;
		this.name = options.name !== undefined ? options.name : "World";

		this.entityManager = new EntityManager(this);
	}

	/**
	 * Schedule a system to run on the next update.
	 */
	public scheduleSystem(/**system: System */): void {}

	/**
	 * Removes a scheduled system from the execution queue in the world.
	 */
	public endSystem(/**system: System*/): void {}

	/**
	 * Creates a new entity in the world.
	 * @returns The id of the newly created entity.
	 */
	public add(): number {
		return this.entityManager.createEntity();
	}

	/**
	 * Removes the given entity from the world, including all its components.
	 * @param entityId The id of the entity to remove.
	 */
	public remove(entityId: EntityId) {
		this.entityManager.removeEntity(entityId);
	}

	/**
	 * Checks if a given entity is currently in the world.
	 * @param entityId
	 * @returns
	 */
	public has(entityId: EntityId): boolean {
		return this.entityManager.alive(entityId);
	}

	/**
	 * @returns The number of entities currently in the world.
	 */
	public size(): number {
		return this.entityManager.getNumberOfEntitiesInUse();
	}

	/**
	 * Adds a given component to the entity. If the entity already has the
	 * given component, then an error is thrown.
	 * @param data An optional data object to initialise the component with.
	 */
	public addComponent<C>(entityId: EntityId, /**component: ComponentType<C>, */ data: Partial<C>): void {}

	/**
	 * Removes the component of the given type from the entity.
	 */
	public removeComponent(entityId: EntityId /**component: ComponentType<C> */): void {}

	/**
	 * Returns whether the entity has the given component.
	 * @returns Whether the entity has the given component.
	 */
	public hasComponent<C>(entityId: EntityId /**component: ComponentType<C> */): boolean {
		return false;
	}

	/**
	 * Returns whether or not the entity has any of the given components.
	 * @returns
	 */
	public hasSubsetOf(entityId: EntityId /** ...components: ComponentType<any>[] */): boolean {
		return false;
	}

	/**
	 * Returns whether or not the entity has all of the given components.
	 * @returns
	 */
	public hasAllOf(entityId: EntityId /** ...components: ComponentType<any>[] */): boolean {
		return false;
	}

	/**
	 * Returns the component of on the entity of the given type.
	 * @returns
	 */
	public getComponent<C>(entityId: EntityId /**component: ComponentType<C> */): C | undefined {
		return undefined;
	}

	/**
	 * Removes all entities from the world.
	 */
	public clear(): void {}

	/**
	 * Halts the current execution of the world and destroys the world.
	 */
	public destroy(): void {}

	/**
	 * Continues the execution of the world from its current state.
	 */
	public play(): void {}

	/**
	 * Pauses the execution of the world.
	 */
	public pause(): void {}
}
