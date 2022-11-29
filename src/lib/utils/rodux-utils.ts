/**
 * Helper function to immutably update an array at the given index.
 * If the value at the given index does not exist, the original array will be returned.
 * @param array The array to update
 * @param index The index to update
 * @param updater The updater function
 * @returns The updated array
 */
export function updateAtIndex<T>(array: Array<T>, index: number, updater: (value: T) => T): Array<T> {
	// No value to update
	if (array[index] === undefined) return array;

	// Copy array and update value
	const copy = table.clone(array);
	copy[index] = updater(copy[index]);
	return copy;
}
