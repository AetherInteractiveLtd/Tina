/**
 * Offers a variety of table utility methods that can be used to interact, modify or anything really
 * that has to do with tables.
 *
 * Some of the most usefuls are `.filter()` and `.deepCopy()`.
 */
export namespace TableUtil {
	export function deepCopy(t: { [x: string]: unknown }) {
		const copyOfT: { [x: string]: unknown } = {};

		for (const [key, value] of pairs(t)) {
			if (typeOf(value) === "table") {
				copyOfT[key] = deepCopy(value as {});
			} else {
				copyOfT[key] = value;
			}
		}

		return copyOfT;
	}

	export function reconcile(t: { [x: string]: unknown }, template: { [x: string]: unknown }) {
		for (const [key, value] of pairs(template)) {
			if (t[key] === undefined) {
				if (type(value) === "table") {
					t[key] = deepCopy(value as {});
				} else {
					t[key] = value;
				}
			} else if (type(t[key]) === "table" && type(template[key] === "table")) {
				reconcile(t[key] as {}, value as {});
			}
		}
	}

	export function filter(t: { [x: string]: unknown } | Map<string, unknown>, filterFunc: (item: unknown) => boolean) {
		const filteredT: { [x: string]: unknown } = {};

		for (const [key, value] of pairs(t)) {
			if (!filterFunc(value)) continue;

			filteredT[key] = value;
		}

		return filteredT;
	}
}
