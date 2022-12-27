<<<<<<< HEAD
import { DefaultUserDeclaration } from "../user/default/types";
=======
import { UserType } from "../user/default/types";
>>>>>>> 776117e (endpoints types, renaming, types, structure, etc.)

export interface AudienceDeclaration {
	/**
	 * Lists the given users/players to an audience.
	 *
	 * @param users a list of users or players.
	 */
	list(users: Array<DefaultUserDeclaration> | Array<Player>): AudienceDeclaration;

	/**
	 * Returns the listed players.
	 */
	get(): Array<Player>;

	/**
	 * Returns whether the list of users is empty or not.
	 */
	isEmpty(): boolean;

	/**
	 * Cleans/empties the audience list.
	 */
	clean(): AudienceDeclaration;
}
