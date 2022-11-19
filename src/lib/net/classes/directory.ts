import { BaseDirectory, BaseEndpoints, RepositoryDeclaration, RepositoryObjectDeclaration } from "./types";

export class RepositoryClass<T extends RepositoryDeclaration<BaseEndpoints>> implements RepositoryObjectDeclaration<T> {
	protected readonly networkObjects: Map<keyof T, T[keyof T]> = new Map();

	/**
	 * Should construct a directory from everything inside of it.
	 *
	 * @param repository as DirectoryDeclaration, should denote all the events made and registered.
	 */
	constructor(repository: T) {
		for (const [path, networkObject] of pairs(repository)) {
			this.networkObjects.set(path as keyof T, networkObject as T[keyof T]);
		}
	}

	/**
	 * path returns whatever is inside the directory, independant of what it is.
	 *
	 * @param pathTo as string, is the path to retrieve from the directory.
	 * @returns it can be an Endpoint or another directory.
	 */
	public path<X extends keyof T>(pathTo: X): T[X] {
		return this.networkObjects.get(pathTo) as T[X];
	}

	/**
	 * TODO: adding this when i configure it to be dependant on user configuration rather than a set location, tomorrow morning!
	 */
	public developmentOnly(): RepositoryObjectDeclaration<T> {}
}
