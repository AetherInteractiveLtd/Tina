export class SparseSet {
	public packed: number[];
	public sparse: number[];

	constructor() {
		this.packed = [];
		this.sparse = [];
	}

	public has(x: number) {
		return this.sparse[x] < this.packed.size() && this.packed[this.sparse[x]] === x;
	}

	public add(x: number) {
		if (!this.has(x)) {
			this.sparse[x] = this.packed.size();
			this.packed.push(x);
		}
	}

	public remove(x: number) {
		if (this.has(x)) {
			const last = this.packed.pop()!;
			if (x !== last) {
				this.sparse[last] = this.sparse[x];
				this.packed[this.sparse[x]] = last;
			}
		}
	}
}
