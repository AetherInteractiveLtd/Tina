/**
 * A sparse set is a specialized data structure for representing a set of
 * integers. It can be useful in some very narrow and specific cases, namely
 * when the universe of possible values is very large but used very sparingly
 * and the set is iterated often or cleared often.
 *
 * The sparse set will grow as needed to accommodate values added.
 */
export class SparseSet {
	/** The elements stored in the sparse set. */
	public dense: Array<number>;
	/** An array that maps the set's items to their indices in the dense. */
	public sparse: Array<number>;

	constructor() {
		this.dense = [];
		this.sparse = [];
	}

	/**
	 * Checks if the given element is in the set.
	 * @param x The element to check.
	 * @returns `true` if the element is in the set
	 */
	public has(x: number): boolean {
		const sparse = this.sparse[x] ?? math.huge;
		return sparse < this.dense.size() && this.dense[sparse] === x;
	}

	/**
	 * Adds the given element to the set.
	 * @param x The element to add.
	 */
	public add(x: number): void {
		if (!this.has(x)) {
			this.sparse[x] = this.dense.size();
			this.dense.push(x);
		}
	}

	/**
	 * Removes the given element from the set.
	 * @param x The element to remove.
	 */
	public remove(x: number): void {
		if (this.has(x)) {
			const last = this.dense.pop()!;
			if (x !== last) {
				this.sparse[last] = this.sparse[x];
				this.dense[this.sparse[x]] = last;
			}
		}
	}
}
