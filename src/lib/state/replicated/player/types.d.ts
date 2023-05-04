import { EventEmitter } from "../../../events";
import { DefaultUserDeclaration } from "../../../user/default/types";
import { InferredSetter } from "../../types";

export declare interface PlayerStateImplementation<T>
	extends EventEmitter<PlayerStateImplementation<T>> {
	/**
	 * Replicates state through the network, fires all subscriptions and updates its value for the specified player.
	 *
	 * @param user to who set the value.
	 * @param setter a value or a function.
	 */
	set(user: DefaultUserDeclaration, setter: InferredSetter<T>): void;

	/**
	 * Returns the value.
	 *
	 * @param player from who to retrieve the value.
	 */
	get(player: Player): T | undefined;
}
