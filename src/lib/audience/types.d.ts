import Tina from "../..";

export interface AudienceDeclaration {
	/**
	 * Lists the given users to the audience.
	 *
	 * @param users as never[] (users) or Player[] (players list), denotes the players to be on the audience.
	 * @returns the same object.
	 */
	list(users: (Tina.Mirror.User & unknown)[] | Player[]): AudienceDeclaration;

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
	getListed(): Player[];

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
	cleanList(): AudienceDeclaration;
}
