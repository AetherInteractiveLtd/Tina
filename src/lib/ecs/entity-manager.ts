import { EntityId } from "../types/ecs";
import { Archetype } from "./collections/archetype";
import { SparseSet } from "./collections/sparse-set";
import { World } from "./world";

/**
 * A class for managing entities within the world.
 */
export class EntityManager {
	public archetypes: Map<string, Archetype>;
	private empty: Archetype;
	public entities: Array<Archetype>;
	private entitiesToCreate: SparseSet;
	private entitiesToDestroy: SparseSet;
	public updateTo: Array<Archetype>;
	private readonly rm: SparseSet;
	private readonly world: World;

	private componentId = 0;
	private entityId = 0;
	private size = 0;

	constructor(world: World) {
		this.archetypes = new Map();
		this.world = world;

		this.rm = new SparseSet();
		this.entitiesToCreate = new SparseSet();
		this.entitiesToDestroy = new SparseSet();
		this.entities = [];
		this.updateTo = [];
		this.empty = new Archetype([]);
	}

	public getEntityId(): number {
		return this.entityId;
	}

	public getNextComponentId(): number {
		return this.componentId++;
	}

	/**
	 * @returns True if the entity id is currently in the world.
	 */
	public alive(entityId: EntityId): boolean {
		return this.entities[entityId] !== undefined && this.entities[entityId].sparseSet.has(entityId);
	}

	/**
	 * @returns The number of entities that are currently alive in the world.
	 */
	public getNumberOfEntitiesInUse(): number {
		return this.size;
	}

	/**
	 * Creates a new entity in the world.
	 *
	 * @returns The id of the next available entity.
	 */
	public createEntity(): EntityId {
		if (this.rm.dense.size() > 0) {
			const entityId = this.rm.dense.pop()!;
			this.createEntityInternal(entityId);
			return entityId;
		}

		if (this.entityId === 0) {
			this.empty.mask = new Array<number>(math.ceil(this.componentId / 32), 0);
			this.archetypes.set(this.empty.mask.join(","), this.empty);
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

	/** @hidden */
	public updatePending(denseArray: Array<number>): void {
		denseArray.forEach((entityId) => {
			if (this.alive(entityId)) {
				this.entities[entityId].sparseSet.remove(entityId);
				this.entities[entityId] = this.updateTo[entityId];
				this.entities[entityId].sparseSet.add(entityId);
			}
		});
	}

	/**
	 * Removes any entities from the world that has been marked for removal.
	 * @hidden
	 */
	public destroyPending(): void {
		for (const entityId of this.entitiesToDestroy.dense) {
			this.entities[entityId].sparseSet.remove(entityId);
			this.rm.add(entityId);
			this.size--;
		}
		this.entitiesToDestroy.dense.clear();
	}
}
