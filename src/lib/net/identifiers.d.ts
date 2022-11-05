export namespace Identifiers {
	export function createIdentifier(identifierName: string): string;
	export function fromCompressed(compressedIdentifier: string): string;
	export function fromIdentifier(FullIdentifier: string): string;
	export function waitForIdentifier(identifierName: string): string;
}
