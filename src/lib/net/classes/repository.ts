import { RepositoryDeclaration, RepositoryObjectDeclaration } from "./types";

export class Repository<T extends RepositoryDeclaration> implements RepositoryObjectDeclaration<T> {
	/**
	 * A Repository is a Networking Object used to store other Networking Objects, such as Remotes and another repositories.
	 *
	 * @param repository as DirectoryDeclaration, should denote all the events made and registered.
	 */
	constructor(private readonly repository: T) {}

	/**
	 * Navigates to the closest subdirectory with that name if it exists.
	 *
	 * @param pathTo as string, is the path to retrieve from the directory.
	 * @returns it can be an Endpoint or another directory.
	 */
	public path<X extends keyof T>(pathTo: X): T[X] {
		return this.repository[pathTo];
	}

	/**
	 * TODO: adding this when i configure it to be dependant on user configuration rather than a set location, not sure when I'll need it for real.
	 */
	public developmentOnly(): RepositoryObjectDeclaration<T> {
		return this as RepositoryObjectDeclaration<T>;
	}
}
