type memberof<obj> = obj[keyof obj];

class Event<callback extends defined> {
	_waitingThreads: thread[] = [];
	_callbacks: callback[] = [];
	name = "undefined";

	constructor(name: string) {
		this.name = name;
	}

	do(func: callback): this {
		this._callbacks.push(func);
		return this;
	}

	await(): this {
		this._waitingThreads.push(coroutine.running());
		coroutine.yield();
		return this;
	}

	log(logType: "log" | "err" | "warn", FormatString: string): this {
		const formatted = string.format(FormatString, this.name, os.time());
		switch (logType) {
			case "err":
				error(formatted);
				break;
			case "log":
				print(formatted);
				break;
			case "warn":
				warn(formatted);
				break;
		}
		return this;
	}
}

class EventSystem<EventInterface extends Record<keyof EventInterface, Callback>> {
	events: Map<string, Event<memberof<EventInterface>>> = new Map();

	constructor() {}

	when(eventName: keyof EventInterface): Event<memberof<EventInterface>> {
		if (this.events.get(eventName as string)) {
			return this.events.get(eventName as string) as Event<memberof<EventInterface>>;
		} else {
			const event = new Event<memberof<EventInterface>>(eventName as string);

			this.events.set(eventName as string, event);

			return event;
		}
	}

	fire(eventName: string, ...args: unknown[]) {
		const event = this.events.get(eventName);
		if (event !== undefined) {
			event._callbacks.forEach((callback) => {
				callback(...args);
			});

			if (event._waitingThreads.size() >= 0) {
				event._waitingThreads.forEach((thread) => {
					coroutine.resume(thread);
				});
			}
		}
	}
}

export = EventSystem;
