import { EntityId } from "../types/ecs";
import { Archetype } from "./collections/archetype";
import { SparseSet } from "./collections/sparse-set";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { World } from "./world";

let globalEntityId = 0;
let globalComponentId = 0;

export function getNextComponentId(): number {
	return globalComponentId++;
}

/**
 * A class for managing entities within the world.
 *
 * This class is created internally by the {@link World} class, and should not
 * be accessed directly.
 *
 * //TODO: Remove the weird coupling between this and the world class;
 * we can take the system manager helpers out of the world class as the user
 * should sparingly use it after world creation.
 */
export class EntityManager {
	public archetypes: Map<string, Archetype>;
	private empty: Archetype;
	public entities: Array<Archetype>;
	private entitiesToDestroy: SparseSet;
	public updateTo: Array<Archetype>;
	private readonly reusableEntityIds: SparseSet;

	private size = 0;

	constructor() {
		this.archetypes = new Map();

		this.reusableEntityIds = new SparseSet();
		this.entitiesToDestroy = new SparseSet();
		this.entities = [];
		this.updateTo = [];
		this.empty = new Archetype([]);
	}

	public getEntityId(): number {
		return globalEntityId;
	}

	public getNextComponentId(): number {
		return globalComponentId++;
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
		if (this.reusableEntityIds.dense.size() > 0) {
			const entityId = this.reusableEntityIds.dense.pop()!;
			this.createEntityInternal(entityId);
			return entityId;
		}

		if (this.size === 0) {
			this.empty.mask = new Array<number>(math.ceil(globalComponentId / 32), 0);
			this.archetypes.set(this.empty.mask.join(","), this.empty);
		}

		this.createEntityInternal(globalEntityId);
		return globalEntityId++;
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
		denseArray.forEach(entityId => {
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
	public destroyPendingEntities(): void {
		for (const entityId of this.entitiesToDestroy.dense) {
			this.entities[entityId].sparseSet.remove(entityId);
			this.reusableEntityIds.add(entityId);
			this.size--;
		}
		this.entitiesToDestroy.dense.clear();
	}
}
