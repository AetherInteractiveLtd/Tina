import { DefaultUser } from "../user/types";

export interface AudienceDeclaration {
	/**
	 * Lists the given users to the audience.
	 *
	 * @param users as never[] (users) or Player[] (players list), denotes the players to be on the audience.
	 * @returns the same object.
	 */
	list(users: (DefaultUser & unknown)[] | Player[]): AudienceDeclaration;

	/**
	 * Returns the listed players in the audience.
	 *
	 * @example
	 * ```
	 * const audience = new Audience().list(...);
	 * Event.roundStart("mapName", audience.getListed());
	 * ```
	 *
	 * @returns a Player[] array.
	 */
	get(): Player[];

	/**
	 * Cleans the listed players in the audience, used to free memory when no longer neeeded
	 * or to cleanup the table for new players.
	 *
	 * @example
	 * ```
	 * const audience = new Audience().list(...);
	 * ... // Rounds ends
	 * audience.cleanList();
	 * ```
	 *
	 * @returns the same object.
	 */
	clean(): AudienceDeclaration;
}
