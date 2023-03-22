import { ComponentId, EntityId } from "../../types/ecs";
import { Query } from "../query";
import { SparseSet } from "./sparse-set";

/**
 * An archetype is a collection of components that are stored contiguously in
 * memory. Archetypes are used to optimize entity iteration.
 *
 * Internally, the archetype stores any entity that has the same set of
 * components, e.g. all entities with both a position and a velocity component.
 * Entities that just have a position component will be stored in a different
 * archetype.
 */
export class Archetype {
	/** All entities that belong to this archetype. */
	public readonly entities: Array<EntityId>;
	public readonly sparseSet: SparseSet = new SparseSet();

	public change: Array<Archetype> = [];
	/**
	 * The type of the archetype denoted by all its relevant components.
	 * */
	public mask: Array<ComponentId>;
	/** All queries that are interested in this archetype. */
	public queries: Array<Query> = [];

	constructor(mask: Array<ComponentId>) {
		this.entities = this.sparseSet.dense;
		this.mask = mask;
	}

	/**
	 * Checks if the archetype contains a given entityId
	 * @param id The id of the entity to check
	 *
	 * @returns	True if the entity is in the archetype
	 */
	public has(id: EntityId): boolean {
		return this.sparseSet.has(id);
	}
}
