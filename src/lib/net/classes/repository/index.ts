import { BaseRepository, RepositoryImplementation } from "./types";

export class Repository<T extends BaseRepository> implements RepositoryImplementation<T> {
	constructor(public readonly repository: T) { }

	public path<X extends keyof T>(pathTo: X): T[X] {
		return this.repository[pathTo];
	}

	public developmentOnly(): RepositoryImplementation<T> {
		return this as RepositoryImplementation<T>;
	}
}
