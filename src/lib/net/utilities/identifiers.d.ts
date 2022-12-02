interface Identifiers {
	/**
	 * Creates an identifier, and it returns a compressed identifier. Can be created from a string.
	 *
	 * @param identifierName a possible identifier to compress.
	 */
	createIdentifier: (identifierName: string) => string;

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
	 * @client (most likely)
	 * @param identifierName identifier to wait for.
	 */
	waitForIdentifier: (identifierName: string) => string;

	/**
	 * @hidden
	 */
	_init: () => void;
}

declare const Identifiers: Identifiers;
export = Identifiers;
