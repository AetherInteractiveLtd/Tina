import { ComponentId, EntityId } from "../../types/ecs";
import { SparseSet } from "./sparse-set";

/**
 * An archetype is a collection of components that are stored contiguously in
 * memory. Archetypes are used to optimize entity iteration.
 */
export class Archetype {
	public change: Array<Archetype>;
	public mask: Array<ComponentId>;
	public readonly entities: Array<EntityId>;
	public readonly sparseSet: SparseSet;

	constructor(mask: Array<ComponentId>) {
		this.change = [];
		this.mask = mask;
		this.sparseSet = new SparseSet();
		this.entities = this.sparseSet.dense;
	}

	/**
	 *
	 * @param x
	 * @returns
	 */
	public has(x: number): boolean {
		return this.sparseSet.has(x);
	}
}
