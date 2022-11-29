/**
 * The default user for abstraction on the User abstract class.
 */
export interface DefaultUser {
	/**
	 * Returns the player from the user reference to it.
	 */
	player(): Player;

	load(): void;
	unload(): void;
}
