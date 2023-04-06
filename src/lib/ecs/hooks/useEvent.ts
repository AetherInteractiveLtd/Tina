import { UserInputService } from "@rbxts/services";
import { Queue } from "@rbxts/stacks-and-queues";

import {
	ConnectionLike,
	ConnectionUtil,
	InferSignalParameters,
	SignalLike,
} from "../../util/connection-util";

type Event<E> = {
	queue: Queue<InferSignalParameters<E>>;
	items: () => Generator<InferSignalParameters<E>, void, unknown>;
	cleanup: () => void;
};

type InstanceEvent<I extends Instance, E extends InstanceEventNames<I>> = {
	storage: Map<Instance, { queue: Queue<InferSignalParameters<E>>; connection: ConnectionLike }>;
	items: (instance: I) => Generator<InferSignalParameters<I[E]>, void, unknown>;
	cleanup: (discriminator: I) => void;
};

export function createEvent<E extends SignalLike>(
	event: E,
	predicate?: (...args: InferSignalParameters<E>) => boolean,
): Event<E> {
	const connection = ConnectionUtil.connect(event, (...args: InferSignalParameters<E>) => {
		if (predicate === undefined || predicate(...(args as InferSignalParameters<E>))) {
			queue.push(args);
		}
	});

	const queue = new Queue<InferSignalParameters<E>>();

	/**
	 * @returns
	 */
	function* items(): Generator<InferSignalParameters<E>, void, unknown> {
		while (queue.size() > 0) {
			const args = queue.pop();
			if (args) {
				yield args as InferSignalParameters<E>;
			}
		}
	}

	/**
	 *
	 * @param entityId
	 */
	function cleanup(): void {
		connection.Disconnect!();
	}

	return { queue, items, cleanup };
}

export function createInstanceEvent<I extends Instance, E extends InstanceEventNames<I>>(
	eventType: E,
): InstanceEvent<I, E> {
	const storage = new Map<
		Instance,
		{
			queue: Queue<InferSignalParameters<E>>;
			connection: ConnectionLike;
		}
	>();

	/**
	 *
	 * @param instance
	 * @param event
	 * @returns
	 */
	function* items(instance: I): Generator<InferSignalParameters<I[E]>, void, unknown> {
		const data = storage.get(instance);
		if (!data) {
			createStorage(instance);
			return;
		}

		const entityQueue = data.queue;
		while (entityQueue.size() > 0) {
			const args = entityQueue.pop();
			if (args !== undefined) {
				yield args;
			}
		}
	}

	/**
	 * Creates a storage for a given discriminant and event. This will be
	 * called automatically when the discriminant is first called.
	 *
	 * @param instance
	 * @param event
	 */
	function createStorage(instance: I): void {
		const queue = new Queue<InferSignalParameters<E>>();

		const connection = ConnectionUtil.connect(
			instance[eventType] as RBXScriptSignal,
			(...args: InferSignalParameters<E>) => {
				queue.push(args);
			},
		);

		storage.set(instance, { queue, connection });
	}

	/**
	 *
	 * @param entityId
	 */
	function cleanup(discriminator: I): void {
		const data = storage.get(discriminator);
		if (data) {
			data.connection.Disconnect!();
			storage.delete(discriminator);
		}
	}

	return { storage, items, cleanup };
}

const event = createInstanceEvent("PlayerAdded");

const event1 = createInstanceEvent("AncestryChanged");

const event2 = createEvent(UserInputService.InputBegan);
