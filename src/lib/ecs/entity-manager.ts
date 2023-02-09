import { EntityId } from "../types/ecs";
import { Archetype } from "./collections/archetype";
import { SparseSet } from "./collections/sparse-set";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { World } from "./world";

let globalEntityId = 0;
let globalComponentId = 0;

export function reset(): void {
	globalEntityId = 0;
	globalComponentId = 0;
}

/** EntityIds that have been used previously ready to be reused. */
const reusableEntityIds: SparseSet = new SparseSet();

/**
 * @returns the next available component id.
 */
export function getNextComponentId(): number {
	return globalComponentId++;
}

/**
 * A class for managing entities within the world.
 *
 * This class is created internally by the {@link World} class, and should not
 * be accessed directly.
 *
 * //TODO: Remove the weird coupling between this and the world class.
 */
export class EntityManager {
	private empty: Archetype = new Archetype([]);
	/** Entities that are pending removal. */
	private entitiesToDestroy: SparseSet = new SparseSet();
	/** The amount of entities currently alive in the world. */
	private size = 0;

	public archetypes: Map<string, Archetype> = new Map();
	public entities: Array<Archetype> = [];
	public updateTo: Array<Archetype> = [];

	/**
	 * @returns True if the entity id is currently in the world.
	 */
	public alive(entityId: EntityId): boolean {
		return this.entities[entityId] !== undefined && this.entities[entityId].has(entityId);
	}

	/**
	 * Creates a new entity in the world.
	 *
	 * @returns The id of the next available entity.
	 */
	public createEntity(): EntityId {
		if (reusableEntityIds.dense.size() > 0) {
			const entityId = reusableEntityIds.dense.pop()!;
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
	 * Removes any entities from the world that has been marked for removal.
	 * @hidden
	 */
	public destroyPendingEntities(): void {
		for (const entityId of this.entitiesToDestroy.dense) {
			this.entities[entityId].sparseSet.remove(entityId);
			reusableEntityIds.add(entityId);
			this.size--;
		}
		this.entitiesToDestroy.dense.clear();
	}

	/**
	 * @returns The next available entity id.
	 */
	public getEntityId(): number {
		return globalEntityId;
	}

	/**
	 * @returns The number of entities that are currently alive in the world.
	 */
	public getNumberOfEntitiesInUse(): number {
		return this.size;
	}

	/**
	 * Removes the given entity from the world, including all its components.
	 * @param entityId The id of the entity to remove.
	 */
	public removeEntity(entityId: EntityId): void {
		this.entitiesToDestroy.add(entityId);
	}

	/** @hidden */
	public updatePending(denseArray: Array<number>): void {
		for (const entityId of denseArray) {
			if (!this.alive(entityId)) {
				return;
			}

			this.entities[entityId].sparseSet.remove(entityId);
			this.entities[entityId] = this.updateTo[entityId];
			this.entities[entityId].sparseSet.add(entityId);
		}
	}

	/**
	 * Internal method for creating an entity.
	 * @param entityId The id of the entity to create.
	 */
	private createEntityInternal(entityId: EntityId): void {
		this.entities[entityId] = this.updateTo[entityId] = this.empty;
		this.empty.sparseSet.add(entityId);
		this.size++;
	}
}
