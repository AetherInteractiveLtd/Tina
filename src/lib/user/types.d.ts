/**
 * The default user for abstraction on the User abstract class.
 */
export interface DefaultUserDeclaration {
	player: Player;

	load(): Promise<unknown>;
	unload(): Promise<void>;
}

/**
 * The offline type of user for abstraction on the OfflineUser class.
 */
export interface OfflineUserDeclaration {
	release(): void;
}
