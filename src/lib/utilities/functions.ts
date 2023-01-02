/**
 * Offers a variety of methods for functions, most checkers or runners.
 */
export namespace FunctionUtil {
	let freeThread: unknown;

	// eslint-disable-next-line no-inner-declarations
	function acquireRunnerThreadAndCallEventHandler(func: Callback, ...args: Array<unknown>): void {
		const acquiredThread = freeThread;
		freeThread = undefined;

		func(...args);

		freeThread = acquiredThread;
	}

	// eslint-disable-next-line no-inner-declarations
	function runOn(...args: [Callback, ...Array<unknown>]): void {
		acquireRunnerThreadAndCallEventHandler(...args);

		// eslint-disable-next-line no-constant-condition
		while (true) {
			acquireRunnerThreadAndCallEventHandler(...(coroutine.yield() as unknown as [Callback, Array<unknown>]));
		}
	}

	/**
	 * Checks if the passed value is a Callback.
	 *
	 * @param func anything that you want to check what is a function
	 * @returns a boolean (as a type, it returns a check that is a Callback)
	 */
	export function isFunction(func: unknown): func is Callback {
		return typeOf(func) === "function";
	}

	/**
	 * Used to run asynchronous tasks in a free thread.
	 *
	 * @param func a function to run.
	 * @param args arguments passed to the function to run.
	 */
	export function runOnFreeThread(func: Callback, ...args: Array<unknown>): void {
		runOn(func, ...args);
	}
}
