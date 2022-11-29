/**
 * Creates a slice of an array, similar to JavaScript's `Array.slice`
 * @param array The array.
 * @param start The start index.
 * @param endPos The end index.
 */
export function slice<TValue extends defined>(
	array: ReadonlyArray<TValue>,
	start?: number,
	endPos?: number,
): Array<TValue> {
	let startIndex = start !== undefined ? start : 0;
	let endPosition = endPos !== undefined ? endPos : array.size();

	if (startIndex < 0) {
		startIndex = array.size() + startIndex;
		endPosition = array.size();
	}

	if (endPosition < 0) {
		endPosition = array.size() + endPosition;
	}

	return array.move(math.max(0, startIndex), endPosition - 1, 0, []);
}
