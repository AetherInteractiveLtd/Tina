import { EntityId } from "../types/ecs";
import { Archetype } from "./collections/archetype";
import { SparseSet } from "./collections/sparse-set";
import { World } from "./world";

/**
 * A class for managing entities within the world.
 */
export class EntityManager {
	private archetypes: Map<string, Archetype>;
	private empty: Archetype;
	private entities: Archetype[];
	private entitiesToDestroy: SparseSet;
	private nextEntityId: EntityId;
	private updateTo: Archetype[];
	private readonly rm: SparseSet;
	private readonly world: World;

	private componentId = 0;
	private entityId = 0;
	private size = 0;

	constructor(world: World) {
		this.archetypes = new Map();
		this.nextEntityId = 0;
		this.world = world;

		this.rm = new SparseSet();
		this.entitiesToDestroy = new SparseSet();
		this.entities = [];
		this.updateTo = [];
		this.empty = new Archetype([]);
	}

	/**
	 * @returns True if the entity id is currently in the world.
	 */
	public alive(entityId: EntityId): boolean {
		return this.entities[entityId] !== undefined;
	}

	/**
	 * @returns The number of entities that are currently alive in the world.
	 */
	public getNumberOfEntitiesInUse(): number {
		return this.size;
	}

	/**
	 * @returns The id of the next available entity.
	 */
	public createEntity(): number {
		if (this.rm.packed.size() > 0) {
			const entityId = this.rm.packed.pop()!;
			this.createEntityInternal(entityId);
			return entityId;
		}

		if (this.entityId === 0) {
			this.empty.mask = table.create(math.ceil(this.componentId / 32));
			this.archetypes.set(tostring(this.empty.mask), this.empty);
		}

		this.createEntityInternal(this.entityId);
		return this.entityId++;
	}

	/**
	 * Removes the given entity from the world, including all its components.
	 * @param entityId The id of the entity to remove.
	 */
	public removeEntity(entityId: EntityId): void {
		this.entitiesToDestroy.add(entityId);
	}

	/**
	 *
	 * @param entityId
	 */
	private createEntityInternal(entityId: EntityId): void {
		this.entities[entityId] = this.updateTo[entityId] = this.empty;
		this.empty.sparseSet.add(entityId);
		this.size++;
	}

	/**
	 * Removes all the pending entities from the world.
	 * @note This is called internally when a system has completed.
	 */
	private destroyPending(): void {
		for (const entityId of this.entitiesToDestroy.packed) {
			this.entities[entityId].sparseSet.remove(entityId);
			this.rm.add(entityId);
		}
		this.entitiesToDestroy.packed.clear();
	}
}
