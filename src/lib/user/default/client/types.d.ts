export interface ClientUserImplementation {
	player: Player;

	/**
	 * Sets a character CFrame to the provided CFrame/BasePart's CFrame.
	 *
	 * @client
	 *
	 * @param to the CFrame or BasePart where the character should be moved to.
	 */
	move(to: CFrame | BasePart): void;
}
