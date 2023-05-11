type Int32 = number;

export namespace BitwiseUtils {
	/**
	 * Takes an array of numbers, representative of one large string of bits,
	 * and iterates over these bits in ascending order, returning the index
	 * of every bit that is not 0.
	 * @param val
	 */
	export function* bits(val: Array<Int32>): Generator<number, void, unknown> {
		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const [index, number] of ipairs(val)) {
			for (const bitIndex of $range(1, 32)) {
				if ((number & (1 << bitIndex)) > 0) {
					yield bitIndex + (index - 1) * 32;
				}
			}
		}
	}
}
