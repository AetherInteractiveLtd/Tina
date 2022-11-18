import { Entity, EntityId } from "./entity";

export interface WorldOptions {
	/**
	 * Define the initial entity pool size for entities. This is the number of
	 * expected entites in the world. More can be created as needed.
	 */
	entityPoolSize?: number;
}

/**
 * The world is the container for all the ECS data, which stores all the
 * entities and their components, queries, and run systems.
 *
 * Typically there is only a single world, but there is no limit on the number
 * of worlds an application can create.
 */
export class World {
	private numberOfEntities: number;
	private nextId: number;
	private entityStorage: Map<EntityId, Entity>;

	constructor(options: WorldOptions = {}) {
		this.numberOfEntities = 0;
		this.nextId = 1;
		this.entityStorage = new Map<EntityId, Entity>();
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
		return this.createEntity(this.nextId);
	}

	public addAt(entityId: EntityId): Entity {
		return this.createEntity(entityId);
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

	public has(entityId: EntityId): boolean {
		return this.entityStorage.has(entityId);
	}

	/**
	 * Initialises a new entity and adds it to the world.
	 * @returns
	 */
	private createEntity(id: EntityId): Entity {
		if (this.has(id)) {
			throw error(`Entity with id ${id} already exists.`);
		}

		this.numberOfEntities++;

		if (id >= this.nextId) {
			this.nextId = id + 1;
		}

		return new Entity(id);
	}
}
