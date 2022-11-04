import { IBaseEvents, TEventToken, TInferParameters, TInferReturn } from "./types/events";

class EventListener<T> {
	private readonly listeners: Array<Callback> = new Array();

	public do<X extends TInferReturn<T>>(handler: (...args: TInferParameters<T>) => X): EventListener<X> {
		this.listeners.push(handler);

		return this as unknown as EventListener<X>;
	}

	public call<T extends unknown[]>(...args: T) {
		let lastCallReturn: unknown[] | undefined;

		for (const handler of this.listeners) {
			lastCallReturn = handler(...(lastCallReturn !== undefined ? lastCallReturn : args));
		}
	}
}

export abstract class EventEmitter<Events extends IBaseEvents = {}> {
	private readonly events: Map<TEventToken<Events>, EventListener<Events[TEventToken<Events>]>> = new Map();

	protected when<T extends TEventToken<Events>>(token: T): EventListener<Events[T]> {
		const hasEvent = this.events.has(token);
		let event!: EventListener<Events[T]>;

		if (!hasEvent) {
			const eventListener = new EventListener<Events[T]>();
			this.events.set(token, eventListener);

			event = eventListener;
		} else event = this.events.get(token) as EventListener<Events[T]>;

		return event;
	}

	protected async emit<T extends TEventToken<Events>>(token: T, ...args: TInferParameters<Events[T]>): Promise<void> {
		const event = this.events.get(token);

		if (event !== undefined) event.call(...args);
	}
}
