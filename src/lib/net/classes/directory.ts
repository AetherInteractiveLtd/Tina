import { BaseDirectory, DirectoryDeclaration, DirectoryObjectDeclaration } from "./types";

export class DirectoryClass<T extends BaseDirectory> implements DirectoryObjectDeclaration<T> {
	protected readonly directory: DirectoryDeclaration<T> = {} as DirectoryDeclaration<T>;

	/**
	 * TODO: add functionality.
	 *
	 * @param directory as DirectoryDeclaration, should denote all the events made and registered.
	 */
	constructor(directory: T) {}

	public path<X extends keyof T>(event: X): T[X] {
		return this.directory[event] as T[X];
	}

	/**
	 * TODO: add differentation between production and development enviroment, using yaml transformer.
	 */
	public developmentOnly(): DirectoryObjectDeclaration<T> {}
}
