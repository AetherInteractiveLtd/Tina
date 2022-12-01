/**
 * Checks if the passed value is a Callback.
 *
 * @param func anything that you want to check what is a function
 * @returns a boolean (as a type, it returns a check that is a Callback)
 */
export function isFunction(func: unknown): func is Callback {
	return typeOf(func) === "function";
}
