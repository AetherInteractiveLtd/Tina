import { ComponentId, EntityId } from "../../types/ecs";
import { SparseSet } from "./sparse-set";

/**
 * An archetype is a collection of components that are stored contiguously in
 * memory. Archetypes are used to optimize entity iteration.
 */
export class Archetype {
    public readonly entities: Array<EntityId>;
    public readonly sparseSet: SparseSet = new SparseSet();

    public change: Array<Archetype> = [];
    public mask: Array<ComponentId>;

    constructor(mask: Array<ComponentId>) {
        this.entities = this.sparseSet.dense;
        this.mask = mask;
    }

    /**
     * Checks if the archetype contains a given entityId
     * @param id The id of the entity to check
     * @returns	True if the entity is in the archetype
     */
    public has(id: EntityId): boolean {
        return this.sparseSet.has(id);
    }
}
