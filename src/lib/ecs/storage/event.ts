import { Queue } from "@rbxts/stacks-and-queues";

import {
	ConnectionLike,
	ConnectionUtil,
	InferSignalParameters,
	SignalLike,
} from "../../util/connection-util";
import { StorageObject } from "../system";

export type Event<E> = StorageObject & {
	queue: Queue<InferSignalParameters<E>>;
	items: () => Generator<InferSignalParameters<E>, void, unknown>;
};

/**
 * Creates an event storage object that stores the arguments of an event
 * connection, and then allows for iteration over the stored arguments.
 *
 * You should create a new event storage object for each event you want to
 * store.
 *
 * For automatic setup and cleanup, you should use the `storage` array on a
 * system. This will automatically call `setup` when the system is enabled, and
 * `cleanup` when the system is disabled or unscheduled.
 *
 * ### Example
 * ```ts
 *class MySystem extends System {
 *    private mouseButtonScrolled = createEvent(UserInputService.InputBegan, (inputObject) => {
 *        return inputObject.UserInputType === Enum.UserInputType.MouseButton1);
 *    });
 *
 *    public configureQueries(world: World): void {
 *        this.storage.push(this.mouseButtonScrolled);
 *    }
 *
 *    public onUpdate(): void {
 *        for (const [inputObject] of this.mouseButtonScrolled.items()) {
 *            // ...
 *        }
 *    }
 * }
 * ```
 *
 *
 * @param event The event to connect to
 * @param predicate An optional predicate to filter whether or not to store
 * the fired event
 * @returns
 */
export function createEvent<E extends SignalLike>(
	event: E,
	predicate?: (...args: InferSignalParameters<E>) => boolean,
): Event<E> {
	/**
	 * The queue of stored arguments from the event.
	 */
	const queue = new Queue<InferSignalParameters<E>>();

	let connection: ConnectionLike | undefined;

	/**
	 * Used to iterate over the stored arguments.
	 *
	 * @note This will clear the queue of any stored events. If you want to
	 * iterate over the events multiple times, you can do so by directly using
	 * the exposed `queue` property.
	 *
	 * ### Example
	 * ```ts
	 * for (const [inputObject] of mouseButtonScrolled.items()) {
	 *   // ...
	 * }
	 * ```
	 */
	function* items(): Generator<InferSignalParameters<E>> {
		while (queue.size() > 0) {
			const args = queue.pop();
			if (args) {
				yield args as InferSignalParameters<E>;
			}
		}
	}

	/**
	 * Creates the connection to the event. By default, this is called just
	 * before systems start to be executed, and should not typically be called
	 * manually. This is useful so that we do not store events that occur before
	 * our world is fully initialized.
	 */
	function setup(): void {
		connection = ConnectionUtil.connect(event, (...args: InferSignalParameters<E>) => {
			if (predicate === undefined || predicate(...(args as InferSignalParameters<E>))) {
				queue.push(args);
			}
		});
	}

	/**
	 * Disconnects the connection to the event, and clears the queue of any
	 * stored events. This will be called automatically when a system is
	 * disabled or unscheduled so should not typically be called manually.
	 */
	function cleanup(): void {
		if (connection) {
			ConnectionUtil.disconnect(connection);
		}
		queue.clear();
	}

	return { cleanup, items, queue, setup };
}
