import { Entity, EntityId } from "./entity";

/**
 * The world is the container for all the ECS data, which stores all the
 * entities and their components, queries, and run systems.
 *
 * Typically there is only a single world, but there is no limit on the number
 * of worlds an application can create.
 */
export class World {
	private numberOfEntities: number;

	constructor() {
		this.numberOfEntities = 0;
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
	 */
	public add(): Entity {
		return this.createEntity();
	}

	/**
	 * Removes the given entity from the world, including all its components.
	 *
	 * @note If you wish to use the entity class to remove itself from the
	 * world, then use the {@link Entity.delete} method on the entity class.
	 *
	 * @param entityId The id of the entity to remove.
	 */
	public remove(entityId: EntityId) {}

	/**
	 * @returns The number of entities currently in the world.
	 */
	public size(): number {
		return this.numberOfEntities;
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

	/**
	 * Initialises a new entity and adds it to the world.
	 * @returns
	 */
	private createEntity(): Entity {
		const id = 0; // TODO: Generate a unique id.
		return new Entity(id);
	}
}
