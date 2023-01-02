interface Identifiers {
	/**
	 * Creates a unique identifier for an endpoint, if it's on client it awaits for the result.
	 * Creates a unique identifier for an endpoint, if it's on client it awaits for the result.
	 *
	 * @param id an id to compress from.
	 * @param id an id to compress from.
	 */
	create: () => string;

	/**
	 * Returns the initial decompressed identifier.
	 *
	 * @param compressedIdentifier compressed identifier.
	 */
	fromCompressed: (compressedIdentifier: string) => string;

	/**
	 * Compressed identifier is returned.
	 *
	 * @param fullIdentifier identifier string.
	 */
	fromIdentifier: (fullIdentifier: string) => string;

	/**
	 * Yields current thread waiting for the identifier existance.
	 *
	 * @client
	 * @client
	 * @param identifierName identifier to wait for.
	 */
	await: (identifierName: string) => string;
	await: (identifierName: string) => string;

	/**
	 * @hidden
	 */
	_init: () => void;
}

declare const Identifiers: Identifiers;
export = Identifiers;
