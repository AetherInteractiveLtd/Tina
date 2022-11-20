import { Entity, EntityId } from "./entity";
import { EntityManager } from "./entity-manager";

export interface WorldOptions {
	/**
	 * The name of the world. This can be used for debugging purposes
	 * (potentially useful if you have multiple worlds). Defaults to "World".
	 */
	name?: string;
	/**
	 * Define the initial entity pool size for entities. This is the number of
	 * expected entites in the world. More can be created as needed.
	 */
	entityPoolSize: number;
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
	public readonly options: WorldOptions;

	private entityManager: EntityManager;

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
	 */
	public add(): Entity {
		return this.entityManager.createEntity();
	}

	/**
	 * Removes the given entity from the world, including all its components.
	 *
	 * @note If you wish to use the entity class to remove itself from the
	 * world, then use the {@link Entity.delete} method on the entity class.
	 *
	 * @param entityId The id of the entity to remove.
	 */
	public remove(entityId: EntityId) {
		const entity = this.entityManager.getEntityById(entityId);
		if (entity) {
			this.entityManager.removeEntity(entity);
		}
	}

	/**
	 * @returns The number of entities currently in the world.
	 */
	public size(): number {
		return this.entityManager.getNumberOfEntitiesInUse();
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
	 * Checks if a given entity is currently in the world.
	 * @param entityId
	 * @returns
	 */
	public has(entityId: EntityId): boolean {
		return this.entityManager.getEntityById(entityId) !== undefined;
	}
}
