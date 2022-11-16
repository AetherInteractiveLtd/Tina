import { DirectoryDeclaration, DirectoryObjectDeclaration } from "../types";

export class DirectoryClass<T extends DirectoryDeclaration> implements DirectoryObjectDeclaration<T> {
	protected readonly directory: Map<keyof T, unknown> = new Map();

	/**
	 * TODO: add functionality.
	 *
	 * @param directory as DirectoryDeclaration, should denote all the events made and registered.
	 */
	constructor(directory: T) {}

	public get<X extends keyof T>(event: X): T[X] {
		return this.directory.get(event)! as T[X];
	}

	/**
	 * TODO: add differentation between production and development enviroment, using yaml transformer.
	 */
	public developmentOnly() {}
}
