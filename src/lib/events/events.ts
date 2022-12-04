import { COND } from "../conditions";
import { Condition } from "../conditions/types";

export enum EAction {
	COND = "c",
	DO = "d",
}

declare type CondFunc = [Condition, EAction.COND];
declare type StepFunc = [Callback, EAction.DO];

export class EventListener<T extends unknown[] = unknown[]> {
	protected readonly listeners: Array<CondFunc | StepFunc> = [];
	protected readonly yieldThreads: Array<thread> = [];

	/**
	 * Respond to an emitted event.
	 *
	 * *NOTE: Carefully check that your parameter types are correct; for example if you have used `Tina.setUserClass`, any `player` is **purposefully** of type `never` so that you may replace it with your custom user class*
	 *
	 * @param func
	 * @returns The same EventListener chain, any following functions will receive as parameters whatever this function returned.
	 */
	public do<X>(func: (...args: [...T]) => X): EventListener<[X]> {
		this.listeners.push([func, EAction.DO]);

		return this as unknown as EventListener<[X]>;
	}

	/**
	 * Conditions the next do after it, if a callback is passed to it, the callback may hold reference to the data being passed before the condition.
	 *
	 * @returns The same EventListener chain, any following functions will receive as parameters whatever the last do function returned.
	 */
	public condition(condition: Condition<T>): EventListener<T> {
		this.listeners.push([condition as Condition, EAction.COND]);

		return this as unknown as EventListener<T>;
	}

	/**
	 * Yields current thread until resumption (emit call).
	 */
	public await(): LuaTuple<unknown[]> {
		this.yieldThreads.push(coroutine.running());

		return coroutine.yield();
	}

	/** @hidden */
	public async call<T extends unknown[]>(...args: T): Promise<void> {
		this._call(0, true, ...args);

		if (this.yieldThreads.size() > 0) {
			for (const thread of this.yieldThreads) coroutine.resume(thread);
		}
	}

	private _call<T extends unknown[]>(iteration: number, conditionPassed?: boolean, ...args: T) {
		if (iteration >= this.listeners.size()) return;

		const [handlerOrCondition, action] = this.listeners[iteration];

		switch (action) {
			case EAction.COND:
				this._call(iteration + 1, COND.eval<T>(handlerOrCondition, ...args), ...args);

				break;

			case EAction.DO:
				if (conditionPassed) {
					try {
						this._call(iteration + 1, conditionPassed, handlerOrCondition(...args));
					} catch (e) {
						warn(e);
					}
				}

				break;
		}
	}
}

export class EventEmitter<Events extends {}> {
	protected readonly events: Map<keyof Events, Array<EventListener<[]>>> = new Map();

	/**
	 * Lets you listen to a specific event from your Events interface definition.
	 *
	 * @param token as string, should be the event to connect to.
	 * @returns an EventListener of type T which are the parameters passed to the function.
	 */
	public when<T extends keyof Events, S extends Parameters<Events[T]>>(token: T): EventListener<S> {
		const hasEvent = this.events.has(token);
		const event = new EventListener<S>();

		if (!hasEvent) {
			const eventsArray: Array<EventListener<S>> = [];

			eventsArray.push(event);
			this.events.set(token, eventsArray);
		} else this.events.get(token)!.push(event);

		return event;
	}

	/**
	 * Emits the event, either resuming the yeilded threads or invoking the do's chain.
	 *
	 * @param token event to emit.
	 * @param args of type T which are the parameters passed to the function definition.
	 * @returns a promise.
	 */
	protected async emit<T extends keyof Events, S extends Parameters<Events[T]>>(token: T, ...args: S): Promise<void> {
		const hasEvent = this.events.has(token);
		if (!hasEvent) return;

		for (const thread of this.events.get(token)!) {
			thread.call(...args);
		}
	}
}
