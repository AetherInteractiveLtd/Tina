import { BaseDirectory, BaseEndpoints, DirectoryDeclaration, DirectoryObjectDeclaration } from "./types";

export class DirectoryClass<T extends DirectoryDeclaration<BaseEndpoints>> implements DirectoryObjectDeclaration<T> {
	protected readonly directory: T = {} as T;

	/**
	 * Should construct a directory from everything inside of it.
	 *
	 * @param _directory as DirectoryDeclaration, should denote all the events made and registered.
	 */
	constructor(_directory: T) {
		for (const [path, networkObject] of pairs(_directory)) {
			this.directory[path as keyof T] = networkObject as T[keyof T];
		}
	}

	/**
	 * path returns whatever is inside the directory, independant of what it is.
	 *
	 * @param pathTo as string, is the path to retrieve from the directory.
	 * @returns it can be an Endpoint or another directory.
	 */
	public path<X extends keyof T>(pathTo: X): T[X] {
		return this.directory[pathTo] as T[X];
	}

	/**
	 * TODO: adding this when i configure it to be dependant on user configuration rather than a set location, tomorrow morning!
	 */
	public developmentOnly(): DirectoryObjectDeclaration<T> {}
}
