import { isStateConfig } from "./StateConfig";

/**
 * Throws an exception if the passed object doesn't match the expected shape of a State Schema
 * @param schema The Schema
 */
export function checkValidSchema(schema: unknown): void {
	assert(typeIs(schema, "table"), "Schema must be a table");

	function recursiveCheck(object: object): void {
		for (const [key, value] of pairs(object)) {
			assert(typeIs(value, "table"), `Unsupported value found at key: ${key}, ${typeOf(value)}`);

			// Check every value inside nested object
			if (!isStateConfig(value)) {
				recursiveCheck(value);
			}
		}
	}

	recursiveCheck(schema);
}
