/**
 * The default user for abstraction on the User abstract class.
 */
export interface DefaultUser {
	player: Player;

	load(): void;
	unload(): void;
}
