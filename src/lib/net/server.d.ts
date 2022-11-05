export namespace ServerNet {
	export function listen(identifierName: string, callback: (...args: unknown[]) => void): string;
	export function call(identifierName: string, ...args: unknown[]): void;
	export function waitFor(identifierName: string): unknown[];
}
