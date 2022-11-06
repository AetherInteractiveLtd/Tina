class EventListener<T extends unknown[]> {
	private readonly listeners: Array<Callback> = new Array();

	public do<X>(func: (...args: [...T]) => X): EventListener<[X]> {
		this.listeners.push(func);

		return this as unknown as EventListener<[X]>;
	}

	public async call<T extends unknown[]>(...args: T): Promise<void> {
		let lastCallReturn: unknown[] | undefined;

		for (const handler of this.listeners) {
			lastCallReturn = [handler(...(lastCallReturn ?? args))];
		}
	}
}

export abstract class EventEmitter<Events extends {}> {
	protected readonly events: Map<keyof Events, Array<EventListener<[]>>> = new Map();

	protected when<T extends keyof Events, S extends Parameters<Events[T]>>(token: T): EventListener<S> {
		const hasEvent = this.events.has(token);
		const event = new EventListener<S>();

		if (!hasEvent) {
			const eventsArray: Array<EventListener<S>> = new Array();

			eventsArray.push(event);
			this.events.set(token, eventsArray);
		} else this.events.get(token)!.push(event);

		return event;
	}

	protected async emit<T extends keyof Events, S extends Parameters<Events[T]>>(token: T, ...args: S): Promise<void> {
		const hasEvent = this.events.has(token);
		if (!hasEvent) return;

		for (const thread of this.events.get(token)!) {
			thread.call(...args);
		}
	}
}
