/**
 * A sparse set is a specialized data structure for representing a set of
 * integers. It can be useful in some very narrow and specific cases, namely
 * when the universe of possible values is very large but used very sparingly
 * and the set is iterated often or cleared often.
 *
 * The sparse set will grow as needed to accommodate any values added.
 */
export class SparseSet {
	/** The elements stored in the sparse set. */
	public dense: Array<number> = [];
	/** The size of the sparse set. */
	public size = 0;
	/** An array that maps the set's items to their indices in the dense. */
	public sparse: Array<number> = [];

	/**
	 * Adds the given element to the set.
	 * @param x The element to add.
	 */
	public add(x: number): void {
		if (this.has(x)) {
			return;
		}

		this.sparse[x] = this.size;
		this.dense[this.size] = x;
		this.size++;
	}

	/**
	 * Clears the sparse set.
	 *
	 * This will not free any memory allocated by the sparse set, and will
	 * instead reset the size to 0 for quick reuse.
	 */
	public clear(): void {
		this.size = 0;
	}

	/**
	 * Checks if the given element is in the set.
	 * @param x The element to check.
	 *
	 * @returns `true` if the element is in the set
	 */
	public has(x: number): boolean {
		const sparse = this.sparse[x] ?? math.huge;
		return sparse < this.size && this.dense[sparse] === x;
	}

	/**
	 * Removes the given element from the set.
	 * @param x The element to remove.
	 */
	public remove(x: number): void {
		if (!this.has(x)) {
			return;
		}

		const last = this.dense[this.size - 1];
		this.sparse[last] = this.sparse[x];
		this.dense[this.sparse[x]] = last;
		this.size--;
	}
}
