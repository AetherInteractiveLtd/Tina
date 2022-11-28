/**
 *
 */
export class SparseSet {
	public dense: number[];
	public sparse: number[];

	constructor() {
		this.dense = [];
		this.sparse = [];
	}

	/**
	 *
	 * @param x
	 * @returns
	 */
	public has(x: number): boolean {
		const sparse = this.sparse[x] !== undefined ? this.sparse[x] : math.huge;
		return sparse < this.dense.size() && this.dense[sparse] === x;
	}

	/**
	 *
	 * @param x
	 */
	public add(x: number): void {
		if (!this.has(x)) {
			this.sparse[x] = this.dense.size();
			this.dense.push(x);
		}
	}

	/**
	 *
	 * @param x
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
