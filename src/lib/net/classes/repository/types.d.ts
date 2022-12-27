export interface BaseRepository { }

export interface RepositoryImplementation<T extends BaseRepository> {
	/**
	 * @hidden (internals purposes)
	 */
	repository: T;

	/**
	 * Navigates to the closest subdirectory with that name if it exists.
	 *
	 * @param pathTo as string, is the path to retrieve from the directory.
	 * @returns it can be an Endpoint or another directory.
	 */
	path<X extends keyof T>(event: X): T[X];

	/**
	 * TODO: adding this when i configure it to be dependant on user configuration rather than a set location, not sure when I'll need it for real.
	 *
	 * @hidden this shouldn't be exposed.
	 */
	developmentOnly(): RepositoryImplementation<T>;
}
