import { COND } from "../conditions";
import { Condition } from "../conditions/types";
import { ArrayOrNever, CondFunc, Default, StepFunc } from "./types";

export enum EAction {
	COND = "c",
	DO = "d",
}

export class EventListener<T extends Array<unknown> = Array<unknown>> {
	private listeners: Array<CondFunc | StepFunc> = [];

	protected readonly yieldThreads: Array<thread> = [];

	/**
	 * Respond to an emitted event.
	 *
	 * *NOTE: Carefully check that your parameter types are correct; for example if you have used `Tina.setUserClass`, any `player` is **purposefully** of type `never` so that you may replace it with your custom user class*
	 *
	 * @param func
	 * @returns The same EventListener chain, any following functions will receive as parameters whatever this function returned.
	 */
	public do<X>(func: (...args: T) => X): EventListener<[X]> {
		this.listeners.push([func, EAction.DO]);

		return this as unknown as EventListener<[X]>;
	}

	/**
	 * Conditions the next do after it, if a callback is passed to it, the callback may hold reference to the data being passed before the condition.
	 *
	 * @returns The same EventListener chain, any following functions will receive as parameters whatever the last do function returned.
	 */
	public condition(condition: Condition<T>): EventListener<T> {
		this.listeners.push([condition, EAction.COND] as CondFunc);

		return this as unknown as EventListener<T>;
	}

	/**
	 * Awaits for the final result on the last do of this chain.
	 */
	public await(): LuaTuple<T> {
		this.yieldThreads.push(coroutine.running());

		let data = coroutine.yield() as LuaTuple<T>;

		return data;
	}

	/**
	 * Clears all the binded conditions and dos to this specific EventListener.
	 */
	public disconnect(): void {
		table.clear(this.listeners);
	}

	/** @hidden */
	public async call<X extends Array<unknown> = Array<unknown>>(...args: X): Promise<void> {
		let lastArgument = args;
		let lastCondition = true;

		for (const [handler, _type] of this.listeners) {
			if (_type === EAction.DO) {
				if (lastCondition === true) {
					try {
						lastArgument = [handler(...lastArgument)] as X;
					} catch (e) {
						warn(`[Tina:Event]: There has been an error, more information. ${e}`);
					}
				}
			} else {
				lastCondition = COND.eval(handler, ...lastArgument);
			}
		}

		if (this.yieldThreads.size() > 0) {
			for (const thread of this.yieldThreads) coroutine.resume(thread, ...lastArgument);
		}
	}
}

export abstract class EventEmitter<Events extends Default | {}> {
	protected readonly events: Record<string, Array<EventListener>> = {};

	/**
	 * Binds an EventListener to your Event, from where you can bind callbacks to be invoked when even is emitted.
	 *
	 * @param token Event to bind to.
	 * @returns An EventListener.
	 */
	public when<X extends keyof Events, U extends Events[X]>(
		token?: X,
	): typeof token extends void
		? EventListener<Events extends Default ? Events["_default"] : never>
		: EventListener<U extends Array<unknown> ? U : never>;

	public when<X extends keyof Events>(token: X): EventListener<ArrayOrNever<Events[X]>>;

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
	 * Emits the event, either resuming the yeilded threads or invoking the do's chain.
	 *
	 * @param token Event to emit.
	 * @param args Type `T`, a single object.
	 */
	public emit<X extends keyof Events, S extends ArrayOrNever<Events[X]>>(
		token: X,
		...args: S
	): void {
		if (token in this.events) {
			for (const thread of this.events[token as string]) {
				void thread.call(...(token === "_default" ? [] : args));
			}
		}
	}

	/**
	 * It clears an Event, deletes and disconnects every event listener binded to it.
	 *
	 * @param token Event to remove EventListeners from.
	 */
	public clear<X extends keyof Events>(token: X): void;

	public clear(token = "_default"): void {
		if (token in this.events) {
			return void table.clear(this.events[token]);
		}
	}
}
