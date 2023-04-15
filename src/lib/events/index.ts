import { COND } from "../conditions";
import { Condition } from "../conditions/types";
import { ArrayOrNever, CondFunc, Default, EventNode } from "./types";

export enum EAction {
	COND = "c",
	DO = "d",
}

export class EventListener<T = unknown> {
	private _head!: EventNode;

	protected readonly yieldThreads: Array<thread> = [];

	/**
	 * Respond to an emitted event.
	 *
	 * *NOTE: Carefully check that your parameter types are correct; for example if you have used `Tina.setUserClass`, any `player` is **purposefully** of type `never` so that you may replace it with your custom user class*
	 *
	 * @param func callback, receives latest input (or the emit input).
	 * @returns The same EventListener, any following functions will receive as parameters whatever this function returns.
	 */
	public do<X>(func: (data: T) => X): EventListener<[X]> {
		this._head = {
			value: [func, EAction.DO],
			_next: this._head,
		};

		return this as unknown as EventListener<[X]>;
	}

	/**
	 * Conditions the next do after it, if a callback is passed to it, the callback may hold reference to the data being passed before the condition.
	 *
	 * @returns The same EventListener, conditions do not affect the latest input, the latest input will be passed onto the next do (independently if the condition returns anything).
	 */
	public condition(condition: Condition<T>): EventListener<T> {
		this._head = {
			value: [condition, EAction.COND] as CondFunc,
			_next: this._head,
		};

		return this as unknown as EventListener<T>;
	}

	/**
	 * Awaits for the latest result.
	 *
	 * @returns the latest result.
	 */
	public await(): T {
		this.yieldThreads.push(coroutine.running());

		return coroutine.yield()[0] as T;
	}

	/** @hidden */
	public async call(data: T): Promise<void> {
		let item = this._head;

		let lastArgument = data;
		let lastCondition = true;

		while (item !== undefined) {
			const [handler, _type] = item.value;

			if (_type === EAction.DO) {
				if (lastCondition === true) {
					try {
						lastArgument = handler(lastArgument) as T;
					} catch (e) {
						warn(`[Tina:Event]: There has been an error, more information. ${e}`);
					}
				}
			} else {
				lastCondition = COND.eval(handler, lastArgument);
			}

			item = item._next;
		}

		if (this.yieldThreads.size() > 0) {
			for (const thread of this.yieldThreads) coroutine.resume(thread, lastArgument);
		}
	}
}

export abstract class EventEmitter<Events extends Default | {}> {
	protected readonly events: Record<string, Array<EventListener>> = {};

	/**
	 * Starting point for binding callbacks to a specified event.
	 *
	 * @param token event to connect/bind callbacks to.
	 * @returns an EventListener.
	 */
	public when<T extends keyof Events, U extends Events[T]>(
		token?: T,
	): typeof token extends void
		? EventListener<Events extends Default ? Events["_default"] : never>
		: EventListener<U>;

	public when<T extends keyof Events>(token: T): EventListener<Events[T]>;

	public when(token = "_default"): unknown {
		const event = new EventListener();

		if (!(token in this.events)) {
			const eventsArray: Array<EventListener> = [];
			eventsArray.push(event);

			this.events[token] = eventsArray;
		} else {
			this.events[token].push(event);
		}

		return event;
	}

	/**
	 * Emit the event with the given data.
	 *
	 * @param token event to emit.
	 * @param data of type T which are the parameters passed to the function definition.
	 */
	public emit<T extends keyof Events, S extends ArrayOrNever<Events[T]>>(
		token: T,
		data: S,
	): void {
		if (token in this.events) {
			for (const thread of this.events[token as string]) {
				void thread.call(token === "_default" ? [] : data);
			}
		}
	}

	/**
	 * Disconnects every binded callback to the event specified.
	 *
	 * @param token event to disconnect.
	 */
	public disconnect<T extends keyof Events>(token: T): void {
		if (token in this.events) {
			table.clear(this.events[token as string]);
		}
	}
}
