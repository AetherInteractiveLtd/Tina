import { SparseSet } from "./sparse-set";

/**
 * An archetype is a collection of components that are stored contiguously in
 * memory. Archetypes are used to optimize entity iteration.
 */
export class Archetype {
	public change: Archetype[];
	public mask: number[];
	public readonly entities: number[];
	public readonly sparseSet: SparseSet;

	constructor(mask: number[]) {
		this.change = [];
		this.mask = mask;
		this.sparseSet = new SparseSet();
		this.entities = this.sparseSet.packed;
	}

	public has(x: number) {
		return this.sparseSet.has(x);
	}
}
