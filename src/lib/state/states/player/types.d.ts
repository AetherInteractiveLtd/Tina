import { EventListener } from "../../../events";
import { StateSetter } from "../../types";

export declare interface PlayerStateImplementation<T = unknown> {
	/**
	 * Replicates state through the network, fires all subscriptions and updates its value for the specified player.
	 *
	 * @param player to who set the value.
	 * @param setter a value or a function.
	 */
	set(player: Player, setter: StateSetter<T>): void;

	/**
	 * Returns an event listener to which you can bind callback functions to hear for mutations (changes) on state.
	 */
	subscribe(): EventListener<[Player, T]>;

	/**
	 * Returns the value.
	 *
	 * @param player from who to retrieve the value.
	 */
	get(player: Player): T | undefined;
}
